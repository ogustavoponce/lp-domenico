window.NEXUS_DB_SEED = {
  users: [
    { id: 'u1', email: 'professor@domenico.com', password: 'senha123', name: 'Prof. Domenico', role: 'professor' },
    { id: 'u2', email: 'aluno1@dominio.com', password: 'aluno123', name: 'Maria Silva', role: 'aluno' },
    { id: 'u3', email: 'aluno2@dominio.com', password: 'aluno123', name: 'João Souza', role: 'aluno' }
  ],
  turmas: [
    {
      id: 't1',
      code: 'INF123',
      name: 'Informática',
      curso: 'Língua Portuguesa',
      professorId: 'u1',
      alunos: ['u2', 'u3'],
      modulos: [
        {
          id: 'm1',
          name: 'Gramática Avançada',
          conteudos: [
            {
              id: 'c1',
              type: 'texto',
              titulo: 'Artigo definido e indefinido',
              texto: 'O artigo definido é usado para...'
            },
            {
              id: 'c2',
              type: 'atividade',
              titulo: 'Exercício sobre artigos',
              descricao: 'Complete as frases',
              dataEntrega: '2025-11-01'
            }
          ]
        }
      ],
      apostilas: [
        {
          id: 'a1',
          titulo: 'Introdução à Informática',
          descricao: 'Material básico - capítulos 1 a 3',
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
      alunos: ['u2'],
      modulos: [],
      apostilas: []
    },
    {
      id: 't3',
      code: 'MEC789',
      name: 'Mecânica',
      curso: 'Língua Portuguesa',
      professorId: 'u1',
      alunos: ['u3'],
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
    { id: 'u2', name: 'Maria Silva', email: 'aluno1@dominio.com' },
    { id: 'u3', name: 'João Souza', email: 'aluno2@dominio.com' }
  ],
  entregas: [
    {
      id: 'e1',
      turmaId: 't1',
      alunoId: 'u2',
      avaliacao: {
        redacao: { conceito: 'A', feedback: 'Excelente coerência e argumentação.' },
        lingua: { conceito: 'B', feedback: 'Uso correto em grande parte. Atenção à concordância verbal.' },
        interpretacao: { conceito: 'A', feedback: 'Ótima interpretação do texto.' }
      }
    },
    {
      id: 'e2',
      turmaId: 't1',
      alunoId: 'u3',
      avaliacao: {
        redacao: { conceito: 'B', feedback: 'Bom, mas precisa trabalhar mais a conclusão.' },
        lingua: { conceito: 'C', feedback: 'Evitar erros de ortografia.' },
        interpretacao: { conceito: 'B', feedback: 'Boa compreensão geral.' }
      }
    }
  ]
};
