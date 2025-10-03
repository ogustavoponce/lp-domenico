/* --- ARQUIVO: database.js --- */
const initialDatabase = {
  professor: { nome: "Domenico", email: "domenico@prof.com" },
  turmas: [
    { id: 1, nome: "Informática 1" }, { id: 2, nome: "Automação 1" },
    { id: 3, nome: "Mecânica 1" }, { id: 4, nome: "Jogos 1" },
  ],
  alunos: [
    { id: 101, nome: "Alissa Gabriele", email: "alissa@aluno.com", turmaId: 1 },
    { id: 102, nome: "Gustavo Ponce", email: "gustavo@aluno.com", turmaId: 1 },
    { id: 103, nome: "André Chepak", email: "andre@aluno.com", turmaId: 2 },
  ],
  atividades: [
    { id: 201, turmaId: 1, titulo: "Atividade 01: Algoritmos", dataEntrega: "2025-10-10", descricao: "Desenvolver um algoritmo para calcular a média de 3 notas." },
    { id: 202, turmaId: 1, titulo: "Atividade 02: HTML Básico", dataEntrega: "2025-10-17", descricao: "Criar uma página HTML semântica com uma biografia pessoal." },
  ],
  materiais: [
    { id: 301, turmaId: 1, nome: "Apostila de Informática 1", arquivo: "#" },
    { id: 302, turmaId: 2, nome: "Apostila de Automação 1", arquivo: "#" },
  ]
};