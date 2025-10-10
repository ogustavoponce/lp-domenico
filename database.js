// Estrutura inicial do banco de dados simulado focado em Língua Portuguesa Prof. Domenico

window.NEXUS_DB_SEED = {
  users: [
    {
      id: 'u1', email: 'professor@domenico.com', password: 'senha123', name: 'Prof. Domenico', role: 'professor'
    },
    {
      id: 'u2', email: 'aluno1@exemplo.com', password: 'aluno123', name: 'Maria Silva', role: 'aluno'
    },
    {
      id: 'u3', email: 'aluno2@exemplo.com', password: 'aluno123', name: 'João Souza', role: 'aluno'
    }
  ],
  turmas: [
    {
      id: 't1',
      name: 'Português Avançado',
      curso: 'Língua Portuguesa',
      professorId: 'u1',
      alunos: ['u2', 'u3'],
      modulos: [
        {
          id: 'm1', name: 'Módulo 1: Gramática Avançada',
          conteudos: [
            {
              id: 'c1',
              type: 'texto',
              titulo: 'Concordância Verbal',
              texto: 'A concordância verbal é o acordo do verbo com o sujeito da oração...'
            },
            {
              id: 'c2',
              type: 'atividade',
              titulo: 'Exercício de Concordância',
              descricao: 'Realize os exercícios 1 a 10 do caderno de atividades.',
              dataEntrega: '2025-11-15'
            },
            {
              id: 'c3',
              type: 'link',
              titulo: 'Vídeo: Concordância Verbal',
              url: 'https://www.youtube.com/watch?v=video-exemplo'
            }
          ]
        },
        {
          id: 'm2', name: 'Módulo 2: Redação e Produção Textual',
          conteudos: []
        }
      ]
    }
  ],
  alunos: [
    { id: 'u2', name: 'Maria Silva', email: 'aluno1@exemplo.com' },
    { id: 'u3', name: 'João Souza', email: 'aluno2@exemplo.com' }
  ],
  entregas: [
    {
      id: 'e1', turmaId: 't1', alunoId: 'u2', conteudoId: 'c2', status: 'Entregue', nota: 9.8
    }
  ]
};
