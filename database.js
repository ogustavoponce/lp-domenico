window.NEXUS_DB_SEED = {
  users: [
    { id: 'u1', email: 'professor@domenico.com', password: 'senha123', name: 'Prof. Domenico', role: 'professor' },
    { id: 'u2', email: 'aluno1@dominio.com', password: 'aluno123', name: 'Maria Silva', role: 'aluno' },
    { id: 'u3', email: 'aluno2@dominio.com', password: 'aluno123', name: 'João Souza', role: 'aluno' }
  ],
  turmas: [
    // Exemplo para as 4 turmas, todas já com apostilas incluíveis
    {
      id: 't1', name: 'Informática', curso: 'Língua Portuguesa', professorId: 'u1', alunos: ['u2', 'u3'], modulos: [],
      apostilas: [
        { id: 'a1', titulo: 'Apostila de Informática', descricao: 'Conteúdo turma Informática', url: 'https://exemplo.com/inf-apostila.pdf' }
      ]
    },
    { id: 't2', name: 'Jogos', curso: 'Língua Portuguesa', professorId: 'u1', alunos: ['u2'], modulos: [], apostilas: [] },
    { id: 't3', name: 'Mecânica', curso: 'Língua Portuguesa', professorId: 'u1', alunos: ['u3'], modulos: [], apostilas: [] },
    { id: 't4', name: 'Automação', curso: 'Língua Portuguesa', professorId: 'u1', alunos: [], modulos: [], apostilas: [] }
  ],
  alunos: [
    { id: 'u2', name: 'Maria Silva', email: 'aluno1@dominio.com' },
    { id: 'u3', name: 'João Souza', email: 'aluno2@dominio.com' }
  ],
  entregas: [
    {
      id: 'e1', turmaId: 't1', alunoId: 'u2',
      avaliacao: {
        redacao: { conceito: 'A', feedback: 'Excelente!' },
        lingua: { conceito: 'B', feedback: 'Ótima evolução.' },
        interpretacao: { conceito: 'A', feedback: 'Acertou tudo.' }
      }
    },
    {
      id: 'e2', turmaId: 't1', alunoId: 'u3',
      avaliacao: {
        redacao: { conceito: 'B', feedback: 'Boa argumentação.' },
        lingua: { conceito: 'C', feedback: 'Atenção ao uso dos tempos verbais.' },
        interpretacao: { conceito: 'B', feedback: 'Leitura razoável.' }
      }
    }
  ]
};
