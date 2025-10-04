// database.js

function getInitialData() {
    return {
        // Usuários agora não precisam estar pré-associados a uma turma
        users: [
            { email: 'domenico@prof.com', password: '123', role: 'professor', name: 'Domenico' },
            { email: 'aluno1@ifpr.edu.br', password: '123', role: 'aluno', name: 'Gustavo Oliveira' },
            { email: 'aluno2@ifpr.edu.br', password: '123', role: 'aluno', name: 'Isadora Kamille' }
        ],
        turmas: [
            { id: 1, name: 'Informática 1', curso: 'Desenvolvimento de Sistemas', alunos: ['aluno1@ifpr.edu.br'] },
            { id: 2, name: 'Automação 1', curso: 'Automação Industrial', alunos: ['aluno2@ifpr.edu.br'] },
            { id: 3, name: 'Mecânica 1', curso: 'Mecânica Industrial', alunos: [] }
        ],
        // NOVO: Módulos para organizar o conteúdo das turmas
        modulos: [
            { id: 101, turmaId: 1, name: 'Módulo 1: Boas-vindas', order: 1 },
            { id: 102, turmaId: 1, name: 'Módulo 2: Lógica de Programação', order: 2 }
        ],
        // NOVO: Conteúdos unificados, ligados aos módulos
        conteudos: [
            { id: 1001, moduloId: 101, type: 'pagina', title: 'Bem-vindo à Disciplina!', content: 'Este é o espaço onde nossa jornada de aprendizado começará. Fique atento aos avisos e materiais.' },
            { id: 1002, moduloId: 102, type: 'atividade', title: 'Exercício de Pseudocódigo', description: 'Resolver a lista de exercícios sobre estruturas de repetição.', dueDate: '2025-10-20' },
            { id: 1003, moduloId: 102, type: 'link', title: 'Apostila de Algoritmos', url: '#' }
        ],
        // NOVO: Sistema de notas e entregas
        entregas: [
            { id: 1, alunoEmail: 'aluno1@ifpr.edu.br', conteudoId: 1002, status: 'Entregue', grade: 9.5 }
        ]
    };
}