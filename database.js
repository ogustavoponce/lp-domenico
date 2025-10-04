// database.js

function getInitialData() {
    return {
        users: [
            {
                email: 'domenico@prof.com',
                password: '123',
                role: 'professor',
                name: 'Domenico'
            },
            {
                email: 'aluno1@ifpr.edu.br',
                password: '123',
                role: 'aluno',
                name: 'Gustavo Oliveira',
                turmaId: 1
            },
            {
                email: 'aluno2@ifpr.edu.br',
                password: '123',
                role: 'aluno',
                name: 'Isadora Kamille',
                turmaId: 2
            }
        ],
        turmas: [
            {
                id: 1,
                name: 'Informática 1',
                curso: 'Desenvolvimento de Sistemas'
            },
            {
                id: 2,
                name: 'Automação 1',
                curso: 'Automação Industrial'
            },
            {
                id: 3,
                name: 'Mecânica 1',
                curso: 'Mecânica Industrial'
            },
            {
                id: 4,
                name: 'Jogos 1',
                curso: 'Jogos Digitais'
            }
        ],
        mural: [
            {
                id: 1,
                turmaId: 1,
                author: 'Domenico',
                content: 'Sejam bem-vindos à disciplina de Algoritmos! A primeira aula será na próxima segunda-feira.',
                timestamp: new Date().toISOString()
            }
        ],
        atividades: [
            {
                id: 1,
                turmaId: 1,
                title: 'Lógica de Programação - Exercício 1',
                description: 'Resolver os 10 primeiros exercícios da lista em anexo sobre pseudocódigo.',
                dueDate: '2025-10-15'
            }
        ],
        materiais: [
            {
                id: 1,
                turmaId: 1,
                title: 'Apostila Completa de Algoritmos',
                description: 'Material em PDF com todo o conteúdo da disciplina.',
                url: '#' // Link para o PDF
            }
        ]
    };
}