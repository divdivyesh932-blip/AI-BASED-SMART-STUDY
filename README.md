# 🎓 Smart Study Assistant — AI Academic Workload & Schedule Manager

> **Design Thinking Project Prototype** for College Students  
> Target Persona: College engineering/undergraduate students balancing multiple subjects, assignments, lab work, exams, projects, and placement preparation.

---

## 🌟 Overview & Key Features

1. **Student Dashboard (`Home`)**
   - Live agenda of today's study tasks with priority badges and subject chips.
   - Upcoming deadlines countdown (Assignments, Lab Submissions, Midterm/Final Exams).
   - Radial progress ring tracking daily hours (Target vs. Actual) and task completion ratio.
   - AI Study Coach daily motivational quotes & academic wisdom with 1-click refresh.
   - Built-in Pomodoro Focus Station (25-min countdown with animated progress ring).

2. **AI Personalized Study Planner (`Planner`)**
   - Automatically divides available weekday & weekend study hours among subjects based on difficulty, credit hours, and upcoming exam dates.
   - Interactive Weekly Grid and Daily Timeline views.
   - Reschedule study slots with drag/swap actions.
   - AI Study Plan Generator Wizard with configurable study hours and focus targets.

3. **Smart Task Prioritizer (`Tasks`)**
   - AI Priority Scoring Engine combining:
     $$\text{Urgency (Days Left)} + \text{Difficulty} + \text{Category Weight} + \text{Workload (Duration)}$$
   - Classifies tasks automatically as **High Priority (🔴)**, **Medium Priority (🟡)**, or **Low Priority (🟢)**.
   - **Ranked List View** & **Eisenhower Matrix View** (Do First, Schedule, Quick Wins, Buffer/Review).
   - "Add Task" modal with **Live AI Score Prediction** updating in real time as you adjust difficulty or deadline.

4. **Smart Reminders & Notification Hub**
   - Sticky reminder alerts for imminent assignments ("Due in 24 hours").
   - Slide-out Notifications Drawer with snooze, mark-read, and 1-click shortcut navigation.

5. **AI Concept Helper (`AI Helper` — Athena Academic Tutor)**
   - Interactive chat mentor interface for college subjects.
   - Quick action chips:
     - 💡 **Explain Simply (ELI5)**: High-level intuitive concept explanation.
     - 🔍 **Give Example & Analogy**: Real-world metaphors and code snippets.
     - 📝 **Summary Cheat Sheet**: High-yield exam bullet points.
     - 🧪 **Interactive Practice Quiz**: Multiple-choice questions with immediate green/red feedback and explanations.
   - Pre-loaded college topics: *Virtual Memory & Paging*, *Dijkstra's Algorithm*, *Database Normalization*, *Gradient Descent*, etc.
   - "Save Note" and "Add 30m Session to Planner" direct integration.

6. **Progress Tracker & Gamified Streaks (`Progress`)**
   - Active Study Streak counter with animated flame and 7-day dot matrix.
   - Interactive SVG Bar Chart comparing weekly actual study hours against daily targets.
   - Interactive SVG Donut Chart showing subject-wise time distribution.
   - Gamified Achievement Badges (*Consistency Master*, *Night Owl Scholar*, *Deadline Destroyer*).

7. **Adaptive Study Plan Engine (Missed Task Recovery)**
   - When a student misses a scheduled study session, the AI doesn't let the plan fail.
   - Click the **"⚠️ Simulate Missed Task"** button to trigger the Adaptive AI Rebalancer.
   - Offers 3 dynamic rescheduling proposals (e.g. shift to tonight, split across weekday evenings, or add to weekend block).

---

## 💡 Design Thinking Framework Breakdown

Click the **"💡 Design Thinking"** button in the sidebar of the app to view this breakdown directly inside the prototype:

| Stage | Focus in Smart Study Assistant |
| :--- | :--- |
| **1. Empathize** | College students juggle 6+ subjects, lab submissions, exams, and placement prep, leading to stress, procrastination, and fragmented timetables. |
| **2. Define** | Traditional calendar apps are static and punitive: missing one slot throws off the entire schedule with no automated guidance on what to do next. |
| **3. Ideate** | Combine an algorithmic urgency-difficulty prioritization matrix with an adaptive rebalancing engine and an in-app AI academic tutor. |
| **4. Prototype** | High-fidelity interactive web/mobile prototype built with clean Vanilla HTML5, CSS3 Custom Properties, and modular JavaScript. |
| **5. Test** | Live interactive demo showcasing missed task simulation, AI tutor quizzes, Pomodoro focus mode, and theme switching. |

---

## 🚀 How to Run Locally

1. Simply open `index.html` in any web browser (Google Chrome, Microsoft Edge, Firefox, Safari):
   ```bash
   # Direct browser launch (Windows)
   start "" "index.html"
   ```
2. Or serve using any lightweight static server:
   ```bash
   # If Python is installed:
   python -m http.server 8000

   # Or npx serve:
   npx serve .
   ```

---

## 📱 Mobile Preview Mode
Click the **Mobile Device icon** in the top navigation bar to toggle between the full **Desktop Dashboard** and the sleek **Smartphone Viewport Frame** (simulating an iPhone with bottom navigation)!
