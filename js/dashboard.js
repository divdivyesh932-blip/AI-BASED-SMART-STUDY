// Student Dashboard Controller
(function() {
  const Dashboard = {
    timerInterval: null,
    timerSecondsLeft: 25 * 60,
    timerRunning: false,
    timerTaskTitle: "Deep Study Session",

    init: function() {
      this.bindEvents();
      this.render();
    },

    getState: function() {
      return window.SSA_State || window.SSA_DATA;
    },

    save: function() {
      if (window.SSA_App && window.SSA_App.saveState) {
        window.SSA_App.saveState();
      }
    },

    render: function() {
      const state = this.getState();
      const student = state.student || {};
      const tasks = state.tasks || [];
      const deadlines = state.deadlines || [];

      this.renderGreeting(student);
      this.renderMotivationalQuote();
      this.renderProgressRing(student, tasks);
      this.renderTodayTasks(tasks, state.subjects);
      this.renderUpcomingDeadlines(deadlines);
      this.renderPriorityWatchlist(tasks, state.subjects);
    },

    renderGreeting: function(student) {
      const nameEl = document.getElementById('dash-student-name');
      const collegeEl = document.getElementById('dash-student-college');
      const streakEl = document.getElementById('dash-quick-streak');

      if (nameEl) nameEl.textContent = student.name || "Alex";
      if (collegeEl) collegeEl.textContent = `${student.major} • ${student.semester}`;
      if (streakEl) streakEl.textContent = `${student.currentStreak} Days`;
    },

    renderMotivationalQuote: function() {
      const state = this.getState();
      const quotes = state.quotes || [];
      const quoteEl = document.getElementById('dash-quote-text');
      const authorEl = document.getElementById('dash-quote-author');

      if (quotes.length > 0 && quoteEl) {
        const idx = Math.floor(Math.random() * quotes.length);
        quoteEl.textContent = `“${quotes[idx].quote}”`;
        if (authorEl) authorEl.textContent = quotes[idx].author;
      }
    },

    cycleMotivationalQuote: function() {
      this.renderMotivationalQuote();
      if (window.SSA_App) window.SSA_App.showToast("💡 Refreshed Daily AI Motivation!");
    },

    renderProgressRing: function(student, tasks) {
      const todayHrs = student.studyHoursToday || 2.8;
      const targetHrs = student.dailyTargetHours || 4.5;
      const pct = Math.min(100, Math.round((todayHrs / targetHrs) * 100));

      const ringCircle = document.getElementById('dash-progress-ring-circle');
      const pctText = document.getElementById('dash-progress-pct');
      const hrsText = document.getElementById('dash-progress-hrs');

      if (pctText) pctText.textContent = `${pct}%`;
      if (hrsText) hrsText.textContent = `${todayHrs} / ${targetHrs} hrs`;

      if (ringCircle) {
        const radius = 46;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (pct / 100) * circumference;
        ringCircle.style.strokeDasharray = `${circumference}`;
        ringCircle.style.strokeDashoffset = `${offset}`;
      }

      // Completed tasks ratio
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      const taskRatioEl = document.getElementById('dash-tasks-ratio-text');
      if (taskRatioEl) taskRatioEl.textContent = `${completed}/${total} Tasks Done`;
    },

    renderTodayTasks: function(tasks, subjects) {
      const container = document.getElementById('dash-today-tasks-list');
      if (!container) return;

      const todayTasks = tasks.filter(t => t.scheduledDate === "Today" || t.daysLeft <= 1.5);

      if (todayTasks.length === 0) {
        container.innerHTML = `
          <div class="empty-state-card">
            <p>🎉 All clear! No pending tasks scheduled for today.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = todayTasks.map(t => {
        const subj = subjects.find(s => s.id === t.subjectId) || { code: "GEN", color: "#6366F1" };
        const priorityClass = t.priorityLevel === 'High' ? 'pill-high' : (t.priorityLevel === 'Medium' ? 'pill-medium' : 'pill-low');

        return `
          <div class="dash-task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
            <div class="dash-task-check">
              <input type="checkbox" id="dash-chk-${t.id}" ${t.completed ? 'checked' : ''} onchange="window.SSA_Prioritizer.toggleComplete('${t.id}')">
              <label for="dash-chk-${t.id}"></label>
            </div>
            <div class="dash-task-info">
              <div class="dash-task-tags">
                <span class="subject-chip-sm" style="background: ${subj.color}20; color: ${subj.color}; border: 1px solid ${subj.color}35;">${subj.code}</span>
                <span class="priority-pill ${priorityClass}">AI ${t.priorityLevel}</span>
                <span class="time-chip">⏱️ ${t.estimatedMinutes}m</span>
              </div>
              <h4 class="dash-task-title ${t.completed ? 'strikethrough' : ''}">${t.title}</h4>
              <div class="dash-task-sub">
                <span>🕒 ${t.scheduledTime || 'Scheduled Today'}</span>
              </div>
            </div>
            <div class="dash-task-actions">
              <button class="btn-icon-subtle" title="Focus Timer" onclick="window.SSA_Dashboard.startFocusTimer('${t.title}', ${t.estimatedMinutes})">
                🎯
              </button>
              <button class="btn-icon-subtle" title="AI Explainer" onclick="window.SSA_AIHelper.openForTopic('${t.title}')">
                💡
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    renderUpcomingDeadlines: function(deadlines) {
      const container = document.getElementById('dash-deadlines-container');
      if (!container) return;

      container.innerHTML = deadlines.map(d => `
        <div class="deadline-pill-card ${d.urgent ? 'is-urgent' : ''}">
          <div class="dl-left">
            <span class="dl-type-badge">${d.type}</span>
            <h4 class="dl-title">${d.title}</h4>
            <span class="dl-subject">${d.code} • ${d.subject}</span>
          </div>
          <div class="dl-right">
            <span class="dl-countdown ${d.urgent ? 'text-urgent' : ''}">
              ${d.daysRemaining <= 1 ? '🔥 In 24 Hours' : '⏳ In ' + d.daysRemaining + ' Days'}
            </span>
            <span class="dl-date-str">${d.dateStr}</span>
          </div>
        </div>
      `).join('');
    },

    renderPriorityWatchlist: function(tasks, subjects) {
      const container = document.getElementById('dash-priority-watchlist');
      if (!container) return;

      const highTasks = tasks.filter(t => !t.completed && t.priorityLevel === 'High');

      if (highTasks.length === 0) {
        container.innerHTML = `
          <div class="priority-good-news">
            <span>✨</span> No urgent blockers! Keep up the regular study pace.
          </div>
        `;
        return;
      }

      container.innerHTML = highTasks.map(t => {
        const subj = subjects.find(s => s.id === t.subjectId) || { code: "GEN", color: "#6366F1" };
        return `
          <div class="watchlist-card">
            <div class="wl-top">
              <span class="wl-badge" style="background: ${subj.color}25; color: ${subj.color}">${subj.code}</span>
              <span class="wl-score">AI Priority: ${t.priorityScore}/100</span>
            </div>
            <h4 class="wl-title">${t.title}</h4>
            <p class="wl-rationale">${t.rationale}</p>
            <div class="wl-actions">
              <button class="btn btn-xs btn-primary-glass" onclick="window.SSA_Dashboard.startFocusTimer('${t.title}', ${t.estimatedMinutes})">
                Start Focus Session
              </button>
              <button class="btn btn-xs btn-outline" onclick="window.SSA_AIHelper.openForTopic('${t.title}')">
                AI Help
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    // ==========================================
    // POMODORO FOCUS TIMER
    // ==========================================
    startFocusTimer: function(taskTitle, minutes) {
      const modal = document.getElementById('modal-focus-timer');
      if (!modal) return;

      this.timerTaskTitle = taskTitle || "Academic Deep Focus";
      const totalSeconds = (minutes && minutes <= 120 ? minutes : 25) * 60;
      this.timerSecondsLeft = totalSeconds;
      this.timerTotalSeconds = totalSeconds;

      document.getElementById('timer-task-name').textContent = this.timerTaskTitle;
      this.updateTimerDisplay();

      modal.classList.add('active');
      this.toggleTimerRun(true);
    },

    toggleTimerRun: function(forceStart) {
      const btn = document.getElementById('btn-timer-toggle');
      if (forceStart !== undefined) {
        this.timerRunning = forceStart;
      } else {
        this.timerRunning = !this.timerRunning;
      }

      if (btn) {
        btn.textContent = this.timerRunning ? "Pause" : "Resume";
        btn.className = `btn btn-lg ${this.timerRunning ? 'btn-warning' : 'btn-primary'}`;
      }

      if (this.timerRunning) {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
          if (this.timerSecondsLeft > 0) {
            this.timerSecondsLeft--;
            this.updateTimerDisplay();
          } else {
            this.completeFocusSession();
          }
        }, 1000);
      } else {
        clearInterval(this.timerInterval);
      }
    },

    updateTimerDisplay: function() {
      const m = Math.floor(this.timerSecondsLeft / 60);
      const s = this.timerSecondsLeft % 60;
      const display = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      const el = document.getElementById('timer-countdown-text');
      if (el) el.textContent = display;

      const circle = document.getElementById('timer-svg-circle');
      if (circle && this.timerTotalSeconds) {
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        const pct = this.timerSecondsLeft / this.timerTotalSeconds;
        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = `${circumference * (1 - pct)}`;
      }
    },

    resetTimer: function() {
      this.toggleTimerRun(false);
      this.timerSecondsLeft = (this.timerTotalSeconds || 25 * 60);
      this.updateTimerDisplay();
    },

    completeFocusSession: function() {
      this.toggleTimerRun(false);
      const state = this.getState();
      if (state.student) {
        state.student.studyHoursToday = parseFloat((state.student.studyHoursToday + 0.4).toFixed(1));
        state.student.totalHoursStudied = parseFloat((state.student.totalHoursStudied + 0.4).toFixed(1));
      }
      this.save();
      this.render();

      if (window.SSA_Progress && window.SSA_Progress.render) window.SSA_Progress.render();
      if (window.SSA_App) window.SSA_App.showToast("🎉 Fantastic! Focus session completed (+0.4 hrs logged)!");

      this.closeFocusTimerModal();
    },

    closeFocusTimerModal: function() {
      this.toggleTimerRun(false);
      const modal = document.getElementById('modal-focus-timer');
      if (modal) modal.classList.remove('active');
    },

    bindEvents: function() {
      const refreshQuoteBtn = document.getElementById('btn-refresh-quote');
      if (refreshQuoteBtn) {
        refreshQuoteBtn.addEventListener('click', () => this.cycleMotivationalQuote());
      }

      const closeTimerBtn = document.getElementById('btn-close-timer-modal');
      if (closeTimerBtn) {
        closeTimerBtn.addEventListener('click', () => this.closeFocusTimerModal());
      }

      const toggleTimerBtn = document.getElementById('btn-timer-toggle');
      if (toggleTimerBtn) {
        toggleTimerBtn.addEventListener('click', () => this.toggleTimerRun());
      }

      const resetTimerBtn = document.getElementById('btn-timer-reset');
      if (resetTimerBtn) {
        resetTimerBtn.addEventListener('click', () => this.resetTimer());
      }
    }
  };

  window.SSA_Dashboard = Dashboard;
})();
