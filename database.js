const seedData = {
  users: [
    {
      id: 1,
      email: "prof@domenico.com",
      password: "12345",
      profile: "professor",
      name: "Prof. Domenico Sturiale",
      avatar: "D",
      bio: "Professor de Português e Literatura"
    },
    {
      id: 2,
      email: "aluno@domenico.com",
      password: "12345",
      profile: "aluno",
      name: "Maria Silva",
      avatar: "M",
      turmas: [1]
    },
    {
      id: 3,
      email: "joao@domenico.com",
      password: "12345",
      profile: "aluno",
      name: "João Santos",
      avatar: "J",
      turmas: [1]
    }
  ],
  
  turmas: [
    {
      id: 1,
      nome: "1º Ano A - Português",
      descricao: "Turma de Língua Portuguesa e Literatura",
      professor: 1,
      alunos: [2, 3],
      cor: "#1976d2",
      codigo: "PTG1A2025",
      ativa: true,
      criadaEm: "2025-02-01"
    },
    {
      id: 2,
      nome: "2º Ano B - Literatura",
      descricao: "Turma avançada de Literatura Brasileira",
      professor: 1,
      alunos: [2],
      cor: "#388e3c",
      codigo: "LIT2B2025",
      ativa: true,
      criadaEm: "2025-02-01"
    }
  ],
  
  avisos: [
    {
      id: 1,
      turmaId: 1,
      autorId: 1,
      titulo: "Bem-vindos ao semestre!",
      conteudo: "Pessoal, sejam bem-vindos ao novo semestre! Vamos ter um ano incrível de aprendizado juntos.",
      criadoEm: "2025-10-01T08:00:00Z",
      fixado: true
    },
    {
      id: 2,
      turmaId: 1,
      autorId: 1,
      titulo: "Prova na próxima semana",
      conteudo: "Lembrete: nossa primeira avaliação será na próxima sexta-feira (11/10). Estudem os capítulos 1 a 3 do livro.",
      criadoEm: "2025-10-05T14:30:00Z",
      fixado: false
    }
  ],
  
  atividades: [
    {
      id: 1,
      turmaId: 1,
      professorId: 1,
      titulo: "Resenha - Dom Casmurro",
      descricao: "Elabore uma resenha crítica do romance Dom Casmurro, de Machado de Assis, com no mínimo 2 páginas.",
      tipo: "individual",
      dataEntrega: "2025-10-15T23:59:00Z",
      pontos: 10,
      anexos: ["domcasmurro_guia.pdf"],
      criadaEm: "2025-10-01T10:00:00Z",
      status: "ativa"
    },
    {
      id: 2,
      turmaId: 1,
      professorId: 1,
      titulo: "Análise Poética",
      descricao: "Escolha um poema de Carlos Drummond de Andrade e faça uma análise completa dos aspectos formais e temáticos.",
      tipo: "individual",
      dataEntrega: "2025-10-20T23:59:00Z",
      pontos: 8,
      anexos: [],
      criadaEm: "2025-10-03T15:20:00Z",
      status: "ativa"
    }
  ],
  
  entregas: [
    {
      id: 1,
      atividadeId: 1,
      alunoId: 2,
      anexos: ["maria_resenha.pdf"],
      comentario: "Segue minha resenha conforme solicitado.",
      entregueEm: "2025-10-14T20:15:00Z",
      nota: 9.5,
      feedback: "Excelente análise! Parabéns pelo trabalho.",
      corrigidaEm: "2025-10-16T09:30:00Z"
    }
  ],
  
  arquivos: [
    {
      id: 1,
      turmaId: 1,
      nome: "Cronograma do Semestre",
      descricao: "Cronograma com todas as atividades e avaliações",
      arquivo: "cronograma_2025.pdf",
      tamanho: "245 KB",
      uploadEm: "2025-10-01T09:00:00Z",
      autorId: 1
    },
    {
      id: 2,
      turmaId: 1,
      nome: "Lista de Leituras Obrigatórias",
      descricao: "Livros que serão trabalhados durante o semestre",
      arquivo: "leituras_obrigatorias.pdf",
      tamanho: "180 KB",
      uploadEm: "2025-10-01T09:15:00Z",
      autorId: 1
    }
  ]
};

// Força inicialização para desenvolvimento
localStorage.setItem('domenicoClassroom', JSON.stringify(seedData));

// Verificação normal para produção
if (!localStorage.getItem('domenicoClassroom')) {
  localStorage.setItem('domenicoClassroom', JSON.stringify(seedData));
}
