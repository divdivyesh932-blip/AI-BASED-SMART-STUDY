// Smart Reminders & Notifications System for Smart Study Assistant
(function() {
  const Notifications = {
    init: function() {
      this.renderDrawer();
      this.updateBadge();
      this.renderDashboardAlert();
      this.bindEvents();
    },

    getNotifications: function() {
      return window.SSA_State ? window.SSA_State.notifications : window.SSA_DATA.notifications;
    },

    save: function() {
      if (window.SSA_App && window.SSA_App.saveState) {
        window.SSA_App.saveState();
      }
    },

    updateBadge: function() {
      const items = this.getNotifications();
      const unreadCount = items.filter(n => n.unread).length;
      const badge = document.getElementById('notif-badge-count');
      const dot = document.getElementById('notif-bell-dot');

      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
      }
      if (dot) {
        dot.style.display = unreadCount > 0 ? 'block' : 'none';
      }
    },

    renderDrawer: function() {
      const container = document.getElementById('notif-items-list');
      if (!container) return;

      const items = this.getNotifications();
      if (items.length === 0) {
        container.innerHTML = `
          <div class="empty-state-mini">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <p>No notifications right now. You're all caught up!</p>
          </div>
        `;
        return;
      }

      container.innerHTML = items.map(n => `
        <div class="notif-card ${n.unread ? 'unread' : ''} type-${n.type}" data-id="${n.id}">
          <div class="notif-icon">
            ${this.getIcon(n.type)}
          </div>
          <div class="notif-body">
            <div class="notif-header-row">
              <span class="notif-title">${n.title}</span>
              <span class="notif-time">${n.timeAgo}</span>
            </div>
            <p class="notif-desc">${n.message}</p>
            <div class="notif-actions">
              ${n.actionText ? `<button class="btn-text-action" onclick="window.SSA_Notifications.triggerAction('${n.id}', '${n.targetTab || ''}')">${n.actionText} →</button>` : ''}
              ${n.unread ? `<button class="btn-icon-subtle" title="Mark Read" onclick="window.SSA_Notifications.markRead('${n.id}')">Mark read</button>` : ''}
              <button class="btn-icon-subtle" title="Dismiss" onclick="window.SSA_Notifications.dismiss('${n.id}')">✕</button>
            </div>
          </div>
        </div>
      `).join('');
    },

    renderDashboardAlert: function() {
      const banner = document.getElementById('dashboard-urgent-banner');
      if (!banner) return;

      const items = this.getNotifications();
      const urgent = items.find(n => n.type === 'urgent' && n.unread) || items.find(n => n.unread);

      if (!urgent) {
        banner.style.display = 'none';
        return;
      }

      banner.style.display = 'flex';
      banner.className = `alert-banner banner-${urgent.type}`;
      banner.innerHTML = `
        <div class="banner-icon-wrap">
          ${this.getIcon(urgent.type)}
        </div>
        <div class="banner-content">
          <strong>${urgent.title}</strong> — ${urgent.message}
        </div>
        <div class="banner-cta">
          <button class="btn btn-sm btn-primary-glass" onclick="window.SSA_Notifications.triggerAction('${urgent.id}', '${urgent.targetTab || 'tasks'}')">
            ${urgent.actionText || 'Take Action'}
          </button>
          <button class="btn-close-banner" onclick="window.SSA_Notifications.dismissBanner()" title="Dismiss">✕</button>
        </div>
      `;
    },

    dismissBanner: function() {
      const banner = document.getElementById('dashboard-urgent-banner');
      if (banner) banner.style.display = 'none';
    },

    getIcon: function(type) {
      switch(type) {
        case 'urgent':
          return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        case 'ai':
          return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`;
        case 'warning':
          return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        case 'success':
          return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        default:
          return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`;
      }
    },

    markRead: function(id) {
      const items = this.getNotifications();
      const item = items.find(n => n.id === id);
      if (item) {
        item.unread = false;
        this.save();
        this.renderDrawer();
        this.updateBadge();
        this.renderDashboardAlert();
      }
    },

    markAllRead: function() {
      const items = this.getNotifications();
      items.forEach(n => n.unread = false);
      this.save();
      this.renderDrawer();
      this.updateBadge();
      this.renderDashboardAlert();
      if (window.SSA_App) window.SSA_App.showToast("All notifications marked as read");
    },

    dismiss: function(id) {
      const items = this.getNotifications();
      const index = items.findIndex(n => n.id === id);
      if (index !== -1) {
        items.splice(index, 1);
        this.save();
        this.renderDrawer();
        this.updateBadge();
        this.renderDashboardAlert();
      }
    },

    triggerAction: function(id, tab) {
      this.markRead(id);
      this.toggleDrawer(false);
      if (tab && window.SSA_App && window.SSA_App.switchTab) {
        window.SSA_App.switchTab(tab);
      }
    },

    toggleDrawer: function(open) {
      const drawer = document.getElementById('notifications-drawer');
      const overlay = document.getElementById('drawer-overlay');
      if (!drawer) return;

      const isCurrentlyOpen = drawer.classList.contains('active');
      const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

      if (shouldOpen) {
        drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
      } else {
        drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      }
    },

    addNotification: function(notif) {
      const items = this.getNotifications();
      const newNotif = {
        id: 'notif-' + Date.now(),
        title: notif.title || "Smart Reminder",
        message: notif.message,
        timeAgo: "Just now",
        type: notif.type || "ai",
        unread: true,
        actionText: notif.actionText || null,
        targetTab: notif.targetTab || null
      };
      items.unshift(newNotif);
      this.save();
      this.renderDrawer();
      this.updateBadge();
      this.renderDashboardAlert();
      if (window.SSA_App) {
        window.SSA_App.showToast(`🔔 Reminder: ${newNotif.title}`);
      }
    },

    bindEvents: function() {
      const bellBtn = document.getElementById('btn-notif-bell');
      if (bellBtn) {
        bellBtn.addEventListener('click', () => this.toggleDrawer());
      }
      const closeBtn = document.getElementById('btn-close-drawer');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.toggleDrawer(false));
      }
      const overlay = document.getElementById('drawer-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.toggleDrawer(false));
      }
      const markAllBtn = document.getElementById('btn-mark-all-read');
      if (markAllBtn) {
        markAllBtn.addEventListener('click', () => this.markAllRead());
      }
    }
  };

  window.SSA_Notifications = Notifications;
})();
