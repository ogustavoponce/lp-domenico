const seedData = {
  users: [
    { id: 1, email: "prof@domenico.com", password: "12345", profile: "professor", name: "Prof. Domenico", avatar: "D" },
    { id: 2, email: "aluno@domenico.com", password: "12345", profile: "aluno", name: "Aluno Demo", avatar: "A" }
  ],
  turmas: [
    {
      id: 1, nome: "1º Ano A Português",
      professores: [1], alunos: [2],
      avisos: [
        {txt:"Bem-vindos ao novo Classroom!",user:"Prof. Domenico",ts:"Hoje"},
        {txt:"Prova sexta-feira!",user:"Prof. Domenico",ts:"Ontem"}
      ],
      arquivos: ["Material Gramática.pdf","Lista de Exercícios.docx"],
      atividades: [
        {id: 1, titulo:"Resenha sobre Machado", entrega:"2025-10-10", tipo:"texto", conteudo:"Faça uma resenha sobre um conto do Machado de Assis."},
        {id: 2, titulo:"Quiz de Pontuação", entrega:"2025-10-14", tipo:"quiz", conteudo:"Responda 10 perguntas objetivas de pontuação."}
      ],
      notas: [{atividadeId:2,alunoId:2,nota:8.7,feedback:"Muito bom!"}]
    }
  ]
};
if (!localStorage.getItem('domenicoClassroom')) {
  localStorage.setItem('domenicoClassroom', JSON.stringify(seedData));
}
