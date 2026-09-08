// AI Concept Helper (Athena Academic Tutor)
(function() {
  const AIHelper = {
    currentTopic: "Virtual Memory & Paging",
    currentSubject: "Operating Systems",
    isStreaming: false,
    chatHistory: [],
    savedNotes: [],

    init: function() {
      this.bindEvents();
      this.renderTopicPills();
      this.renderWelcome();
    },

    getLibrary: function() {
      return window.SSA_DATA.conceptHelperLibrary;
    },

    renderTopicPills: function() {
      const container = document.getElementById('ai-preset-topics-container');
      if (!container) return;

      const topics = [
        { name: "Virtual Memory & Paging", subj: "Operating Systems", icon: "🧠" },
        { name: "Dijkstra's Algorithm", subj: "Data Structures", icon: "🗺️" },
        { name: "Database Normalization (3NF/BCNF)", subj: "DBMS", icon: "🗄️" },
        { name: "Gradient Descent", subj: "Machine Learning", icon: "📉" },
        { name: "TCP 3-Way Handshake", subj: "Computer Networks", icon: "🌐" },
        { name: "Deadlocks & Banker's Algorithm", subj: "Operating Systems", icon: "🔒" }
      ];

      container.innerHTML = topics.map(t => `
        <button class="topic-chip-pill" onclick="window.SSA_AIHelper.askPreset('${t.name}', '${t.subj}')">
          <span class="chip-icon">${t.icon}</span>
          <span class="chip-label">${t.name}</span>
          <span class="chip-subj">${t.subj}</span>
        </button>
      `).join('');
    },

    renderWelcome: function() {
      const chatContainer = document.getElementById('ai-chat-messages');
      if (!chatContainer) return;

      chatContainer.innerHTML = `
        <div class="ai-msg-bubble system-welcome">
          <div class="ai-avatar-badge">✨ Athena</div>
          <div class="msg-content">
            <h3>Hello Alex! I am Athena, your AI Academic Concept Mentor.</h3>
            <p>Stuck on a tricky lecture topic, algorithmic proof, or lab problem? Type any concept or pick a popular topic above, then choose how you'd like me to explain it.</p>
            <div class="welcome-quick-actions">
              <button class="btn-quick-chip" onclick="window.SSA_AIHelper.askPreset('Virtual Memory & Paging', 'Operating Systems')">
                🧠 Explain Virtual Memory & Paging
              </button>
              <button class="btn-quick-chip" onclick="window.SSA_AIHelper.askPreset('Dijkstra\\'s Shortest Path Algorithm', 'Data Structures & Algorithms')">
                🗺️ Explain Dijkstra's Algorithm
              </button>
              <button class="btn-quick-chip" onclick="window.SSA_AIHelper.askPreset('Database Normalization (1NF to 3NF & BCNF)', 'Database Management Systems')">
                🗄️ Explain Normalization (1NF-3NF)
              </button>
            </div>
          </div>
        </div>
      `;
    },

    openForTopic: function(topicName) {
      if (window.SSA_App && window.SSA_App.switchTab) {
        window.SSA_App.switchTab('aiHelper');
      }
      setTimeout(() => {
        const input = document.getElementById('ai-prompt-input');
        if (input) {
          input.value = topicName;
        }
        this.processQuery(topicName, "explain");
      }, 150);
    },

    askPreset: function(topicName, subject) {
      const input = document.getElementById('ai-prompt-input');
      if (input) input.value = topicName;
      this.currentTopic = topicName;
      this.currentSubject = subject || "Computer Science";
      this.processQuery(topicName, "explain");
    },

    triggerAction: function(mode) {
      const input = document.getElementById('ai-prompt-input');
      const query = input && input.value.trim() ? input.value.trim() : (this.currentTopic || "Virtual Memory & Paging");
      this.processQuery(query, mode);
    },

    processQuery: function(topic, mode) {
      if (this.isStreaming) return;

      const chatContainer = document.getElementById('ai-chat-messages');
      if (!chatContainer) return;

      // Append User message
      const modeLabels = {
        explain: "Explain Simply (ELI5)",
        example: "Give Real-World Example & Analogy",
        summarize: "Summarize Key Takeaways",
        quiz: "Quiz Me on this Concept"
      };

      const userText = mode ? `${modeLabels[mode] || mode}: "${topic}"` : topic;
      this.appendUserMessage(userText);

      // Scroll to bottom
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Find in library or synthesize
      const library = this.getLibrary();
      const match = library.find(item => 
        item.topic.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(item.topic.toLowerCase().split(' ')[0])
      );

      // Append AI typing placeholder
      const msgId = 'ai-msg-' + Date.now();
      const aiBubble = document.createElement('div');
      aiBubble.className = 'ai-msg-bubble athena-response';
      aiBubble.id = msgId;
      aiBubble.innerHTML = `
        <div class="ai-avatar-badge">✨ Athena AI</div>
        <div class="msg-content">
          <div class="typing-indicator-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      chatContainer.appendChild(aiBubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      this.isStreaming = true;

      // Simulate network & AI thinking
      setTimeout(() => {
        const responseData = this.generateResponseData(topic, mode, match);
        this.streamResponse(msgId, responseData);
      }, 600);
    },

    appendUserMessage: function(text) {
      const chatContainer = document.getElementById('ai-chat-messages');
      const userBubble = document.createElement('div');
      userBubble.className = 'user-msg-bubble';
      userBubble.innerHTML = `
        <div class="msg-content">${this.escapeHTML(text)}</div>
        <div class="user-avatar-badge">You</div>
      `;
      chatContainer.appendChild(userBubble);
    },

    generateResponseData: function(topic, mode, match) {
      if (match) {
        if (mode === 'example') {
          return {
            title: `Real-World Example & Analogy: ${match.topic}`,
            html: `
              <div class="analogy-highlight-box">
                <div class="box-badge">💡 Intuitive Analogy</div>
                <p>${match.analogy}</p>
              </div>
              <h4>Practical Code / Architecture Example:</h4>
              <pre class="code-snippet-card"><code>${this.escapeHTML(match.example)}</code></pre>
              <div class="concept-callout-tip">
                <strong>Pro-Tip for Exams:</strong> When writing this answer in college exams, drawing this analogy diagram earns full marks for concept clarity!
              </div>
            `,
            plainText: `${match.analogy}\n\nExample:\n${match.example}`
          };
        } else if (mode === 'summarize') {
          return {
            title: `Summary Cheat Sheet: ${match.topic}`,
            html: `
              <div class="cheat-sheet-card">
                <h4>📌 High-Yield Key Points</h4>
                <ul class="key-points-list">
                  ${match.keyPoints.map(pt => `<li>${pt}</li>`).join('')}
                </ul>
              </div>
            `,
            plainText: match.keyPoints.join('\n- ')
          };
        } else if (mode === 'quiz') {
          const q = match.quiz[0];
          return {
            title: `Quick Concept Check: ${match.topic}`,
            isQuiz: true,
            quizData: q,
            html: `
              <div class="interactive-quiz-card" id="quiz-${Date.now()}">
                <div class="quiz-question-tag">🎯 Practice Quiz Question</div>
                <p class="quiz-q-text">${q.question}</p>
                <div class="quiz-options-group">
                  ${q.options.map((opt, i) => `
                    <button class="quiz-option-btn" onclick="window.SSA_AIHelper.handleQuizAnswer(this, ${i}, ${q.correct}, '${this.escapeHTML(q.explanation)}')">
                      <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
                      <span class="opt-text">${opt}</span>
                    </button>
                  `).join('')}
                </div>
                <div class="quiz-feedback-box" style="display: none;"></div>
              </div>
            `,
            plainText: q.question
          };
        } else {
          // Default: Explain simply
          return {
            title: `Concept Breakdown: ${match.topic}`,
            html: `
              <div class="concept-simple-explanation">
                ${match.simpleExplanation.replace(/\n\n/g, '</p><p>')}
              </div>
              <div class="cheat-sheet-card" style="margin-top: 14px;">
                <h4>🔑 Key Takeaways for Exams</h4>
                <ul class="key-points-list">
                  ${match.keyPoints.slice(0, 3).map(pt => `<li>${pt}</li>`).join('')}
                </ul>
              </div>
            `,
            plainText: match.simpleExplanation
          };
        }
      } else {
        // Fallback dynamic generative synthesis
        return {
          title: `Academic Breakdown: ${topic}`,
          html: `
            <div class="concept-simple-explanation">
              <p><strong>${this.escapeHTML(topic)}</strong> is an essential college concept.</p>
              <p>In simple terms, it provides a structured method to solve a specific problem by breaking down complex operations into deterministic, modular steps.</p>
            </div>
            <div class="cheat-sheet-card" style="margin-top: 12px;">
              <h4>📌 3 Things to Remember:</h4>
              <ul class="key-points-list">
                <li><strong>Definition:</strong> Core theoretical principle and purpose in engineering applications.</li>
                <li><strong>Trade-offs:</strong> Space vs. Time complexity or throughput vs. latency considerations.</li>
                <li><strong>Common Exam Pitfall:</strong> Ensure edge conditions (e.g. null inputs, base cases) are addressed.</li>
              </ul>
            </div>
          `,
          plainText: `Overview of ${topic} with exam notes.`
        };
      }
    },

    streamResponse: function(bubbleId, responseData) {
      const bubble = document.getElementById(bubbleId);
      if (!bubble) {
        this.isStreaming = false;
        return;
      }

      const content = bubble.querySelector('.msg-content');
      if (!content) return;

      content.innerHTML = `
        <div class="response-header">
          <h4 class="response-title">${responseData.title}</h4>
          <div class="response-actions-top">
            <button class="btn-bubble-action" title="Save to Notebook" onclick="window.SSA_AIHelper.saveNote('${this.escapeHTML(responseData.title)}')">
              💾 Save Note
            </button>
            <button class="btn-bubble-action" title="Add to Study Plan" onclick="window.SSA_AIHelper.addToStudyPlan('${this.escapeHTML(responseData.title)}')">
              📅 Add 30m Session
            </button>
          </div>
        </div>
        <div class="response-body animate-fade-in">
          ${responseData.html}
        </div>
        <div class="response-followup-chips">
          <span class="followup-label">Follow up:</span>
          <button class="btn-chip-subtle" onclick="window.SSA_AIHelper.triggerAction('explain')">💡 Explain Simpler</button>
          <button class="btn-chip-subtle" onclick="window.SSA_AIHelper.triggerAction('example')">🔍 Give Example</button>
          <button class="btn-chip-subtle" onclick="window.SSA_AIHelper.triggerAction('summarize')">📝 Cheat Sheet</button>
          <button class="btn-chip-subtle" onclick="window.SSA_AIHelper.triggerAction('quiz')">🧪 Quiz Me</button>
        </div>
      `;

      this.isStreaming = false;
      const chatContainer = document.getElementById('ai-chat-messages');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    handleQuizAnswer: function(btnEl, selectedIdx, correctIdx, explanation) {
      const parentCard = btnEl.closest('.interactive-quiz-card');
      if (!parentCard) return;

      const buttons = parentCard.querySelectorAll('.quiz-option-btn');
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctIdx) {
          btn.classList.add('is-correct');
        } else if (idx === selectedIdx) {
          btn.classList.add('is-incorrect');
        }
      });

      const feedbackBox = parentCard.querySelector('.quiz-feedback-box');
      if (feedbackBox) {
        const isRight = selectedIdx === correctIdx;
        feedbackBox.style.display = 'block';
        feedbackBox.className = `quiz-feedback-box ${isRight ? 'feedback-correct' : 'feedback-incorrect'}`;
        feedbackBox.innerHTML = `
          <strong>${isRight ? '🎉 Correct Answer!' : '❌ Not Quite Right'}</strong>
          <p>${explanation}</p>
        `;
      }
    },

    saveNote: function(title) {
      this.savedNotes.push({
        id: 'note-' + Date.now(),
        title: title,
        date: new Date().toLocaleDateString()
      });
      if (window.SSA_App) window.SSA_App.showToast(`💾 Saved "${title}" to your Study Notes!`);
    },

    addToStudyPlan: function(title) {
      if (!window.SSA_State) return;
      const schedule = window.SSA_State.weeklySchedule;
      const day = "Monday"; // or current day

      if (!schedule[day]) schedule[day] = [];
      schedule[day].push({
        id: "slot-ai-" + Date.now(),
        time: "22:00 - 22:30",
        subjectId: "cs501",
        topic: `AI Concept Review: ${title.replace('Concept Breakdown: ', '').replace('Summary Cheat Sheet: ', '')}`,
        status: "pending"
      });

      if (window.SSA_App && window.SSA_App.saveState) window.SSA_App.saveState();
      if (window.SSA_Planner && window.SSA_Planner.render) window.SSA_Planner.render();
      if (window.SSA_App) window.SSA_App.showToast(`📅 Added 30-min AI Review to your Study Plan!`);
    },

    escapeHTML: function(str) {
      if (!str) return "";
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    },

    bindEvents: function() {
      const sendBtn = document.getElementById('btn-send-ai-prompt');
      const input = document.getElementById('ai-prompt-input');

      if (sendBtn && input) {
        sendBtn.addEventListener('click', () => {
          const val = input.value.trim();
          if (val) {
            this.processQuery(val, "explain");
            input.value = "";
          }
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const val = input.value.trim();
            if (val) {
              this.processQuery(val, "explain");
              input.value = "";
            }
          }
        });
      }

      // Quick action chip buttons
      const btnExplain = document.getElementById('chip-ai-explain');
      const btnExample = document.getElementById('chip-ai-example');
      const btnSummary = document.getElementById('chip-ai-summary');
      const btnQuiz = document.getElementById('chip-ai-quiz');

      if (btnExplain) btnExplain.addEventListener('click', () => this.triggerAction('explain'));
      if (btnExample) btnExample.addEventListener('click', () => this.triggerAction('example'));
      if (btnSummary) btnSummary.addEventListener('click', () => this.triggerAction('summarize'));
      if (btnQuiz) btnQuiz.addEventListener('click', () => this.triggerAction('quiz'));
    }
  };

  window.SSA_AIHelper = AIHelper;
})();
