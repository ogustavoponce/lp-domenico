// Estrutura inicial do banco de dados simulado

window.NEXUS_DB_SEED = {
  users: [
    // Professores
    {
      id: 'u1', email: 'prof@nexus.com', password: 'profnexus', name: 'Prof. Ana Martins', role: 'professor'
    },
    // Alunos
    {
      id: 'u2', email: 'aluno@nexus.com', password: 'alunonexus', name: 'Lucas Soares', role: 'aluno'
    }
  ],
  turmas: [
    {
      id: 't1',
      name: 'Matemática 1',
      curso: 'Matemática',
      professorId: 'u1',
      alunos: ['u2'],
      modulos: [
        {
          id: 'm1', name: 'Módulo 1: Introdução',
          conteudos: [
            {
              id: 'c1',
              type: 'texto',
              titulo: 'Bem-vindo!',
              texto: 'Este é o primeiro módulo de introdução à Matemática.'
            },
            {
              id: 'c2',
              type: 'atividade',
              titulo: 'Exercícios de Introdução',
              descricao: 'Responder as questões da apostila.',
              dataEntrega: '2025-10-20'
            },
            {
              id: 'c3',
              type: 'link',
              titulo: 'Vídeo Aula',
              url: 'https://www.youtube.com/watch?v=nexus-math'
            }
          ]
        },
        {
          id: 'm2', name: 'Projeto Final',
          conteudos: []
        }
      ]
    }
  ],
  alunos: [
    { id: 'u2', name: 'Lucas Soares', email: 'aluno@nexus.com' }
  ],
  entregas: [
    {
      id: 'e1', turmaId: 't1', alunoId: 'u2', conteudoId: 'c2', status: 'Entregue', nota: 9.5
    }
  ]
};
