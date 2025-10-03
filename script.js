/* --- ARQUIVO: script.js (VERSÃO FINAL E CORRIGIDA) --- */
document.addEventListener('DOMContentLoaded', () => {
    let db;

    // --- 1. INICIALIZAÇÃO E AUTENTICAÇÃO ---
    function initDatabase() {
        const storedDb = localStorage.getItem('platformDb');
        db = storedDb ? JSON.parse(storedDb) : initialDatabase;
        localStorage.setItem('platformDb', JSON.stringify(db));
    }

    function protectPage() {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const isLoginPage = document.body.classList.contains('login-page');
        if (!user && !isLoginPage) {
            window.location.href = 'login.html';
        }
        return user;
    }

    // --- 2. LÓGICA DE LOGIN ---
    function setupLoginForm() {
        const form = document.getElementById('login-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            if (email === db.professor.email.toLowerCase()) {
                sessionStorage.setItem('loggedInUser', JSON.stringify({ type: 'professor', ...db.professor }));
                window.location.href = 'admin_dashboard.html';
                return;
            }
            const aluno = db.alunos.find(a => a.email.toLowerCase() === email);
            if (aluno) {
                sessionStorage.setItem('loggedInUser', JSON.stringify({ type: 'aluno', ...aluno }));
                window.location.href = 'aluno_dashboard.html';
            } else {
                alert('E-mail não encontrado.');
            }
        });
    }

    // --- 3. RENDERIZAÇÃO E LÓGICA DAS PÁGINAS ---
    function initPage() {
        initDatabase();
        const user = protectPage();
        if (!user) return; // Se não houver usuário, para a execução

        renderHeader(user); // Renderiza o cabeçalho dinâmico

        const pageId = document.body.id;
        switch (pageId) {
            case 'admin-dashboard': renderAdminDashboard(); break;
            case 'aluno-dashboard': renderAlunoDashboard(user); break;
            case 'aluno_materiais': renderAlunoMateriais(user); break; // ADICIONADO LÓGICA DA PÁGINA
        }
    }
    
    // --- 4. RENDERIZAÇÃO DE COMPONENTES DINÂMICOS ---
    function renderHeader(user) {
        const navContainer = document.getElementById('main-nav');
        if (!navContainer) return;
        
        // Links do menu agora são funcionais
        let navLinks = '';
        if (user.type === 'professor') {
            navLinks = `
                <a href="admin_dashboard.html" class="active">Turmas</a>
                <a href="#">Alunos</a>
                <a href="#">Atividades</a>
                <a href="login.html" class="logout-btn">Sair</a>
            `;
        } else { // Aluno
            navLinks = `
                <a href="aluno_dashboard.html">Minha Turma</a>
                <a href="aluno_materiais.html">Materiais e Apostilas</a>
                <a href="login.html" class="logout-btn">Sair</a>
            `;
        }
        navContainer.innerHTML = navLinks;
        
        // Adiciona a classe 'active' ao link da página atual
        const currentPage = window.location.pathname.split('/').pop();
        navContainer.querySelectorAll('a').forEach(link => {
            if(link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- 5. RENDERIZAÇÃO - PROFESSOR ---
    function renderAdminDashboard() {
        const container = document.getElementById('turmas-container');
        container.innerHTML = '';
        db.turmas.forEach(turma => {
            const card = document.createElement('a');
            card.href = "#"; // Futuramente levaria para a página da turma
            card.className = 'card card-hover';
            card.style.textDecoration = 'none';
            card.innerHTML = `<h3>${turma.nome}</h3><p>Gerenciar esta turma.</p>`;
            container.appendChild(card);
        });
    }
    
    // --- 6. RENDERIZAÇÃO - ALUNO ---
    function renderAlunoDashboard(user) {
        const usernameEl = document.getElementById('username');
        if (usernameEl) usernameEl.textContent = user.nome.split(' ')[0];

        const turma = db.turmas.find(t => t.id === user.turmaId);
        if(!turma) return;
        
        const container = document.getElementById('aluno-turma-container');
        container.innerHTML = `
            <div class="turma-header-card">
                <h2>Você está na turma: ${turma.nome}</h2>
                <p>Navegue pelo menu acima para acessar os materiais de estudo ou outras seções da sua turma.</p>
            </div>
        `;
    }
    
    function renderAlunoMateriais(user) {
        const container = document.getElementById('materiais-container');
        if (!container) return;
        
        container.innerHTML = '';
        const materiaisDaTurma = db.materiais.filter(m => m.turmaId === user.turmaId);

        if (materiaisDaTurma.length === 0) {
            container.innerHTML = "<p>Nenhum material de estudo foi disponibilizado para sua turma ainda.</p>";
            return;
        }

        materiaisDaTurma.forEach(material => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${material.nome}</h3>
                <p>Clique no botão abaixo para acessar o material.</p>
                <a href="${material.arquivo}" class="btn btn-primary" target="_blank" style="margin-top: 10px;">Acessar Material</a>
            `;
            container.appendChild(card);
        });
    }

    // --- INICIALIZAÇÃO ---
    if (document.body.classList.contains('login-page')) {
        initDatabase();
        setupLoginForm();
    } else {
        initPage();
    }
});