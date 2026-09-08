// Smart Study Assistant - Main Application Coordinator
(function() {
  const App = {
    currentTab: 'home',
    currentTheme: 'dark', // 'dark' or 'light'
    isMobilePreview: false,

    init: function() {
      this.loadState();
      this.bindGlobalEvents();
      this.setupTheme();

      // Initialize Sub-Modules
      if (window.SSA_Notifications) window.SSA_Notifications.init();
      if (window.SSA_Dashboard) window.SSA_Dashboard.init();
      if (window.SSA_Planner) window.SSA_Planner.init();
      if (window.SSA_Prioritizer) window.SSA_Prioritizer.init();
      if (window.SSA_AIHelper) window.SSA_AIHelper.init();
      if (window.SSA_Progress) window.SSA_Progress.init();

      this.renderProfile();

      // Check URL hash or query param for initial tab
      const hashTab = window.location.hash.replace('#', '');
      const searchParams = new URLSearchParams(window.location.search);
      const queryTab = searchParams.get('tab');
      const initialTab = queryTab || hashTab || 'home';

      if (['home', 'planner', 'tasks', 'aiHelper', 'progress', 'profile'].includes(initialTab)) {
        this.switchTab(initialTab);
      } else {
        this.switchTab('home');
      }

      console.log("🎓 Smart Study Assistant Initialized Successfully.");
    },

    loadState: function() {
      const saved = localStorage.getItem('SSA_APP_STATE_V1');
      if (saved) {
        try {
          window.SSA_State = JSON.parse(saved);
        } catch(e) {
          window.SSA_State = JSON.parse(JSON.stringify(window.SSA_DATA));
        }
      } else {
        window.SSA_State = JSON.parse(JSON.stringify(window.SSA_DATA));
      }
    },

    saveState: function() {
      if (window.SSA_State) {
        try {
          localStorage.setItem('SSA_APP_STATE_V1', JSON.stringify(window.SSA_State));
        } catch(e) {
          console.warn("Storage quota exceeded or error", e);
        }
      }
    },

    resetToDefault: function() {
      if (confirm("Reset prototype to clean initial college demo dataset?")) {
        localStorage.removeItem('SSA_APP_STATE_V1');
        window.SSA_State = JSON.parse(JSON.stringify(window.SSA_DATA));
        location.reload();
      }
    },

    loadScenario: function(type) {
      if (!window.SSA_State) return;

      if (type === 'midterm') {
        window.SSA_State.student.dailyTargetHours = 6.0;
        window.SSA_State.student.studyHoursToday = 4.2;
        window.SSA_State.notifications.unshift({
          id: 'notif-crunch-' + Date.now(),
          title: '🚨 Midterm Crunch Mode Active',
          message: 'Operating Systems exam in 48 hours. Daily focus target increased to 6.0 hours.',
          timeAgo: 'Just now',
          type: 'urgent',
          unread: true,
          targetTab: 'planner'
        });
        this.showToast("📚 Switched to: Mid-Term Exam Crunch Scenario");
      } else if (type === 'placement') {
        window.SSA_State.student.dailyTargetHours = 5.0;
        window.SSA_State.student.studyHoursToday = 2.0;
        window.SSA_State.notifications.unshift({
          id: 'notif-place-' + Date.now(),
          title: '💼 Placement Season Mode',
          message: 'DSA Coding Contests & Aptitude prioritized for this week.',
          timeAgo: 'Just now',
          type: 'ai',
          unread: true,
          targetTab: 'tasks'
        });
        this.showToast("💼 Switched to: Placement Prep Rush Scenario");
      }

      this.saveState();
      this.refreshAllViews();
    },

    refreshAllViews: function() {
      if (window.SSA_Notifications) window.SSA_Notifications.init();
      if (window.SSA_Dashboard) window.SSA_Dashboard.render();
      if (window.SSA_Planner) window.SSA_Planner.render();
      if (window.SSA_Prioritizer) window.SSA_Prioritizer.render();
      if (window.SSA_Progress) window.SSA_Progress.render();
      this.renderProfile();
    },

    switchTab: function(tabName) {
      this.currentTab = tabName;

      // Update Nav buttons
      const allNavBtns = document.querySelectorAll('[data-tab-target]');
      allNavBtns.forEach(btn => {
        if (btn.getAttribute('data-tab-target') === tabName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Views
      const allViews = document.querySelectorAll('.app-view');
      allViews.forEach(view => {
        if (view.id === `view-${tabName}`) {
          view.classList.add('active');
          window.scrollTo(0, 0);
        } else {
          view.classList.remove('active');
        }
      });

      // Trigger re-render of specific view if needed
      if (tabName === 'home' && window.SSA_Dashboard) window.SSA_Dashboard.render();
      if (tabName === 'planner' && window.SSA_Planner) window.SSA_Planner.render();
      if (tabName === 'tasks' && window.SSA_Prioritizer) window.SSA_Prioritizer.render();
      if (tabName === 'progress' && window.SSA_Progress) window.SSA_Progress.render();
      if (tabName === 'profile') this.renderProfile();
    },

    setupTheme: function() {
      const savedTheme = localStorage.getItem('SSA_THEME') || 'dark';
      this.setTheme(savedTheme);
    },

    setTheme: function(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('SSA_THEME', theme);

      const themeBtn = document.getElementById('btn-toggle-theme');
      if (themeBtn) {
        themeBtn.innerHTML = theme === 'dark' 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    },

    toggleTheme: function() {
      this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
      this.showToast(`Switched to ${this.currentTheme === 'dark' ? 'Dark AI Theme' : 'Light Theme'}`);
    },

    toggleMobilePreview: function() {
      this.isMobilePreview = !this.isMobilePreview;
      const appContainer = document.getElementById('app-root-frame');
      const btn = document.getElementById('btn-toggle-device-mode');

      if (this.isMobilePreview) {
        appContainer.classList.add('mobile-device-frame');
        if (btn) btn.classList.add('active');
        this.showToast("📱 Mobile Viewport Mode Activated");
      } else {
        appContainer.classList.remove('mobile-device-frame');
        if (btn) btn.classList.remove('active');
        this.showToast("💻 Desktop Dashboard Mode Activated");
      }
    },

    showToast: function(message) {
      const toast = document.getElementById('app-toast');
      if (!toast) return;

      toast.textContent = message;
      toast.classList.add('show');

      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    },

    openDesignThinkingModal: function() {
      const modal = document.getElementById('modal-design-thinking');
      if (modal) modal.classList.add('active');
    },

    closeDesignThinkingModal: function() {
      const modal = document.getElementById('modal-design-thinking');
      if (modal) modal.classList.remove('active');
    },

    renderProfile: function() {
      const student = window.SSA_State ? window.SSA_State.student : window.SSA_DATA.student;
      const subjects = window.SSA_State ? window.SSA_State.subjects : window.SSA_DATA.subjects;

      const pName = document.getElementById('prof-name');
      const pCollege = document.getElementById('prof-college');
      const pMajor = document.getElementById('prof-major');
      const pGPA = document.getElementById('prof-gpa');
      const pStreak = document.getElementById('prof-streak');
      const pHours = document.getElementById('prof-total-hours');

      if (pName) pName.textContent = student.name;
      if (pCollege) pCollege.textContent = student.college;
      if (pMajor) pMajor.textContent = student.major;
      if (pGPA) pGPA.textContent = student.targetGPA;
      if (pStreak) pStreak.textContent = `${student.currentStreak} Days 🔥`;
      if (pHours) pHours.textContent = `${student.totalHoursStudied} Hours`;

      const subList = document.getElementById('prof-enrolled-subjects');
      if (subList) {
        subList.innerHTML = subjects.map(s => `
          <div class="prof-subject-pill-row">
            <span class="sub-dot" style="background:${s.color}"></span>
            <span class="sub-name"><strong>${s.code}</strong>: ${s.name}</span>
            <span class="sub-cred">${s.creditHours} Credits</span>
            <span class="sub-diff diff-${s.difficulty.toLowerCase()}">${s.difficulty}</span>
          </div>
        `).join('');
      }
    },

    bindGlobalEvents: function() {
      // Tab Navigation clicks
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-tab-target]');
        if (btn) {
          const tab = btn.getAttribute('data-tab-target');
          this.switchTab(tab);
        }
      });

      // Theme toggle
      const themeBtn = document.getElementById('btn-toggle-theme');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => this.toggleTheme());
      }

      // Device frame toggle
      const deviceBtn = document.getElementById('btn-toggle-device-mode');
      if (deviceBtn) {
        deviceBtn.addEventListener('click', () => this.toggleMobilePreview());
      }

      // Design Thinking modal triggers
      const dtBtn = document.getElementById('btn-open-design-thinking');
      if (dtBtn) {
        dtBtn.addEventListener('click', () => this.openDesignThinkingModal());
      }
      const closeDtBtn = document.getElementById('btn-close-dt-modal');
      if (closeDtBtn) {
        closeDtBtn.addEventListener('click', () => this.closeDesignThinkingModal());
      }

      // Scenario switchers
      const scenMidterm = document.getElementById('btn-scen-midterm');
      if (scenMidterm) scenMidterm.addEventListener('click', () => this.loadScenario('midterm'));

      const scenPlacement = document.getElementById('btn-scen-placement');
      if (scenPlacement) scenPlacement.addEventListener('click', () => this.loadScenario('placement'));

      const resetBtn = document.getElementById('btn-reset-prototype');
      if (resetBtn) resetBtn.addEventListener('click', () => this.resetToDefault());
    }
  };

  window.SSA_App = App;

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
