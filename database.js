window.NEXUS_DB_SEED = {
  users: [
    { id: 'u1', email: 'professor@domenico.com', password: 'senha123', name: 'Prof. Domenico', role: 'professor' }
  ],
  turmas: [
    {
      id: 't1',
      code: 'INF123',
      name: 'Informática',
      curso: 'Língua Portuguesa',
      professorId: 'u1',
      alunos: [],
      modulos: [
        {
          id: 'm1',
          name: 'Gramática Básica',
          conteudos: [
            {
              id: 'c1',
              type: 'texto',
              titulo: 'Artigo definido e indefinido',
              texto: 'O artigo definido ora, ora é usado para...'
            }
          ]
        }
      ],
      apostilas: [
        {
          id: 'a1',
          titulo: 'Introdução à Informática',
          descricao: 'Material básico dos primeiros conceitos.',
          url: 'https://exemplo.com/apostila-informatica.pdf'
        }
      ]
    },
    {
      id: 't2',
      code: 'JOG456',
      name: 'Jogos',
      curso: 'Língua Portuguesa',
      professorId: 'u1',
      alunos: [],
      modulos: [],
      apostilas: []
    },
    {
      id: 't3',
      code: 'MEC789',
      name: 'Mecânica',
      curso: 'Língua Portuguesa',
      professorId: 'u1',
      alunos: [],
      modulos: [],
      apostilas: []
    },
    {
      id: 't4',
      code: 'AUT321',
      name: 'Automação',
      curso: 'Língua Portuguesa',
      professorId: 'u1',
      alunos: [],
      modulos: [],
      apostilas: []
    }
  ],
  alunos: [
    // serão adicionados na inscrição
  ],
  entregas: [
    // Cada entrega: id, turmaId, alunoId, avaliação por conceitos e feedbacks
    // exemplo:
    /*
    {
      id: 'e1',
      turmaId: 't1',
      alunoId: 'u2',
      avaliacao: {
        redacao: { conceito: 'A', feedback: 'Ótima argumentação.' },
        lingua: { conceito: 'B', feedback: 'Atente-se às concordâncias.' },
        interpretacao: { conceito: 'A', feedback: 'Interpretação exemplar.' }
      }
    }
    */
  ]
};
