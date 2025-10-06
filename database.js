const seedData = {
  users: [
    { id: 1, email: "prof@domenico.com", password: "12345", profile: "professor", name: "Domenico Sturiale" },
    { id: 2, email: "aluno@domenico.com", password: "12345", profile: "aluno", name: "Aluno Demo" }
  ],
  turmas: [
    { id: 1, nome: "1º Ano A", professores: [1], alunos: [2], avisos: ["Bem-vindos!", "Prova de Português na sexta-feira"], atividades: [1,2], notas: [] }
  ],
  atividades: [
    { id: 1, turmaId: 1, titulo: "Resenha", tipo: "texto", entrega: "2025-10-10", conteudo: "Faça uma resenha do capítulo lido." },
    { id: 2, turmaId: 1, titulo: "Quiz de Pontuação", tipo: "quiz", entrega: "2025-10-14", conteudo: "Quiz de pontuação básica." }
  ],
  notas: [
    { atividadeId: 2, alunoId: 2, nota: 9.5 }
  ]
};

if (!localStorage.getItem('domenicoData')) {
  localStorage.setItem('domenicoData', JSON.stringify(seedData));
}
