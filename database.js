const seedData = {
  users: [
    { 
      id: 1, 
      email: "prof@edusupreme.com", 
      password: "prof2025", 
      profile: "professor", 
      name: "Prof. Alexandre Silva",
      avatar: "AS",
      joinDate: "2024-01-15",
      stats: {
        coursesCreated: 12,
        studentsImpacted: 450,
        averageRating: 4.8
      }
    },
    { 
      id: 2, 
      email: "aluno@edusupreme.com", 
      password: "aluno2025", 
      profile: "aluno", 
      name: "Maria Eduarda Santos",
      avatar: "MS",
      joinDate: "2024-09-10",
      stats: {
        coursesCompleted: 8,
        hoursStudied: 124,
        averageGrade: 9.2,
        badges: ["first-course", "consistent-learner", "high-performer"]
      }
    }
  ],
  
  courses: [
    {
      id: 1,
      title: "Algoritmos e Estruturas de Dados",
      description: "Curso completo sobre algoritmos fundamentais e estruturas de dados",
      instructor: 1,
      students: [2],
      category: "Programação",
      level: "Intermediário",
      duration: "40 horas",
      progress: 65,
      rating: 4.9,
      thumbnail: "algorithms-course.jpg",
      modules: [1, 2, 3],
      tags: ["algoritmos", "programação", "estruturas-dados"],
      stats: {
        enrolled: 125,
        completed: 87,
        averageTime: "35 horas"
      }
    },
    {
      id: 2,
      title: "Design Systems Avançado",
      description: "Aprenda a criar e manter design systems escaláveis",
      instructor: 1,
      students: [2],
      category: "Design",
      level: "Avançado", 
      duration: "28 horas",
      progress: 30,
      rating: 4.7,
      thumbnail: "design-systems.jpg",
      modules: [4, 5],
      tags: ["design", "ui-ux", "sistemas"],
      stats: {
        enrolled: 89,
        completed: 52,
        averageTime: "26 horas"
      }
    }
  ],

  modules: [
    {
      id: 1,
      courseId: 1,
      title: "Introdução aos Algoritmos",
      description: "Conceitos fundamentais e notação Big O",
      order: 1,
      duration: "8 horas",
      status: "completed",
      lessons: [1, 2, 3]
    },
    {
      id: 2,
      courseId: 1,
      title: "Estruturas de Dados Lineares",
      description: "Arrays, Listas Ligadas, Pilhas e Filas",
      order: 2,
      duration: "12 horas", 
      status: "in-progress",
      lessons: [4, 5, 6, 7]
    },
    {
      id: 3,
      courseId: 1,
      title: "Árvores e Grafos",
      description: "Estruturas não-lineares e algoritmos de busca",
      order: 3,
      duration: "20 horas",
      status: "locked",
      lessons: [8, 9, 10, 11, 12]
    },
    {
      id: 4,
      courseId: 2,
      title: "Fundamentos do Design System",
      description: "Tokens, componentes e documentação",
      order: 1,
      duration: "10 horas",
      status: "completed",
      lessons: [13, 14, 15]
    },
    {
      id: 5,
      courseId: 2,
      title: "Implementação e Manutenção",
      description: "Versionamento, testes e evolução do sistema",
      order: 2,
      duration: "18 horas",
      status: "in-progress", 
      lessons: [16, 17, 18, 19]
    }
  ],

  lessons: [
    {
      id: 1,
      moduleId: 1,
      title: "O que são Algoritmos?",
      type: "video",
      duration: "15 min",
      content: "Introdução conceitual aos algoritmos e sua importância na programação.",
      completed: true,
      resources: ["slides.pdf", "codigo-exemplo.js"]
    },
    {
      id: 2,
      moduleId: 1,
      title: "Análise de Complexidade",
      type: "interactive",
      duration: "25 min", 
      content: "Aprenda a analisar a eficiência dos algoritmos usando notação Big O.",
      completed: true,
      quiz: {
        questions: 5,
        passingGrade: 70,
        userScore: 85
      }
    },
    {
      id: 3,
      moduleId: 1,
      title: "Exercícios Práticos",
      type: "assignment",
      duration: "45 min",
      content: "Implemente algoritmos básicos de busca e ordenação.",
      completed: true,
      assignment: {
        dueDate: "2024-10-15",
        submitted: true,
        grade: 9.5,
        feedback: "Excelente implementação! Código limpo e eficiente."
      }
    }
  ],

  badges: [
    {
      id: "first-course",
      name: "Primeiro Curso",
      description: "Completou seu primeiro curso na plataforma",
      icon: "🎓",
      rarity: "common",
      unlockedBy: [2]
    },
    {
      id: "consistent-learner",
      name: "Aprendiz Consistente", 
      description: "Estudou por 7 dias consecutivos",
      icon: "🔥",
      rarity: "rare",
      unlockedBy: [2]
    },
    {
      id: "high-performer",
      name: "Alto Desempenho",
      description: "Manteve média acima de 9.0",
      icon: "⭐",
      rarity: "epic",
      unlockedBy: [2]
    },
    {
      id: "mentor",
      name: "Mentor",
      description: "Ajudou mais de 100 estudantes",
      icon: "🏆",
      rarity: "legendary", 
      unlockedBy: [1]
    }
  ],

  analytics: {
    global: {
      totalUsers: 2547,
      activeCourses: 156,
      completionRate: 78.5,
      averageRating: 4.6,
      totalHoursLearned: 15420
    },
    userProgress: {
      2: {
        dailyStreak: 12,
        weeklyHours: 8.5,
        monthlyHours: 32.2,
        favoriteCategory: "Programação",
        learningGoal: 40, // horas por mês
        achievements: 15
      }
    },
    courseStats: {
      1: {
        enrollmentTrend: [45, 52, 48, 63, 71, 85, 92],
        completionByModule: [95, 78, 45],
        averageTimePerLesson: 18, // minutos
        dropoffPoints: [2, 8, 12] // lesson ids onde há mais desistência
      }
    }
  },

  notifications: [
    {
      id: 1,
      userId: 2,
      type: "achievement",
      title: "Novo badge desbloqueado!",
      message: "Você conquistou o badge 'Alto Desempenho' 🌟",
      timestamp: "2024-10-06T15:30:00Z",
      read: false,
      action: { type: "view-badge", badgeId: "high-performer" }
    },
    {
      id: 2,
      userId: 2,
      type: "course",
      title: "Nova aula disponível",
      message: "A aula 'Árvores Binárias' foi liberada no curso de Algoritmos",
      timestamp: "2024-10-06T09:15:00Z", 
      read: true,
      action: { type: "goto-lesson", lessonId: 8 }
    },
    {
      id: 3,
      userId: 1,
      type: "system",
      title: "Relatório semanal disponível",
      message: "Seu relatório de performance da turma já está pronto",
      timestamp: "2024-10-05T08:00:00Z",
      read: false,
      action: { type: "view-report", reportId: "week-40-2024" }
    }
  ],

  settings: {
    theme: "dark",
    language: "pt-BR",
    notifications: {
      email: true,
      push: true,
      achievements: true,
      courseUpdates: true,
      reminders: true
    },
    privacy: {
      profileVisibility: "public",
      progressSharing: true,
      analyticsTracking: true
    }
  }
};

// Inicialização dos dados
if (!localStorage.getItem('eduSupremeData')) {
  localStorage.setItem('eduSupremeData', JSON.stringify(seedData));
}
