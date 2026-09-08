// Realistic college student initial dataset for Smart Study Assistant
window.SSA_DATA = {
  student: {
    name: "Alex Chen",
    college: "Institute of Engineering & Technology",
    major: "B.Tech Computer Science & Engineering",
    semester: "Semester 5 (Junior Year)",
    targetGPA: "9.2 / 10.0",
    currentStreak: 7,
    totalHoursStudied: 142.5,
    streakHistory: [true, true, true, true, true, true, true],
    dailyTargetHours: 4.5,
    studyHoursToday: 2.8,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },

  subjects: [
    {
      id: "cs501",
      name: "Data Structures & Algorithms",
      code: "CS501",
      color: "#6366F1", // Indigo
      difficulty: "Hard",
      creditHours: 4,
      faculty: "Dr. K. Sharma",
      targetHoursPerWeek: 8,
      completedHoursThisWeek: 6.5,
      syllabusProgress: 68
    },
    {
      id: "cs502",
      name: "Operating Systems",
      code: "CS502",
      color: "#8B5CF6", // Purple
      difficulty: "Hard",
      creditHours: 4,
      faculty: "Prof. Sarah Miller",
      targetHoursPerWeek: 7,
      completedHoursThisWeek: 4.0,
      syllabusProgress: 55
    },
    {
      id: "cs503",
      name: "Database Management Systems",
      code: "CS503",
      color: "#06B6D4", // Cyan
      difficulty: "Medium",
      creditHours: 3,
      faculty: "Dr. A. Verma",
      targetHoursPerWeek: 5,
      completedHoursThisWeek: 4.5,
      syllabusProgress: 82
    },
    {
      id: "cs504",
      name: "Machine Learning Lab",
      code: "CS504L",
      color: "#EC4899", // Pink
      difficulty: "Medium",
      creditHours: 2,
      faculty: "Prof. David Lee",
      targetHoursPerWeek: 4,
      completedHoursThisWeek: 3.0,
      syllabusProgress: 75
    },
    {
      id: "cs505",
      name: "Computer Networks",
      code: "CS505",
      color: "#10B981", // Emerald
      difficulty: "Medium",
      creditHours: 3,
      faculty: "Dr. M. R. Gupta",
      targetHoursPerWeek: 4,
      completedHoursThisWeek: 2.5,
      syllabusProgress: 60
    },
    {
      id: "prep01",
      name: "Placement & Aptitude Prep",
      code: "T&P101",
      color: "#F59E0B", // Amber
      difficulty: "Medium",
      creditHours: 2,
      faculty: "Placement Cell",
      targetHoursPerWeek: 5,
      completedHoursThisWeek: 3.5,
      syllabusProgress: 50
    }
  ],

  tasks: [
    {
      id: "task-1",
      title: "Implement Dijkstra's & Prim's Algorithm in C++",
      subjectId: "cs501",
      category: "Lab Work",
      deadline: "2026-09-09T23:59:00",
      daysLeft: 1,
      difficulty: "Hard",
      estimatedMinutes: 90,
      completed: false,
      priorityScore: 95,
      priorityLevel: "High",
      rationale: "Urgent lab submission due in 24 hours + High algorithmic complexity",
      scheduledDate: "Today",
      scheduledTime: "16:00 - 17:30"
    },
    {
      id: "task-2",
      title: "Operating Systems: Page Replacement Algorithms (FIFO, LRU, Optimal)",
      subjectId: "cs502",
      category: "Exam Prep",
      deadline: "2026-09-11T09:00:00",
      daysLeft: 2.5,
      difficulty: "Hard",
      estimatedMinutes: 120,
      completed: false,
      priorityScore: 88,
      priorityLevel: "High",
      rationale: "Midterm exam in 3 days; heavily weighted topic (15 marks)",
      scheduledDate: "Today",
      scheduledTime: "18:30 - 20:30"
    },
    {
      id: "task-3",
      title: "DBMS Assignment 3: B+ Trees & 3NF Normalization Decomposition",
      subjectId: "cs503",
      category: "Assignment",
      deadline: "2026-09-10T17:00:00",
      daysLeft: 2,
      difficulty: "Medium",
      estimatedMinutes: 60,
      completed: false,
      priorityScore: 82,
      priorityLevel: "High",
      rationale: "Assignment deadline approaching; contributes to internal assessment",
      scheduledDate: "Today",
      scheduledTime: "21:00 - 22:00"
    },
    {
      id: "task-4",
      title: "Machine Learning Lab: Linear Regression with Gradient Descent from scratch",
      subjectId: "cs504",
      category: "Lab Work",
      deadline: "2026-09-12T14:00:00",
      daysLeft: 4,
      difficulty: "Medium",
      estimatedMinutes: 75,
      completed: false,
      priorityScore: 68,
      priorityLevel: "Medium",
      rationale: "Moderate difficulty; due in 4 days before Thursday lab batch",
      scheduledDate: "Tomorrow",
      scheduledTime: "16:00 - 17:15"
    },
    {
      id: "task-5",
      title: "Practice 15 Quantitative Aptitude questions (Time & Work, Permutations)",
      subjectId: "prep01",
      category: "Placement Prep",
      deadline: "2026-09-13T20:00:00",
      daysLeft: 5,
      difficulty: "Easy",
      estimatedMinutes: 45,
      completed: true,
      priorityScore: 54,
      priorityLevel: "Medium",
      rationale: "Weekly placement practice consistency",
      scheduledDate: "Today",
      scheduledTime: "07:30 - 08:15"
    },
    {
      id: "task-6",
      title: "Computer Networks: Subnetting & CIDR notation practice problem sheet",
      subjectId: "cs505",
      category: "Assignment",
      deadline: "2026-09-14T23:59:00",
      daysLeft: 6,
      difficulty: "Medium",
      estimatedMinutes: 60,
      completed: false,
      priorityScore: 48,
      priorityLevel: "Low",
      rationale: "Submission early next week; safe time buffer",
      scheduledDate: "Thursday",
      scheduledTime: "17:00 - 18:00"
    },
    {
      id: "task-7",
      title: "Read research summary on Convolutional Neural Networks for Mini-Project",
      subjectId: "cs504",
      category: "Project",
      deadline: "2026-09-16T18:00:00",
      daysLeft: 8,
      difficulty: "Easy",
      estimatedMinutes: 40,
      completed: false,
      priorityScore: 35,
      priorityLevel: "Low",
      rationale: "Preliminary reading for next sprint",
      scheduledDate: "Friday",
      scheduledTime: "19:00 - 19:40"
    }
  ],

  deadlines: [
    {
      id: "dl-1",
      title: "DSA Lab Code Submission (Graphs)",
      subject: "Data Structures & Algorithms",
      code: "CS501",
      dateStr: "Tomorrow, 11:59 PM",
      urgent: true,
      type: "Lab Submission",
      daysRemaining: 1
    },
    {
      id: "dl-2",
      title: "DBMS Assignment 3 (Normalization)",
      subject: "Database Management Systems",
      code: "CS503",
      dateStr: "Thu, 5:00 PM",
      urgent: true,
      type: "Assignment",
      daysRemaining: 2
    },
    {
      id: "dl-3",
      title: "Operating Systems Mid-Term Exam",
      subject: "Operating Systems",
      code: "CS502",
      dateStr: "Fri, 9:00 AM",
      urgent: true,
      type: "Exam",
      daysRemaining: 3
    },
    {
      id: "dl-4",
      title: "ML Lab Model Evaluation Report",
      subject: "Machine Learning Lab",
      code: "CS504L",
      dateStr: "Sat, 2:00 PM",
      urgent: false,
      type: "Lab Report",
      daysRemaining: 4
    },
    {
      id: "dl-5",
      title: "On-Campus Tech Mock Interview & Test",
      subject: "Placement & Aptitude Prep",
      code: "T&P101",
      dateStr: "Sun, 10:00 AM",
      urgent: false,
      type: "Placement",
      daysRemaining: 5
    }
  ],

  weeklySchedule: {
    "Monday": [
      { id: "s-1", time: "07:30 - 08:30", subjectId: "prep01", topic: "Aptitude: Speed Math & Ratios", status: "completed" },
      { id: "s-2", time: "16:00 - 17:30", subjectId: "cs501", topic: "Dijkstra & Prim Implementation", status: "pending" },
      { id: "s-3", time: "18:30 - 20:30", subjectId: "cs502", topic: "Virtual Memory & Page Faults", status: "pending" },
      { id: "s-4", time: "21:00 - 22:00", subjectId: "cs503", topic: "3NF & BCNF Normalization", status: "pending" }
    ],
    "Tuesday": [
      { id: "s-5", time: "07:30 - 08:30", subjectId: "cs505", topic: "OSI & TCP/IP Layer Protocols", status: "pending" },
      { id: "s-6", time: "16:00 - 17:15", subjectId: "cs504", topic: "Gradient Descent Implementation", status: "pending" },
      { id: "s-7", time: "18:00 - 19:30", subjectId: "cs502", topic: "Process Scheduling & Deadlocks", status: "pending" },
      { id: "s-8", time: "20:30 - 21:30", subjectId: "cs501", topic: "Dynamic Programming: Knapsack", status: "pending" }
    ],
    "Wednesday": [
      { id: "s-9", time: "16:00 - 17:30", subjectId: "cs503", topic: "SQL Subqueries & Indexing", status: "pending" },
      { id: "s-10", time: "18:00 - 20:00", subjectId: "cs502", topic: "OS Midterm Mock Paper Solving", status: "pending" },
      { id: "s-11", time: "20:30 - 21:30", subjectId: "prep01", topic: "Coding: LeetCode Mediums", status: "pending" }
    ],
    "Thursday": [
      { id: "s-12", time: "16:00 - 18:00", subjectId: "cs504", topic: "ML Lab Model Tuning & Results", status: "pending" },
      { id: "s-13", time: "18:30 - 20:30", subjectId: "cs502", topic: "Final OS Revision & Formulae", status: "pending" },
      { id: "s-14", time: "21:00 - 22:00", subjectId: "cs505", topic: "Subnetting Problem Sets", status: "pending" }
    ],
    "Friday": [
      { id: "s-15", time: "09:00 - 11:30", subjectId: "cs502", topic: "⭐️ OS Mid-term Exam Slot", status: "pending" },
      { id: "s-16", time: "16:00 - 18:00", subjectId: "cs501", topic: "Binary Search Trees & Heaps", status: "pending" },
      { id: "s-17", time: "19:00 - 20:30", subjectId: "prep01", topic: "Mock Placement Reasoning Quiz", status: "pending" }
    ],
    "Saturday": [
      { id: "s-18", time: "10:00 - 12:30", subjectId: "cs504", topic: "ML Mini-Project Dataset Prep", status: "pending" },
      { id: "s-19", time: "14:00 - 16:00", subjectId: "cs503", topic: "Transactions & ACID Properties", status: "pending" },
      { id: "s-20", time: "17:00 - 18:30", subjectId: "cs505", topic: "Routing Algorithms (Distance Vector)", status: "pending" }
    ],
    "Sunday": [
      { id: "s-21", time: "10:00 - 12:00", subjectId: "prep01", topic: "Full Placement Test Simulation", status: "pending" },
      { id: "s-22", time: "15:00 - 17:00", subjectId: "cs501", topic: "Weekly LeetCode Contest Review", status: "pending" },
      { id: "s-23", time: "18:00 - 19:30", subjectId: "cs502", topic: "Next Week's Syllabus Preview", status: "pending" }
    ]
  },

  notifications: [
    {
      id: "notif-1",
      title: "Assignment Due Tomorrow!",
      message: "DSA Lab Dijkstra Implementation is due tomorrow at 11:59 PM. You have 1 task pending.",
      timeAgo: "10 mins ago",
      type: "urgent",
      unread: true,
      actionText: "Open Task",
      targetTab: "tasks"
    },
    {
      id: "notif-2",
      title: "AI Study Coach Alert",
      message: "Your peak focus hours are between 18:00 and 21:00. Suggested: Tackle OS Virtual Memory tonight.",
      timeAgo: "1 hour ago",
      type: "ai",
      unread: true,
      actionText: "View Plan",
      targetTab: "planner"
    },
    {
      id: "notif-3",
      title: "OS Mid-term in 3 Days",
      message: "You've revised 55% of Operating Systems. Allocate 2 hours tonight to maintain 85%+ readiness.",
      timeAgo: "3 hours ago",
      type: "warning",
      unread: false,
      actionText: "Study Now",
      targetTab: "aiHelper"
    },
    {
      id: "notif-4",
      title: "Streak Milestone Unlocked! 🔥",
      message: "7-Day Study Streak achieved! You've logged 18.5 hours this week. Keep the momentum going!",
      timeAgo: "Yesterday",
      type: "success",
      unread: false,
      actionText: "View Badges",
      targetTab: "progress"
    }
  ],

  quotes: [
    {
      quote: "Success in engineering isn't about pulling all-nighters; it's about 90 minutes of laser focus every single day.",
      author: "AI Study Coach • Daily Wisdom"
    },
    {
      quote: "Small consistent daily improvements over time lead to stunning semester results.",
      author: "Robin Sharma (Adapted for Students)"
    },
    {
      quote: "Don't wish it were easier; make your study habits stronger.",
      author: "Jim Rohn"
    },
    {
      quote: "A difficult concept is simply a simple concept that hasn't been broken down into small enough steps yet.",
      author: "AI Academic Mentor"
    }
  ],

  conceptHelperLibrary: [
    {
      topic: "Dijkstra's Shortest Path Algorithm",
      subject: "Data Structures & Algorithms",
      simpleExplanation: "Think of Dijkstra's algorithm like Google Maps finding the fastest route to your college.\n\nImagine you start at your house with a travel time of 0. For every intersection directly connected to you, you calculate how long it takes to reach it. You ALWAYS pick the closest unvisited intersection next. Once you reach an intersection via its quickest route, you lock it in, look at its neighbors, and update their shortest times if this new path is faster. Repeat until all spots are reached!",
      keyPoints: [
        "Finds single-source shortest path in weighted graphs with non-negative edge weights.",
        "Uses a Greedy approach (always picks minimum distance node).",
        "Data Structure used: Min-Priority Queue (Min-Heap) + Distance Array.",
        "Time Complexity: O((V + E) log V) using a binary min-heap.",
        "Limitation: Cannot handle negative edge weights (use Bellman-Ford for that)."
      ],
      example: "// C++ snippet with Priority Queue\npriority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\ndist[source] = 0;\npq.push({0, source});\n\nwhile(!pq.empty()) {\n    auto [d, u] = pq.top(); pq.pop();\n    if (d > dist[u]) continue;\n    for(auto& edge : adj[u]) {\n        int v = edge.to, weight = edge.w;\n        if(dist[u] + weight < dist[v]) {\n            dist[v] = dist[u] + weight;\n            pq.push({dist[v], v});\n        }\n    }\n}",
      analogy: "Imagine water flooding through connected pipes of different lengths. The first water droplet to reach any junction marks the absolute shortest time to get there!",
      quiz: [
        {
          question: "What is the time complexity of Dijkstra's algorithm implemented with an adjacency list and binary min-heap?",
          options: ["O(V^2)", "O((V + E) log V)", "O(V * E)", "O(log V)"],
          correct: 1,
          explanation: "Each vertex is extracted from the min-heap once (V log V) and each edge is relaxed at most once (E log V), giving O((V + E) log V)."
        }
      ]
    },
    {
      topic: "Virtual Memory & Paging",
      subject: "Operating Systems",
      simpleExplanation: "Virtual memory is a clever illusion created by the OS and CPU hardware. It makes each program believe it has access to a huge, private, continuous chunk of RAM, even if the physical RAM is tiny or fragmented into small scattered pieces.\n\nInstead of loading a 10 GB game entirely into 8 GB RAM, the OS divides memory into fixed-size chunks called Pages (e.g. 4KB). Only the pages currently being executed are loaded into physical slots called Frames. The rest stays on the SSD/hard drive until needed.",
      keyPoints: [
        "Separates logical address space from physical RAM.",
        "Page Table translates virtual addresses (Page Number + Offset) to physical Frame numbers.",
        "Page Fault: Happens when a requested page is not currently present in RAM; the OS fetches it from secondary storage.",
        "TLB (Translation Lookaside Buffer): Fast hardware cache to speed up address translation.",
        "Thrashing: When a system spends more time swapping pages in/out of disk than executing real instructions."
      ],
      example: "Virtual Address = [ Page Number (p) | Offset (d) ]\n1. Check TLB for page 'p'.\n2. If TLB hit: obtain Frame 'f' directly in ~1ns.\n3. If TLB miss: query Page Table in RAM.\n4. If valid bit = 0 -> Hardware raises Page Fault Exception -> OS swaps page from disk into a free frame.",
      analogy: "Like a student studying for exams: You have 10 huge textbooks (virtual memory), but your study desk (RAM) can only fit 2 open books at a time. When you need a different chapter, you put one book back on the shelf and pull the new one out (Paging)!",
      quiz: [
        {
          question: "What hardware unit specifically caches recent virtual-to-physical address translations?",
          options: ["L2 Cache", "TLB (Translation Lookaside Buffer)", "ALU", "Instruction Register"],
          correct: 1,
          explanation: "The TLB is an associative, high-speed hardware cache specifically designed to store recent virtual page-to-frame translations."
        }
      ]
    },
    {
      topic: "Database Normalization (1NF to 3NF & BCNF)",
      subject: "Database Management Systems",
      simpleExplanation: "Normalization is the process of organizing database tables to reduce data redundancy (duplicate information) and eliminate update, insertion, and deletion anomalies.\n\nWithout normalization, changing a student's hostel room might require updating 50 rows, risking messy inconsistencies if one row is forgotten.",
      keyPoints: [
        "1NF (First Normal Form): Every column contains atomic (indivisible) values; no repeating groups.",
        "2NF: Must be in 1NF + No Partial Dependency (all non-key attributes must depend on the whole composite primary key).",
        "3NF: Must be in 2NF + No Transitive Dependency (non-prime attributes must not depend on other non-prime attributes: X -> Y -> Z).",
        "BCNF: Stricter version of 3NF; for every functional dependency X -> Y, X must be a super key."
      ],
      example: "Bad Table: [StudentID, CourseID, Professor, ProfRoom]\n- ProfRoom depends on Professor, not directly on the Primary Key (StudentID, CourseID).\n\nNormalized Decomposition (3NF):\nTable 1: Student_Courses [StudentID, CourseID, Professor]\nTable 2: Faculty_Directory [Professor, ProfRoom]",
      analogy: "Think of your phone contacts. Instead of storing your friend's address 20 times inside every WhatsApp message, you store their address once in Contacts, and reference them by phone number.",
      quiz: [
        {
          question: "Which normal form requires eliminating transitive dependencies between non-prime attributes?",
          options: ["1NF", "2NF", "3NF", "BCNF"],
          correct: 2,
          explanation: "3NF requires that no non-prime attribute depends transitively on the primary key via another non-prime attribute."
        }
      ]
    },
    {
      topic: "Gradient Descent in Machine Learning",
      subject: "Machine Learning Lab",
      simpleExplanation: "Gradient descent is how AI models learn from mistakes.\n\nImagine you are blindfolded on a foggy mountain and want to reach the lowest valley (minimum cost/error). You can feel the slope of the ground under your feet. Gradient descent tells you: feel the steepest slope, take a step downhill, and repeat until the ground becomes flat!",
      keyPoints: [
        "Optimization algorithm that minimizes the Loss / Cost function J(w, b).",
        "Formula: w = w - alpha * (dJ / dw), where alpha is the Learning Rate.",
        "Learning Rate too high: Can overshoot or diverge.",
        "Learning Rate too low: Takes forever to converge.",
        "Variants: Batch Gradient Descent (all data), Stochastic GD (1 sample per step), Mini-Batch GD (32-128 samples per step)."
      ],
      example: "# Update weights iteratively\nfor epoch in range(num_epochs):\n    predictions = X @ weights + bias\n    error = predictions - y\n    gradient = (2/N) * (X.T @ error)\n    weights = weights - learning_rate * gradient",
      analogy: "Like rolling a marble down a bowl: gravity pushes it along the steepest angle downhill until it rests at the lowest center point.",
      quiz: [
        {
          question: "What happens if the learning rate (alpha) is set excessively high?",
          options: ["Model converges immediately", "Weights oscillate and may diverge", "Loss is guaranteed to reach global minimum", "Gradient becomes exactly zero"],
          correct: 1,
          explanation: "An oversized learning rate causes huge steps that overshoot the minimum, causing oscillation or diverging to infinity."
        }
      ]
    }
  ],

  achievements: [
    { id: "ach-1", title: "Consistency Master", desc: "Maintained a 7-day study streak", icon: "🔥", unlocked: true, date: "Today" },
    { id: "ach-2", title: "Deadline Destroyer", desc: "Completed 5 assignments before due date", icon: "⚡️", unlocked: true, date: "2 days ago" },
    { id: "ach-3", title: "Night Owl Scholar", desc: "Completed 20 hours of late evening deep work", icon: "🦉", unlocked: true, date: "Last week" },
    { id: "ach-4", title: "DSA Conqueror", desc: "Solved 30 LeetCode & Lab problems", icon: "🏆", unlocked: false, progress: "22/30" },
    { id: "ach-5", title: "Centurion Club", desc: "Log 150 total productive study hours", icon: "🎯", unlocked: false, progress: "142.5/150 hrs" }
  ],

  weeklyAnalytics: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    targetHours: [4.5, 4.5, 4.5, 4.5, 4.5, 6.0, 6.0],
    actualHours: [4.8, 5.0, 4.2, 4.6, 3.8, 5.5, 4.0],
    tasksCompleted: [4, 5, 3, 4, 3, 6, 4],
    subjectHours: {
      "Data Structures": 8.5,
      "Operating Systems": 7.0,
      "DBMS": 5.0,
      "ML Lab": 4.5,
      "Networks": 3.0,
      "Placement Prep": 4.0
    }
  }
};
