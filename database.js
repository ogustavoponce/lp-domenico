const seedData = {
  users: [
    { id: 1, email: "prof@suprema.com", password: "prof2025", profile: "professor", name: "Prof. Suprema", avatar: "prof.png" },
    { id: 2, email: "aluno@suprema.com", password: "aluno2025", profile: "aluno", name: "Ana Premium", avatar: "ana.png" }
  ],
  turmas: [
    { id: 1, name: "Turma Expert", curso: "Algoritmos Avançados", professores: [1], alunos: [2], modulos: [1, 2], badge: "Crown", analytics: { entregas: 83, quarentena: 2 } }
  ],
  modulos: [
    { id: 1, turmaId: 1, title: "Onboarding Premium", conteudos: [1, 2] },
    { id: 2, turmaId: 1, title: "Gamificação Suprema", conteudos: [3] }
  ],
  conteudos: [
    { id: 1, moduloId: 1, type: "texto", title: "Bem-vindo!", body: "Aqui começa sua jornada suprema no mundo dos algoritmos." },
    { id: 2, moduloId: 1, type: "atividade", title: "Primeira Missão", description: "Resolva 5 problemas de lógica.", dataEntrega: "2025-10-21" },
    { id: 3, moduloId: 2, type: "badge", title: "Desbloqueou a 'Crown': 50 pontos!", badge: "Crown", points: 50 }
  ],
  entregas: [
    { conteudoId: 2, alunoId: 2, entregue: true, nota: 9.8, timestamp: "2025-10-01T14:23" }
  ],
  badges: [
    { id: "Crown", label: "Suprema Crown", description: "Exclusivo para quem supera a elite!", color: "#d8b900" }
  ],
  analytics: {
    global: { totalAlunos: 425, totalTurmas: 18, taxaConclusao: 87, taxaEngajamento: 91 }
  }
};

if (!localStorage.getItem('eduSupremeData')) {
  localStorage.setItem('eduSupremeData', JSON.stringify(seedData));
}
