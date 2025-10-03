/* --- ARQUIVO: database.js --- */
// Dados iniciais para popular a plataforma caso o localStorage esteja vazio.

const initialDatabase = {
  // O professor/admin principal
  professor: {
    nome: "Domenico",
    email: "domenico@prof.com"
  },

  // As turmas que o professor leciona
  turmas: [
    { id: 1, nome: "Informática 1", ano: 1, banner: "images/banner_info.jpg" },
    { id: 2, nome: "Automação 1", ano: 1, banner: "images/banner_automacao.jpg" },
    { id: 3, nome: "Mecânica 1", ano: 1, banner: "images/banner_mecanica.jpg" },
    { id: 4, nome: "Jogos 1", ano: 1, banner: "images/banner_jogos.jpg" },
  ],

  // Lista de alunos (exemplo)
  alunos: [
    { id: 101, nome: "Alissa Gabriele", email: "alissa.g@aluno.com", turmaId: 1 },
    { id: 102, nome: "Gustavo Ponce", email: "gustavo.p@aluno.com", turmaId: 1 },
    { id: 103, nome: "André Chepak", email: "andre.c@aluno.com", turmaId: 2 },
  ],

  // Posts no mural das turmas
  mural: [
    { id: 201, turmaId: 1, tipo: "Aviso", titulo: "Boas-vindas à turma!", conteudo: "Olá, pessoal! Sejam bem-vindos ao curso de Informática 1. O cronograma já está disponível na seção de Materiais.", data: "01/10/2025" },
    { id: 202, turmaId: 1, tipo: "Atividade", titulo: "Atividade 01: Lógica de Programação", conteudo: "A primeira atividade avaliativa está postada. A entrega é até a próxima sexta-feira.", data: "03/10/2025" },
    { id: 203, turmaId: 2, tipo: "Aviso", titulo: "Aviso sobre o laboratório", conteudo: "A aula de amanhã será no Laboratório B. Não se esqueçam dos EPIs.", data: "02/10/2025" },
  ],
  
  // Materiais de apoio
  materiais: [
      { id: 301, turmaId: 1, nome: "Apostila de Informática 1", arquivo: "apostilas/informatica_1.pdf" },
      { id: 302, turmaId: 2, nome: "Apostila de Automação 1", arquivo: "apostilas/automacao_1.pdf" },
      { id: 303, turmaId: 3, nome: "Apostila de Mecânica 1", arquivo: "apostilas/mecanica_1.pdf" },
      { id: 404, turmaId: 4, nome: "Apostila de Jogos 1", arquivo: "apostilas/jogos_1.pdf" }
  ]
};