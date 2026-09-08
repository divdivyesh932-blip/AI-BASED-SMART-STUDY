// Smart Task Prioritizer with AI Matrix Scoring
(function() {
  const Prioritizer = {
    currentFilter: 'all',
    currentSort: 'ai-priority',
    viewMode: 'list', // 'list' or 'matrix'

    init: function() {
      this.bindEvents();
      this.render();
    },

    getTasks: function() {
      return window.SSA_State ? window.SSA_State.tasks : window.SSA_DATA.tasks;
    },

    getSubjects: function() {
      return window.SSA_State ? window.SSA_State.subjects : window.SSA_DATA.subjects;
    },

    save: function() {
      if (window.SSA_App && window.SSA_App.saveState) {
        window.SSA_App.saveState();
      }
    },

    // AI Priority Score Calculation Engine
    // Factors: Urgency (days left), Difficulty, Duration, Category importance
    calculateAIScore: function(task) {
      let score = 0;

      // 1. Urgency Component (Max 45 pts)
      const days = task.daysLeft !== undefined ? task.daysLeft : 7;
      let urgencyScore = 0;
      if (days <= 1) urgencyScore = 45;
      else if (days <= 2) urgencyScore = 38;
      else if (days <= 3) urgencyScore = 30;
      else if (days <= 5) urgencyScore = 20;
      else if (days <= 7) urgencyScore = 12;
      else urgencyScore = 5;

      // 2. Difficulty Component (Max 25 pts)
      let diffScore = 0;
      if (task.difficulty === 'Hard') diffScore = 25;
      else if (task.difficulty === 'Medium') diffScore = 16;
      else diffScore = 8;

      // 3. Category Weight (Max 20 pts)
      let catScore = 10;
      switch(task.category) {
        case 'Exam Prep': catScore = 20; break;
        case 'Lab Work': catScore = 18; break;
        case 'Assignment': catScore = 16; break;
        case 'Project': catScore = 14; break;
        case 'Placement Prep': catScore = 15; break;
        default: catScore = 10;
      }

      // 4. Estimated Time / Workload factor (Max 10 pts)
      const mins = task.estimatedMinutes || 60;
      let timeScore = 5;
      if (mins >= 120) timeScore = 10;
      else if (mins >= 60) timeScore = 7;
      else timeScore = 4;

      score = Math.min(100, Math.round(urgencyScore + diffScore + catScore + timeScore));

      let level = "Low";
      if (score >= 75) level = "High";
      else if (score >= 50) level = "Medium";

      // AI Rationale Generator
      let rationale = "";
      if (level === "High") {
        rationale = `High Priority: Due in ${days <= 1 ? 'under 24h' : days + ' days'} with ${task.difficulty.toLowerCase()} difficulty. Requires focused prime-time block.`;
      } else if (level === "Medium") {
        rationale = `Medium Priority: Manageable ${mins} min session. Best scheduled during afternoon/evening study slots.`;
      } else {
        rationale = `Low Priority: Comfortable ${days} day buffer. Safe to tackle during lighter study blocks or weekends.`;
      }

      return { score, level, rationale };
    },

    render: function() {
      const container = document.getElementById('tasks-container');
      if (!container) return;

      const tasks = this.getTasks();
      const subjects = this.getSubjects();

      // Recalculate AI scores to keep updated
      tasks.forEach(t => {
        if (!t.priorityScore || !t.priorityLevel) {
          const ai = this.calculateAIScore(t);
          t.priorityScore = ai.score;
          t.priorityLevel = ai.level;
          t.rationale = ai.rationale;
        }
      });

      // Filter tasks
      let filtered = tasks.filter(t => {
        if (this.currentFilter === 'all') return true;
        if (this.currentFilter === 'high') return t.priorityLevel === 'High' && !t.completed;
        if (this.currentFilter === 'medium') return t.priorityLevel === 'Medium' && !t.completed;
        if (this.currentFilter === 'low') return t.priorityLevel === 'Low' && !t.completed;
        if (this.currentFilter === 'completed') return t.completed;
        if (this.currentFilter === 'pending') return !t.completed;
        return true;
      });

      // Sort tasks (AI Priority: Highest score first, then completed at bottom)
      filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (this.currentSort === 'ai-priority') return b.priorityScore - a.priorityScore;
        if (this.currentSort === 'deadline') return a.daysLeft - b.daysLeft;
        if (this.currentSort === 'difficulty') {
          const order = { 'Hard': 3, 'Medium': 2, 'Easy': 1 };
          return order[b.difficulty] - order[a.difficulty];
        }
        return 0;
      });

      // Top most important task highlight
      const topTask = tasks.filter(t => !t.completed).sort((a, b) => b.priorityScore - a.priorityScore)[0];
      this.renderTopTaskBanner(topTask, subjects);

      if (this.viewMode === 'matrix') {
        this.renderMatrixView(container, tasks, subjects);
      } else {
        this.renderListView(container, filtered, subjects);
      }

      this.updateTaskCounters();
    },

    renderTopTaskBanner: function(task, subjects) {
      const banner = document.getElementById('top-priority-task-banner');
      if (!banner) return;

      if (!task) {
        banner.innerHTML = `
          <div class="top-task-card completed-all">
            <div class="top-task-icon">🎉</div>
            <div class="top-task-info">
              <h3>All high priority tasks cleared!</h3>
              <p>Awesome work. Take a 15-minute breather or review next week's schedule.</p>
            </div>
          </div>
        `;
        return;
      }

      const subj = subjects.find(s => s.id === task.subjectId) || { name: "General", color: "#6366F1", code: "GEN" };

      banner.innerHTML = `
        <div class="top-task-card highlight-glow">
          <div class="top-task-badge-pill">
            <span class="ai-sparkle">✨</span> AI Recommended #1 Focus
          </div>
          <div class="top-task-main">
            <div class="top-task-header">
              <span class="subject-chip" style="background: ${subj.color}22; color: ${subj.color}; border: 1px solid ${subj.color}44;">
                ${subj.code || subj.name}
              </span>
              <span class="category-chip">${task.category}</span>
              <span class="priority-pill pill-high">Score: ${task.priorityScore}/100</span>
            </div>
            <h3 class="top-task-title">${task.title}</h3>
            <p class="top-task-rationale"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> <strong>AI Rationale:</strong> ${task.rationale}</p>
            <div class="top-task-footer">
              <div class="task-meta-items">
                <span>⏱️ ${task.estimatedMinutes} mins</span>
                <span>📅 Due in ${task.daysLeft <= 1 ? '1 day (Tomorrow)' : task.daysLeft + ' days'}</span>
                <span>⚡️ ${task.difficulty}</span>
              </div>
              <div class="top-task-actions">
                <button class="btn btn-sm btn-outline" onclick="window.SSA_AIHelper.openForTopic('${task.title}')">
                  💡 Explain with AI
                </button>
                <button class="btn btn-sm btn-primary" onclick="window.SSA_Dashboard.startFocusTimer('${task.title}', ${task.estimatedMinutes})">
                  🎯 Start Focus Session
                </button>
                <button class="btn btn-sm btn-success" onclick="window.SSA_Prioritizer.toggleComplete('${task.id}')">
                  ✓ Done
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    renderListView: function(container, tasks, subjects) {
      if (tasks.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No tasks in this filter</h3>
            <p>You have no tasks matching the selected criteria. Try selecting 'All' or add a new task.</p>
            <button class="btn btn-primary btn-sm" onclick="window.SSA_Prioritizer.openAddTaskModal()">+ Add New Task</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="task-cards-list">
          ${tasks.map(t => {
            const subj = subjects.find(s => s.id === t.subjectId) || { name: "General", color: "#6366F1", code: "GEN" };
            const priorityClass = t.priorityLevel === 'High' ? 'pill-high' : (t.priorityLevel === 'Medium' ? 'pill-medium' : 'pill-low');

            return `
              <div class="task-item-card ${t.completed ? 'completed' : ''} priority-${t.priorityLevel.toLowerCase()}" data-id="${t.id}">
                <div class="task-item-checkbox-wrap">
                  <input type="checkbox" id="chk-${t.id}" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="window.SSA_Prioritizer.toggleComplete('${t.id}')">
                  <label for="chk-${t.id}" class="custom-checkbox-label"></label>
                </div>

                <div class="task-item-content">
                  <div class="task-item-top">
                    <span class="subject-chip-sm" style="background: ${subj.color}20; color: ${subj.color}; border: 1px solid ${subj.color}35;">
                      ${subj.code || subj.name}
                    </span>
                    <span class="category-chip-sm">${t.category}</span>
                    <span class="priority-pill ${priorityClass}">AI ${t.priorityLevel} (${t.priorityScore})</span>
                    <span class="difficulty-tag diff-${t.difficulty.toLowerCase()}">${t.difficulty}</span>
                  </div>

                  <h4 class="task-item-title ${t.completed ? 'strikethrough' : ''}">${t.title}</h4>

                  <div class="task-item-meta">
                    <span class="meta-bit"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> ${t.estimatedMinutes} mins</span>
                    <span class="meta-bit ${t.daysLeft <= 1 ? 'text-urgent' : ''}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${t.daysLeft <= 1 ? 'Due tomorrow' : 'Due in ' + t.daysLeft + ' days'}</span>
                    ${t.scheduledTime ? `<span class="meta-bit meta-slot">📅 ${t.scheduledDate || 'Today'}: ${t.scheduledTime}</span>` : ''}
                  </div>

                  <div class="task-item-ai-insight">
                    <span class="ai-sparkle-sm">✨</span> ${t.rationale}
                  </div>
                </div>

                <div class="task-item-actions">
                  <button class="btn-icon-round" title="Ask AI Concept Helper" onclick="window.SSA_AIHelper.openForTopic('${t.title}')">
                    💡
                  </button>
                  <button class="btn-icon-round" title="Delete Task" onclick="window.SSA_Prioritizer.deleteTask('${t.id}')">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    renderMatrixView: function(container, allTasks, subjects) {
      const q1 = allTasks.filter(t => !t.completed && t.priorityScore >= 75); // Urgent & Important
      const q2 = allTasks.filter(t => !t.completed && t.priorityScore >= 55 && t.priorityScore < 75); // Important, Not Urgent
      const q3 = allTasks.filter(t => !t.completed && t.daysLeft <= 2 && t.priorityScore < 55); // Urgent, Less Critical
      const q4 = allTasks.filter(t => !t.completed && t.priorityScore < 55 && t.daysLeft > 2); // Review / Later

      const renderList = (items) => {
        if (items.length === 0) return `<div class="matrix-empty">No tasks</div>`;
        return items.map(t => {
          const subj = subjects.find(s => s.id === t.subjectId) || { color: "#6366F1", code: "GEN" };
          return `
            <div class="matrix-task-item">
              <div class="matrix-task-header">
                <span class="subject-dot" style="background:${subj.color}"></span>
                <span class="matrix-subj">${subj.code}</span>
                <span class="matrix-score">${t.priorityScore} pts</span>
              </div>
              <p class="matrix-title">${t.title}</p>
              <div class="matrix-footer">
                <span>⏱️ ${t.estimatedMinutes}m</span>
                <span>Due: ${t.daysLeft <= 1 ? '1d' : t.daysLeft + 'd'}</span>
                <button class="matrix-check" onclick="window.SSA_Prioritizer.toggleComplete('${t.id}')">✓</button>
              </div>
            </div>
          `;
        }).join('');
      };

      container.innerHTML = `
        <div class="eisenhower-matrix-grid">
          <div class="matrix-quadrant quadrant-urgent-important">
            <div class="quadrant-header">
              <div class="q-title"><span class="q-badge q-high">Q1</span> DO FIRST (Urgent & Important)</div>
              <span class="q-count">${q1.length} tasks</span>
            </div>
            <p class="q-desc">Immediate deadlines & high difficulty. Tackle during peak energy.</p>
            <div class="quadrant-body">${renderList(q1)}</div>
          </div>

          <div class="matrix-quadrant quadrant-schedule">
            <div class="quadrant-header">
              <div class="q-title"><span class="q-badge q-med">Q2</span> SCHEDULE (Important, Not Urgent)</div>
              <span class="q-count">${q2.length} tasks</span>
            </div>
            <p class="q-desc">Exam prep & major assignments with 3-7 day horizon. Plan slots.</p>
            <div class="quadrant-body">${renderList(q2)}</div>
          </div>

          <div class="matrix-quadrant quadrant-delegate">
            <div class="quadrant-header">
              <div class="q-title"><span class="q-badge q-opt">Q3</span> QUICK WINS (Urgent, Lower Weight)</div>
              <span class="q-count">${q3.length} tasks</span>
            </div>
            <p class="q-desc">Quick problem sheets, lab signoffs, administrative prep.</p>
            <div class="quadrant-body">${renderList(q3)}</div>
          </div>

          <div class="matrix-quadrant quadrant-eliminate">
            <div class="quadrant-header">
              <div class="q-title"><span class="q-badge q-low">Q4</span> BUFFER / REVIEW (Low Urgency)</div>
              <span class="q-count">${q4.length} tasks</span>
            </div>
            <p class="q-desc">Exploratory reading, future sprints. Do when caught up.</p>
            <div class="quadrant-body">${renderList(q4)}</div>
          </div>
        </div>
      `;
    },

    updateTaskCounters: function() {
      const tasks = this.getTasks();
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const high = tasks.filter(t => t.priorityLevel === 'High' && !t.completed).length;

      const totalEl = document.getElementById('count-total-tasks');
      const completedEl = document.getElementById('count-completed-tasks');
      const highEl = document.getElementById('count-high-tasks');

      if (totalEl) totalEl.textContent = total;
      if (completedEl) completedEl.textContent = completed;
      if (highEl) highEl.textContent = high;
    },

    toggleComplete: function(id) {
      const tasks = this.getTasks();
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        this.save();
        this.render();

        // Update dashboard & progress
        if (window.SSA_Dashboard && window.SSA_Dashboard.render) window.SSA_Dashboard.render();
        if (window.SSA_Progress && window.SSA_Progress.render) window.SSA_Progress.render();

        const msg = task.completed ? `🎉 Completed: "${task.title.substring(0, 30)}..."` : `Task marked as pending`;
        if (window.SSA_App) window.SSA_App.showToast(msg);
      }
    },

    deleteTask: function(id) {
      if (!confirm("Are you sure you want to delete this task?")) return;
      const tasks = this.getTasks();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks.splice(idx, 1);
        this.save();
        this.render();
        if (window.SSA_Dashboard && window.SSA_Dashboard.render) window.SSA_Dashboard.render();
        if (window.SSA_Progress && window.SSA_Progress.render) window.SSA_Progress.render();
        if (window.SSA_App) window.SSA_App.showToast("Task deleted");
      }
    },

    openAddTaskModal: function() {
      const modal = document.getElementById('modal-add-task');
      if (!modal) return;

      // Populate subjects select
      const select = document.getElementById('task-subject-select');
      if (select) {
        const subjects = this.getSubjects();
        select.innerHTML = subjects.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      }

      // Reset form fields
      const form = document.getElementById('form-add-task');
      if (form) form.reset();

      this.updateLiveAIScorePreview();
      modal.classList.add('active');
    },

    closeAddTaskModal: function() {
      const modal = document.getElementById('modal-add-task');
      if (modal) modal.classList.remove('active');
    },

    updateLiveAIScorePreview: function() {
      const diffEl = document.getElementById('task-difficulty-input');
      const catEl = document.getElementById('task-category-input');
      const daysEl = document.getElementById('task-days-input');
      const timeEl = document.getElementById('task-time-input');
      const previewEl = document.getElementById('task-ai-preview-box');

      if (!previewEl) return;

      const mockTask = {
        difficulty: diffEl ? diffEl.value : 'Medium',
        category: catEl ? catEl.value : 'Assignment',
        daysLeft: daysEl ? parseFloat(daysEl.value) || 2 : 2,
        estimatedMinutes: timeEl ? parseInt(timeEl.value) || 60 : 60
      };

      const ai = this.calculateAIScore(mockTask);
      previewEl.innerHTML = `
        <div class="ai-preview-content">
          <div class="ai-preview-score">
            <span class="score-num">${ai.score}</span>
            <span class="score-max">/100</span>
          </div>
          <div class="ai-preview-text">
            <span class="priority-pill ${ai.level === 'High' ? 'pill-high' : (ai.level === 'Medium' ? 'pill-medium' : 'pill-low')}">AI ${ai.level} Priority</span>
            <p class="preview-rationale">${ai.rationale}</p>
          </div>
        </div>
      `;
    },

    handleSaveTask: function(e) {
      if (e) e.preventDefault();

      const titleInput = document.getElementById('task-title-input');
      const subjectSelect = document.getElementById('task-subject-select');
      const categorySelect = document.getElementById('task-category-input');
      const difficultySelect = document.getElementById('task-difficulty-input');
      const daysInput = document.getElementById('task-days-input');
      const timeInput = document.getElementById('task-time-input');

      if (!titleInput || !titleInput.value.trim()) {
        alert("Please enter a task title.");
        return;
      }

      const days = parseFloat(daysInput.value) || 2;
      const estimated = parseInt(timeInput.value) || 60;

      const newTask = {
        id: 'task-' + Date.now(),
        title: titleInput.value.trim(),
        subjectId: subjectSelect.value,
        category: categorySelect.value,
        difficulty: difficultySelect.value,
        daysLeft: days,
        estimatedMinutes: estimated,
        completed: false,
        scheduledDate: days <= 1 ? "Today" : (days <= 2 ? "Tomorrow" : "This Week"),
        scheduledTime: "17:00 - 18:30"
      };

      const ai = this.calculateAIScore(newTask);
      newTask.priorityScore = ai.score;
      newTask.priorityLevel = ai.level;
      newTask.rationale = ai.rationale;

      const tasks = this.getTasks();
      tasks.unshift(newTask);

      this.save();
      this.closeAddTaskModal();
      this.render();

      if (window.SSA_Dashboard && window.SSA_Dashboard.render) window.SSA_Dashboard.render();
      if (window.SSA_Progress && window.SSA_Progress.render) window.SSA_Progress.render();

      // Check if urgent
      if (newTask.priorityLevel === 'High') {
        window.SSA_Notifications.addNotification({
          title: `New High Priority Task`,
          message: `"${newTask.title}" added (AI Score: ${newTask.priorityScore}). Scheduled for ${newTask.scheduledDate}.`,
          type: "urgent",
          targetTab: "tasks"
        });
      } else {
        if (window.SSA_App) window.SSA_App.showToast(`✨ Task added: AI scored ${newTask.priorityScore}/100 (${newTask.priorityLevel})`);
      }
    },

    bindEvents: function() {
      // Filter buttons
      const filterBtns = document.querySelectorAll('.task-filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.getAttribute('data-filter') || 'all';
          this.render();
        });
      });

      // View mode toggle
      const viewListBtn = document.getElementById('btn-view-list');
      const viewMatrixBtn = document.getElementById('btn-view-matrix');
      if (viewListBtn && viewMatrixBtn) {
        viewListBtn.addEventListener('click', () => {
          viewListBtn.classList.add('active');
          viewMatrixBtn.classList.remove('active');
          this.viewMode = 'list';
          this.render();
        });
        viewMatrixBtn.addEventListener('click', () => {
          viewMatrixBtn.classList.add('active');
          viewListBtn.classList.remove('active');
          this.viewMode = 'matrix';
          this.render();
        });
      }

      // Add task modal triggers
      const openAddBtn = document.getElementById('btn-open-add-task');
      if (openAddBtn) {
        openAddBtn.addEventListener('click', () => this.openAddTaskModal());
      }
      const closeAddBtn = document.getElementById('btn-close-add-task');
      if (closeAddBtn) {
        closeAddBtn.addEventListener('click', () => this.closeAddTaskModal());
      }
      const form = document.getElementById('form-add-task');
      if (form) {
        form.addEventListener('submit', (e) => this.handleSaveTask(e));
      }

      // Live AI Score preview listeners
      ['task-difficulty-input', 'task-category-input', 'task-days-input', 'task-time-input'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', () => this.updateLiveAIScorePreview());
          el.addEventListener('change', () => this.updateLiveAIScorePreview());
        }
      });
    }
  };

  window.SSA_Prioritizer = Prioritizer;
})();
