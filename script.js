/* --- ARQUIVO: script.js (VERSÃO FINAL COMPLETA) --- */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GERENCIAMENTO DE DADOS COM LOCALSTORAGE ---
    let db;

    function initDatabase() {
        const storedDb = localStorage.getItem('platformDb');
        if (storedDb) {
            db = JSON.parse(storedDb);
        } else {
            db = initialDatabase; // Do database.js
            saveDatabase();
        }
    }

    function saveDatabase() {
        localStorage.setItem('platformDb', JSON.stringify(db));
    }

    // --- 2. LÓGICA DE LOGIN E IDENTIFICAÇÃO DE USUÁRIO ---
    function setupLoginForm() {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            
            // Verifica se é o professor
            if (email.toLowerCase() === db.professor.email.toLowerCase()) {
                sessionStorage.setItem('loggedInUser', JSON.stringify({ type: 'professor', email: db.professor.email }));
                window.location.href = 'admin_dashboard.html';
                return;
            }

            // Verifica se é um aluno
            const aluno = db.alunos.find(a => a.email.toLowerCase() === email.toLowerCase());
            if (aluno) {
                sessionStorage.setItem('loggedInUser', JSON.stringify({ type: 'aluno', ...aluno }));
                window.location.href = 'aluno_dashboard.html';
            } else {
                alert('E-mail não encontrado. Verifique os dados ou contate o professor.');
            }
        });
    }
    
    // --- 3. ROTEAMENTO E RENDERIZAÇÃO DE PÁGINAS ---
    function handlePageLogic() {
        const pageId = document.body.id;
        if (!pageId) return;

        switch (pageId) {
            case 'page-login':
                setupLoginForm();
                break;
            case 'page-admin-dashboard':
                renderTurmasDashboard();
                break;
            case 'page-admin-turma':
                const urlParamsTurma = new URLSearchParams(window.location.search);
                const turmaIdTurma = parseInt(urlParamsTurma.get('id'));
                if (turmaIdTurma) renderPaginaTurmaAdmin(turmaIdTurma);
                break;
            case 'page-admin-alunos':
                renderAlunosAdmin();
                setupAlunoForm();
                break;
            case 'page-aluno-dashboard':
                renderAlunoDashboard();
                break;
            case 'page-aluno-materiais':
                 renderAlunoMateriais();
                 break;
        }
    }

    // --- 4. FUNÇÕES DE RENDERIZAÇÃO (PROFESSOR) ---
    function renderTurmasDashboard() {
        const container = document.getElementById('turmas-container');
        if (!container) return;
        container.innerHTML = '';
        db.turmas.forEach(turma => {
            const turmaCard = document.createElement('div');
            turmaCard.className = 'card class-card';
            turmaCard.innerHTML = `
                <a href="admin_turma.html?id=${turma.id}">
                    <h3>${turma.nome}</h3>
                    <p>Clique para gerenciar o mural, alunos e materiais.</p>
                </a>
            `;
            container.appendChild(turmaCard);
        });
    }

    function renderPaginaTurmaAdmin(turmaId) {
        const turma = db.turmas.find(t => t.id === turmaId);
        if (!turma) return;

        const headerContainer = document.getElementById('turma-header-container');
        headerContainer.innerHTML = `<div class="turma-header"><h1>${turma.nome}</h1></div>`;

        renderMural(turmaId, document.getElementById('mural-container'));
        renderAlunosNaTurma(turmaId, document.getElementById('lista-alunos-turma'));
        renderMateriaisNaTurma(turmaId, document.getElementById('lista-materiais-turma'));
        setupPostForm(turmaId);
    }
    
    function renderAlunosAdmin(){
        const tbody = document.getElementById('alunos-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        db.alunos.forEach(aluno => {
            const turma = db.turmas.find(t => t.id === aluno.turmaId) || {nome: 'Sem turma'};
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${turma.nome}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // --- 5. FUNÇÕES DE RENDERIZAÇÃO (ALUNO) ---
    function renderAlunoDashboard() {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!user || user.type !== 'aluno') { window.location.href = 'login.html'; return; }
        
        const turma = db.turmas.find(t => t.id === user.turmaId);
        if (!turma) { alert("Você não está matriculado em uma turma."); return; }
        
        document.getElementById('greeting').textContent = `Olá, ${user.nome.split(' ')[0]}!`;
        const container = document.getElementById('aluno-turma-card');
        container.innerHTML = `
            <div class="card class-card">
                <a href="aluno_mural.html">
                    <h3>Sua Turma: ${turma.nome}</h3>
                    <p>Clique aqui para ver o mural, atividades e materiais.</p>
                </a>
            </div>
        `;
    }

    function renderAlunoMateriais() {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!user || user.type !== 'aluno') { window.location.href = 'login.html'; return; }
        
        const turma = db.turmas.find(t => t.id === user.turmaId);
        document.getElementById('turma-nome').textContent = turma.nome;
        
        renderMateriaisNaTurma(user.turmaId, document.getElementById('materiais-container'));
    }

    // --- 6. FUNÇÕES DE RENDERIZAÇÃO (COMPARTILHADAS) ---
    function renderMural(turmaId, container) {
        if (!container) return;
        container.innerHTML = '';
        const postsDaTurma = db.mural.filter(p => p.turmaId === turmaId).reverse();
        
        if(postsDaTurma.length === 0){
            container.innerHTML = '<p>Nenhuma postagem no mural ainda.</p>';
            return;
        }

        postsDaTurma.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'card';
            postCard.innerHTML = `
                <h4>${post.tipo}: ${post.titulo}</h4>
                <p style="font-size: 0.8rem; color: var(--text-light);">Postado em: ${post.data}</p>
                <p>${post.conteudo}</p>
            `;
            container.appendChild(postCard);
        });
    }
    
    function renderAlunosNaTurma(turmaId, container) {
        if (!container) return;
        container.innerHTML = '';
        const alunosDaTurma = db.alunos.filter(a => a.turmaId === turmaId);
        alunosDaTurma.forEach(aluno => {
            const item = document.createElement('li');
            item.textContent = aluno.nome;
            item.style.padding = '5px 0';
            container.appendChild(item);
        });
    }
    
    function renderMateriaisNaTurma(turmaId, container) {
        if (!container) return;
        container.innerHTML = '';
        const materiaisDaTurma = db.materiais.filter(m => m.turmaId === turmaId);
        materiaisDaTurma.forEach(material => {
            const item = document.createElement('div');
            item.className = 'card';
            item.innerHTML = `
                <h3>${material.nome}</h3>
                <a href="${material.arquivo}" class="btn btn-primary" target="_blank">Acessar Material</a>
            `;
            container.appendChild(item);
        });
    }

    // --- 7. SETUP DE FORMULÁRIOS E EVENTOS ---
    function setupPostForm(turmaId) {
        const form = document.getElementById('novo-post-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const novoPost = {
                id: Date.now(),
                turmaId: turmaId,
                tipo: document.getElementById('post-tipo').value,
                titulo: document.getElementById('post-titulo').value,
                conteudo: document.getElementById('post-conteudo').value,
                data: new Date().toLocaleDateString('pt-BR')
            };
            db.mural.push(novoPost);
            saveDatabase();
            renderMural(turmaId, document.getElementById('mural-container'));
            form.reset();
        });
    }

    function setupAlunoForm() {
        const form = document.getElementById('novo-aluno-form');
        const modal = document.getElementById('add-aluno-modal');
        const openBtn = document.getElementById('open-modal-btn');
        const closeBtn = document.querySelector('.close-btn');

        // Preenche o select de turmas
        const selectTurma = document.getElementById('aluno-turma');
        db.turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            selectTurma.appendChild(option);
        });
        
        openBtn.onclick = () => modal.style.display = "flex";
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const novoAluno = {
                id: Date.now(),
                nome: document.getElementById('aluno-nome').value,
                email: document.getElementById('aluno-email').value,
                turmaId: parseInt(document.getElementById('aluno-turma').value)
            };
            db.alunos.push(novoAluno);
            saveDatabase();
            renderAlunosAdmin();
            modal.style.display = "none";
            form.reset();
        });
    }

    // --- INICIALIZAÇÃO ---
    initDatabase();
    handlePageLogic();
});