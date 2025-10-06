const profTurmas = [
  { id: 1, nome: "Automação - Língua Portuguesa I", cor: "#2563eb" },
  { id: 2, nome: "Mecânica - Língua Portuguesa I", cor: "#38bdf8" },
  { id: 3, nome: "Jogos - Língua Portuguesa I", cor: "#06b6d4" },
  { id: 4, nome: "Informática - Língua Portuguesa I", cor: "#3b82f6" }
];
const seedData = {
  users: [
    { id: 1, email: "prof@domenico.com", password: "12345", profile: "professor", name: "Prof. Domenico", avatar: "D" },
    { id: 2, email: "ana@ifpr.edu.br", password: "12345", profile: "aluno", name: "Ana Demo", avatar: "A", turmaId: 1 },
    { id: 3, email: "fabio@ifpr.edu.br", password: "12345", profile: "aluno", name: "Fábio Lemos", avatar: "F", turmaId: 2 }
  ],
  turmas: profTurmas,
  mural: [
    { turmaId: 1, autor: "Prof. Domenico", msg: "Bem-vindos à Automação!", ts: "Hoje" },
    { turmaId: 2, autor: "Prof. Domenico", msg: "Bem-vindos à Mecânica!", ts: "Hoje" }
  ],
  atividades: [
    { id: 1, turmaId: 1, titulo: "Resenha", entrega: "2025-10-15", descricao: "Faça uma resenha crítica.", tipo: "texto" }
  ],
  arquivos: [
    { turmaId: 1, nome: "Material Inicial.pdf" }
  ]
};
localStorage.setItem('domenicoClassroom', JSON.stringify(seedData));
