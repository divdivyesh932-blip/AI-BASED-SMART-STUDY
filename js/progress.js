// Progress Tracker with Interactive SVG Charts & Gamified Streak
(function() {
  const Progress = {
    init: function() {
      this.render();
    },

    getState: function() {
      return window.SSA_State || window.SSA_DATA;
    },

    render: function() {
      const state = this.getState();
      const tasks = state.tasks || [];
      const student = state.student || {};
      const weekly = state.weeklyAnalytics || {};

      // Compute statistics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.completed).length;
      const pendingTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Render Key Metric Cards
      this.renderMetricCards(student, completedTasks, pendingTasks, completionRate);

      // Render Streak Section
      this.renderStreakSection(student);

      // Render Weekly Hours SVG Bar Chart
      this.renderWeeklyHoursChart(weekly);

      // Render Subject Breakdown Donut Chart
      this.renderSubjectDonutChart(weekly.subjectHours, state.subjects);

      // Render Achievements Badges
      this.renderBadges(state.achievements);
    },

    renderMetricCards: function(student, completed, pending, rate) {
      const totalHrs = student.totalHoursStudied || 142.5;
      const todayHrs = student.studyHoursToday || 2.8;
      const targetHrs = student.dailyTargetHours || 4.5;
      const todayPct = Math.min(100, Math.round((todayHrs / targetHrs) * 100));

      const c1 = document.getElementById('metric-completion-rate');
      const c2 = document.getElementById('metric-hours-today');
      const c3 = document.getElementById('metric-tasks-ratio');
      const c4 = document.getElementById('metric-total-hours');

      if (c1) c1.textContent = `${rate}%`;
      if (c2) c2.textContent = `${todayHrs} / ${targetHrs}h (${todayPct}%)`;
      if (c3) c3.textContent = `${completed} done / ${pending} left`;
      if (c4) c4.textContent = `${totalHrs} hrs`;
    },

    renderStreakSection: function(student) {
      const countEl = document.getElementById('streak-count-display');
      const dotsEl = document.getElementById('streak-dots-row');

      if (countEl) countEl.textContent = `${student.currentStreak} Days`;

      if (dotsEl) {
        const days = ["M", "T", "W", "T", "F", "S", "S"];
        const history = student.streakHistory || [true, true, true, true, true, true, true];

        dotsEl.innerHTML = days.map((d, i) => `
          <div class="streak-dot-col">
            <div class="streak-dot-bubble ${history[i] ? 'active' : ''}">
              ${history[i] ? '🔥' : '•'}
            </div>
            <span class="streak-dot-label">${d}</span>
          </div>
        `).join('');
      }
    },

    // Interactive SVG Bar Chart (Weekly Hours: Target vs Actual)
    renderWeeklyHoursChart: function(weekly) {
      const container = document.getElementById('chart-weekly-hours');
      if (!container) return;

      const days = weekly.days || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const actuals = weekly.actualHours || [4.8, 5.0, 4.2, 4.6, 3.8, 5.5, 4.0];
      const targets = weekly.targetHours || [4.5, 4.5, 4.5, 4.5, 4.5, 6.0, 6.0];

      const maxVal = Math.max(...actuals, ...targets, 7.0);
      const chartHeight = 180;
      const chartWidth = 520;
      const colWidth = chartWidth / days.length;
      const barW = 20;

      let svgBars = '';
      days.forEach((day, i) => {
        const actual = actuals[i];
        const target = targets[i];

        const actualHeight = (actual / maxVal) * (chartHeight - 40);
        const targetHeight = (target / maxVal) * (chartHeight - 40);

        const xCenter = i * colWidth + colWidth / 2;
        const xActual = xCenter - barW / 2;

        const yActual = chartHeight - 25 - actualHeight;
        const yTarget = chartHeight - 25 - targetHeight;

        svgBars += `
          <!-- Column Group -->
          <g class="chart-col-group" data-day="${day}" data-actual="${actual}h" data-target="${target}h">
            <!-- Target dashed marker line -->
            <line x1="${xCenter - 18}" y1="${yTarget}" x2="${xCenter + 18}" y2="${yTarget}" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="3,3" opacity="0.8"/>

            <!-- Actual Bar -->
            <rect x="${xActual}" y="${yActual}" width="${barW}" height="${actualHeight}" rx="5" 
              fill="url(#barGradient)" class="svg-bar-rect" />

            <!-- Value on top -->
            <text x="${xCenter}" y="${yActual - 6}" text-anchor="middle" font-size="11" fill="var(--text-secondary)" font-weight="600">
              ${actual}h
            </text>

            <!-- Day label -->
            <text x="${xCenter}" y="${chartHeight - 8}" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-weight="500">
              ${day}
            </text>
          </g>
        `;
      });

      container.innerHTML = `
        <svg viewBox="0 0 ${chartWidth} ${chartHeight}" width="100%" height="100%" class="svg-chart">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366F1" />
              <stop offset="100%" stop-color="#A855F7" />
            </linearGradient>
          </defs>
          <!-- Grid line -->
          <line x1="20" y1="${chartHeight - 25}" x2="${chartWidth - 20}" y2="${chartHeight - 25}" stroke="var(--border-subtle)" stroke-width="1"/>
          ${svgBars}
        </svg>
      `;
    },

    // Interactive SVG Donut Chart (Subject Distribution)
    renderSubjectDonutChart: function(subjectHours, subjectsList) {
      const container = document.getElementById('chart-subject-donut');
      const legendContainer = document.getElementById('chart-subject-legend');
      if (!container || !subjectHours) return;

      const entries = Object.entries(subjectHours);
      const total = entries.reduce((sum, [, val]) => sum + val, 0);

      const size = 180;
      const center = size / 2;
      const radius = 65;
      const strokeWidth = 24;
      const circumference = 2 * Math.PI * radius;

      const colors = {
        "Data Structures": "#6366F1",
        "Operating Systems": "#8B5CF6",
        "DBMS": "#06B6D4",
        "ML Lab": "#EC4899",
        "Networks": "#10B981",
        "Placement Prep": "#F59E0B"
      };

      let accumulatedAngle = 0;
      let svgArcs = '';

      entries.forEach(([name, hours]) => {
        const pct = hours / total;
        const strokeDasharray = `${pct * circumference} ${circumference}`;
        const strokeDashoffset = -accumulatedAngle;
        const color = colors[name] || "#6366F1";

        svgArcs += `
          <circle cx="${center}" cy="${center}" r="${radius}"
            fill="transparent"
            stroke="${color}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${strokeDasharray}"
            stroke-dashoffset="${strokeDashoffset}"
            class="donut-segment"
          />
        `;

        accumulatedAngle += pct * circumference;
      });

      container.innerHTML = `
        <svg viewBox="0 0 ${size} ${size}" class="donut-svg">
          <g transform="rotate(-90 ${center} ${center})">
            ${svgArcs}
          </g>
          <text x="${center}" y="${center - 4}" text-anchor="middle" font-size="18" font-weight="700" fill="var(--text-primary)">
            ${total.toFixed(0)}h
          </text>
          <text x="${center}" y="${center + 14}" text-anchor="middle" font-size="11" fill="var(--text-muted)">
            Total Hours
          </text>
        </svg>
      `;

      if (legendContainer) {
        legendContainer.innerHTML = entries.map(([name, hours]) => {
          const color = colors[name] || "#6366F1";
          const pct = Math.round((hours / total) * 100);
          return `
            <div class="legend-row">
              <span class="legend-color-dot" style="background: ${color}"></span>
              <span class="legend-subj-name">${name}</span>
              <span class="legend-val">${hours}h (${pct}%)</span>
            </div>
          `;
        }).join('');
      }
    },

    renderBadges: function(badges) {
      const container = document.getElementById('achievements-grid');
      if (!container || !badges) return;

      container.innerHTML = badges.map(b => `
        <div class="badge-card ${b.unlocked ? 'badge-unlocked' : 'badge-locked'}">
          <div class="badge-icon-wrap">${b.icon}</div>
          <div class="badge-info">
            <div class="badge-title-row">
              <h4 class="badge-title">${b.title}</h4>
              ${b.unlocked ? '<span class="badge-status-pill">Unlocked</span>' : '<span class="badge-status-pill locked">In Progress</span>'}
            </div>
            <p class="badge-desc">${b.desc}</p>
            <div class="badge-footer">
              ${b.unlocked ? `<span class="badge-unlocked-date">Achieved ${b.date}</span>` : `<span class="badge-progress-text">${b.progress}</span>`}
            </div>
          </div>
        </div>
      `).join('');
    }
  };

  window.SSA_Progress = Progress;
})();
