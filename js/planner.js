// AI Personalized Study Planner & Adaptive Schedule Engine
(function() {
  const Planner = {
    currentDay: "Monday",
    viewType: "week", // "week" or "day"

    init: function() {
      this.bindEvents();
      this.render();
    },

    getSchedule: function() {
      return window.SSA_State ? window.SSA_State.weeklySchedule : window.SSA_DATA.weeklySchedule;
    },

    getSubjects: function() {
      return window.SSA_State ? window.SSA_State.subjects : window.SSA_DATA.subjects;
    },

    save: function() {
      if (window.SSA_App && window.SSA_App.saveState) {
        window.SSA_App.saveState();
      }
    },

    render: function() {
      const schedule = this.getSchedule();
      const subjects = this.getSubjects();

      // Render Day Selector Tabs
      this.renderDayTabs();

      // Render Weekly vs Daily Views
      if (this.viewType === 'week') {
        this.renderWeeklyView(schedule, subjects);
      } else {
        this.renderDailyView(schedule, subjects);
      }

      this.renderSubjectDistributionSummary(subjects);
    },

    renderDayTabs: function() {
      const container = document.getElementById('planner-day-tabs');
      if (!container) return;

      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      container.innerHTML = days.map(day => `
        <button class="planner-day-tab ${this.currentDay === day ? 'active' : ''}" onclick="window.SSA_Planner.selectDay('${day}')">
          <span class="day-abbr">${day.substring(0, 3)}</span>
          <span class="day-full">${day}</span>
        </button>
      `).join('');
    },

    selectDay: function(day) {
      this.currentDay = day;
      this.render();
    },

    renderWeeklyView: function(schedule, subjects) {
      const container = document.getElementById('planner-grid-container');
      if (!container) return;

      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      container.innerHTML = `
        <div class="weekly-planner-grid">
          ${days.map(day => {
            const slots = schedule[day] || [];
            const isToday = day === "Monday"; // Default demo day

            return `
              <div class="week-day-column ${isToday ? 'is-today-col' : ''}">
                <div class="col-header">
                  <div class="col-day-title">${day}</div>
                  ${isToday ? '<span class="badge-today">Today</span>' : ''}
                  <span class="col-hours">${slots.length * 1.5}h planned</span>
                </div>

                <div class="col-slots-list">
                  ${slots.map(slot => {
                    const subj = subjects.find(s => s.id === slot.subjectId) || { name: "Study Slot", color: "#6366F1", code: "GEN" };
                    return `
                      <div class="slot-card status-${slot.status}" style="border-left-color: ${subj.color};" data-slot-id="${slot.id}">
                        <div class="slot-card-top">
                          <span class="slot-time">${slot.time}</span>
                          <span class="slot-subj-tag" style="color: ${subj.color}; background: ${subj.color}15;">${subj.code}</span>
                        </div>
                        <div class="slot-topic">${slot.topic}</div>
                        <div class="slot-card-actions">
                          <button class="btn-slot-action ${slot.status === 'completed' ? 'active' : ''}" title="Mark Complete" onclick="window.SSA_Planner.toggleSlot('${day}', '${slot.id}')">
                            ${slot.status === 'completed' ? '✓ Done' : '○ Mark Done'}
                          </button>
                          <button class="btn-slot-icon" title="Reschedule with AI" onclick="window.SSA_Planner.openRescheduleModal('${day}', '${slot.id}')">
                            ⇄
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    renderDailyView: function(schedule, subjects) {
      const container = document.getElementById('planner-grid-container');
      if (!container) return;

      const slots = schedule[this.currentDay] || [];

      if (slots.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <p>No study slots scheduled for ${this.currentDay}.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="daily-timeline-view">
          <div class="daily-view-header">
            <h3>Agenda for ${this.currentDay}</h3>
            <span class="daily-stats-pill">${slots.length} Focus Blocks • Total ~${slots.length * 1.5} Hours</span>
          </div>

          <div class="timeline-blocks">
            ${slots.map((slot, idx) => {
              const subj = subjects.find(s => s.id === slot.subjectId) || { name: "Study Session", color: "#6366F1", code: "GEN" };
              return `
                <div class="timeline-slot-row status-${slot.status}">
                  <div class="timeline-time-col">
                    <span class="time-main">${slot.time.split('-')[0].trim()}</span>
                    <span class="time-sub">${slot.time.split('-')[1]?.trim() || ''}</span>
                  </div>
                  <div class="timeline-node">
                    <span class="node-dot" style="background: ${subj.color}; box-shadow: 0 0 10px ${subj.color}88;"></span>
                    ${idx < slots.length - 1 ? '<span class="node-line"></span>' : ''}
                  </div>
                  <div class="timeline-card-col" style="border-left: 3px solid ${subj.color}">
                    <div class="timeline-card-header">
                      <span class="subject-chip" style="background: ${subj.color}20; color: ${subj.color}">${subj.name} (${subj.code})</span>
                      <span class="slot-status-pill ${slot.status}">${slot.status === 'completed' ? 'Completed' : 'Upcoming'}</span>
                    </div>
                    <h4 class="timeline-slot-title">${slot.topic}</h4>
                    <div class="timeline-card-footer">
                      <button class="btn btn-sm btn-outline" onclick="window.SSA_AIHelper.openForTopic('${slot.topic}')">💡 AI Tutor</button>
                      <button class="btn btn-sm ${slot.status === 'completed' ? 'btn-success' : 'btn-primary'}" onclick="window.SSA_Planner.toggleSlot('${this.currentDay}', '${slot.id}')">
                        ${slot.status === 'completed' ? '✓ Completed' : 'Start Focus Session'}
                      </button>
                      <button class="btn btn-sm btn-ghost" onclick="window.SSA_Planner.openRescheduleModal('${this.currentDay}', '${slot.id}')">⇄ Reschedule</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    renderSubjectDistributionSummary: function(subjects) {
      const container = document.getElementById('planner-subject-hours-bar');
      if (!container) return;

      container.innerHTML = `
        <div class="subject-hours-grid">
          ${subjects.map(s => {
            const pct = Math.min(100, Math.round((s.completedHoursThisWeek / s.targetHoursPerWeek) * 100));
            return `
              <div class="subject-hour-card">
                <div class="s-card-top">
                  <span class="s-name" style="color: ${s.color}">${s.code}</span>
                  <span class="s-hrs">${s.completedHoursThisWeek}/${s.targetHoursPerWeek} hrs</span>
                </div>
                <div class="s-bar-bg">
                  <div class="s-bar-fill" style="width: ${pct}%; background: ${s.color};"></div>
                </div>
                <div class="s-card-meta">
                  <span>${s.difficulty}</span>
                  <span>${pct}% Target</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    toggleSlot: function(day, slotId) {
      const schedule = this.getSchedule();
      const slots = schedule[day] || [];
      const slot = slots.find(s => s.id === slotId);

      if (slot) {
        slot.status = slot.status === 'completed' ? 'pending' : 'completed';
        this.save();
        this.render();

        if (window.SSA_Dashboard && window.SSA_Dashboard.render) window.SSA_Dashboard.render();
        if (window.SSA_Progress && window.SSA_Progress.render) window.SSA_Progress.render();

        const toast = slot.status === 'completed' ? `🎉 Completed session: ${slot.topic}` : `Session marked as pending`;
        if (window.SSA_App) window.SSA_App.showToast(toast);
      }
    },

    openRescheduleModal: function(day, slotId) {
      const schedule = this.getSchedule();
      const slot = schedule[day]?.find(s => s.id === slotId);
      if (!slot) return;

      const modal = document.getElementById('modal-reschedule-slot');
      if (!modal) return;

      document.getElementById('reschedule-slot-title').textContent = slot.topic;
      document.getElementById('reschedule-slot-current').textContent = `Currently: ${day} (${slot.time})`;
      document.getElementById('reschedule-slot-id').value = slotId;
      document.getElementById('reschedule-day-from').value = day;

      modal.classList.add('active');
    },

    closeRescheduleModal: function() {
      const modal = document.getElementById('modal-reschedule-slot');
      if (modal) modal.classList.remove('active');
    },

    applyManualReschedule: function() {
      const slotId = document.getElementById('reschedule-slot-id').value;
      const fromDay = document.getElementById('reschedule-day-from').value;
      const targetDay = document.getElementById('reschedule-target-day').value;
      const targetTime = document.getElementById('reschedule-target-time').value;

      const schedule = this.getSchedule();
      const fromSlots = schedule[fromDay] || [];
      const idx = fromSlots.findIndex(s => s.id === slotId);

      if (idx !== -1) {
        const [movedSlot] = fromSlots.splice(idx, 1);
        movedSlot.time = targetTime;
        if (!schedule[targetDay]) schedule[targetDay] = [];
        schedule[targetDay].push(movedSlot);

        this.save();
        this.closeRescheduleModal();
        this.render();

        if (window.SSA_App) window.SSA_App.showToast(`⇄ Rescheduled to ${targetDay} (${targetTime})`);
      }
    },

    // ==========================================
    // FEATURE 7: ADAPTIVE STUDY PLAN REBALANCING
    // ==========================================
    simulateMissedTask: function() {
      const modal = document.getElementById('modal-adaptive-rebalance');
      if (!modal) return;

      // Realistic college missed task simulation: OS Midterm prep slot was missed
      document.getElementById('adaptive-missed-task-name').textContent = "Operating Systems: Page Replacement Algorithms (1.5 hrs)";
      document.getElementById('adaptive-missed-subject').textContent = "CS502 • Mid-Term in 3 Days";

      modal.classList.add('active');
    },

    closeAdaptiveModal: function() {
      const modal = document.getElementById('modal-adaptive-rebalance');
      if (modal) modal.classList.remove('active');
    },

    applyAdaptiveRebalance: function(optionIndex) {
      const schedule = this.getSchedule();

      if (optionIndex === 1) {
        // Shift to tonight 21:00 or insert extra slot
        if (!schedule["Monday"]) schedule["Monday"] = [];
        schedule["Monday"].push({
          id: "adapt-" + Date.now(),
          time: "21:30 - 23:00",
          subjectId: "cs502",
          topic: "⚡️ Rebalanced: OS Page Replacement (FIFO, LRU, Optimal)",
          status: "pending"
        });
      } else if (optionIndex === 2) {
        // Split over Tue & Wed
        if (!schedule["Tuesday"]) schedule["Tuesday"] = [];
        if (!schedule["Wednesday"]) schedule["Wednesday"] = [];
        schedule["Tuesday"].push({
          id: "adapt-1-" + Date.now(),
          time: "21:30 - 22:15",
          subjectId: "cs502",
          topic: "⚡️ Rebalanced Pt 1: FIFO & LRU Algorithms",
          status: "pending"
        });
        schedule["Wednesday"].push({
          id: "adapt-2-" + Date.now(),
          time: "21:30 - 22:15",
          subjectId: "cs502",
          topic: "⚡️ Rebalanced Pt 2: Optimal Page Replacement & Trashing",
          status: "pending"
        });
      } else {
        // Add to Saturday morning
        if (!schedule["Saturday"]) schedule["Saturday"] = [];
        schedule["Saturday"].unshift({
          id: "adapt-sat-" + Date.now(),
          time: "08:30 - 10:00",
          subjectId: "cs502",
          topic: "⚡️ Rebalanced Weekend Slot: OS Page Replacement Deep Dive",
          status: "pending"
        });
      }

      this.save();
      this.closeAdaptiveModal();
      this.render();

      if (window.SSA_Notifications) {
        window.SSA_Notifications.addNotification({
          title: "Adaptive AI Rebalance Applied",
          message: "Your schedule has been re-optimized. The missed OS session has been seamlessly redistributed.",
          type: "ai",
          targetTab: "planner"
        });
      }

      if (window.SSA_App) window.SSA_App.showToast("✨ AI Schedule Successfully Rebalanced!");
    },

    // ==========================================
    // FEATURE 2: AI STUDY PLANNER WIZARD GENERATOR
    // ==========================================
    openGenerateWizard: function() {
      const modal = document.getElementById('modal-planner-wizard');
      if (modal) modal.classList.add('active');
    },

    closeGenerateWizard: function() {
      const modal = document.getElementById('modal-planner-wizard');
      if (modal) modal.classList.remove('active');
    },

    executeAIPlanGeneration: function(e) {
      if (e) e.preventDefault();

      const weekdayHours = parseFloat(document.getElementById('wizard-weekday-hours')?.value) || 4;
      const weekendHours = parseFloat(document.getElementById('wizard-weekend-hours')?.value) || 6;
      const targetFocus = document.getElementById('wizard-focus-subject')?.value || 'all';

      // Simulation of AI schedule optimization
      const btn = document.getElementById('btn-wizard-submit');
      if (btn) {
        btn.innerHTML = `<span class="ai-sparkle">✨</span> Computing Optimal Schedule with AI...`;
        btn.disabled = true;
      }

      setTimeout(() => {
        const subjects = this.getSubjects();
        const schedule = this.getSchedule();

        // Dynamically boost focus subject hours
        subjects.forEach(s => {
          if (targetFocus === 'all' || s.id === targetFocus) {
            s.targetHoursPerWeek = Math.round((s.difficulty === 'Hard' ? 8 : 5) * (weekdayHours / 4));
          }
        });

        // Add an AI badge slot to current day
        if (!schedule["Monday"]) schedule["Monday"] = [];
        schedule["Monday"].push({
          id: "new-plan-" + Date.now(),
          time: "19:30 - 20:45",
          subjectId: targetFocus === 'all' ? "cs501" : targetFocus,
          topic: "AI Optimized High-Yield Topic Revision",
          status: "pending"
        });

        this.save();
        if (btn) {
          btn.innerHTML = `Generate Personalized Plan`;
          btn.disabled = false;
        }

        this.closeGenerateWizard();
        this.render();

        if (window.SSA_Notifications) {
          window.SSA_Notifications.addNotification({
            title: "New AI Study Plan Active",
            message: `Optimized for ${weekdayHours}h weekdays / ${weekendHours}h weekends. High-difficulty subjects allocated priority slots.`,
            type: "ai",
            targetTab: "planner"
          });
        }

        if (window.SSA_App) window.SSA_App.showToast("🚀 New AI Personalized Schedule Activated!");
      }, 900);
    },

    bindEvents: function() {
      // Toggle view week vs day
      const weekBtn = document.getElementById('btn-view-week');
      const dayBtn = document.getElementById('btn-view-day');

      if (weekBtn && dayBtn) {
        weekBtn.addEventListener('click', () => {
          weekBtn.classList.add('active');
          dayBtn.classList.remove('active');
          this.viewType = 'week';
          this.render();
        });
        dayBtn.addEventListener('click', () => {
          dayBtn.classList.add('active');
          weekBtn.classList.remove('active');
          this.viewType = 'day';
          this.render();
        });
      }

      // Simulate Missed Task button
      const missedBtn = document.getElementById('btn-simulate-missed-task');
      if (missedBtn) {
        missedBtn.addEventListener('click', () => this.simulateMissedTask());
      }

      // Planner Wizard button
      const openWizardBtn = document.getElementById('btn-open-planner-wizard');
      if (openWizardBtn) {
        openWizardBtn.addEventListener('click', () => this.openGenerateWizard());
      }
      const closeWizardBtn = document.getElementById('btn-close-planner-wizard');
      if (closeWizardBtn) {
        closeWizardBtn.addEventListener('click', () => this.closeGenerateWizard());
      }
      const wizardForm = document.getElementById('form-planner-wizard');
      if (wizardForm) {
        wizardForm.addEventListener('submit', (e) => this.executeAIPlanGeneration(e));
      }

      // Reschedule modal events
      const closeRescheduleBtn = document.getElementById('btn-close-reschedule');
      if (closeRescheduleBtn) {
        closeRescheduleBtn.addEventListener('click', () => this.closeRescheduleModal());
      }
      const saveRescheduleBtn = document.getElementById('btn-save-reschedule');
      if (saveRescheduleBtn) {
        saveRescheduleBtn.addEventListener('click', () => this.applyManualReschedule());
      }

      // Adaptive modal close
      const closeAdaptiveBtn = document.getElementById('btn-close-adaptive');
      if (closeAdaptiveBtn) {
        closeAdaptiveBtn.addEventListener('click', () => this.closeAdaptiveModal());
      }
    }
  };

  window.SSA_Planner = Planner;
})();
