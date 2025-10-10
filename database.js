window.NEXUS_DB_SEED = {
  users: [
    { id: 'u1', email: 'professor@domenico.com', password: 'senha123', name: 'Prof. Domenico', role: 'professor' }
  ],
  turmas: [
    { id: 't1', code: 'INF123', name: 'Informática', curso: 'Língua Portuguesa', professorId: 'u1', alunos: [], modulos: [], apostilas: [] },
    { id: 't2', code: 'JOG456', name: 'Jogos', curso: 'Língua Portuguesa', professorId: 'u1', alunos: [], modulos: [], apostilas: [] },
    { id: 't3', code: 'MEC789', name: 'Mecânica', curso: 'Língua Portuguesa', professorId: 'u1', alunos: [], modulos: [], apostilas: [] },
    { id: 't4', code: 'AUT321', name: 'Automação', curso: 'Língua Portuguesa', professorId: 'u1', alunos: [], modulos: [], apostilas: [] }
  ],
  alunos: [],
  entregas: []
};
