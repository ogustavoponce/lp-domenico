window.NEXUS_DB_SEED = {
  users: [
    { id: 'u1', email: 'professor@domenico.com', password: 'senha123', name: 'Prof. Domenico', role: 'professor' },
    { id: 'u2', email: 'aluno1@dominio.com', password: 'aluno123', name: 'Maria Silva', role: 'aluno' },
    { id: 'u3', email: 'aluno2@dominio.com', password: 'aluno123', name: 'João Souza', role: 'aluno' }
  ],
  turmas: [
    { id: 't1', code: 'INF123', name: 'Informática', curso: 'Língua Portuguesa', professorId: 'u1', alunos: ['u2', 'u3'], modulos: [], apostilas: [] },
    { id: 't2', code: 'JOG456', name: 'Jogos', curso: 'Língua Portuguesa', professorId: 'u1', alunos: ['u2'], modulos: [], apostilas: [] },
    { id: 't3', code: 'MEC789', name: 'Mecânica', curso: 'Língua Portuguesa', professorId: 'u1', alunos: ['u3'], modulos: [], apostilas: [] },
    { id: 't4', code: 'AUT321', name: 'Automação', curso: 'Língua Portuguesa', professorId: 'u1', alunos: [], modulos: [], apostilas: [] }
  ],
  alunos: [
    { id: 'u2', name: 'Maria Silva', email: 'aluno1@dominio.com' },
    { id: 'u3', name: 'João Souza', email: 'aluno2@dominio.com' }
  ],
  entregas: []
};
