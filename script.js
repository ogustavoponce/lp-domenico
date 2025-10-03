/* --- ARQUIVO: script.js (VERSÃO ROBUSTA E CORRIGIDA) --- */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SISTEMA DE DADOS E AUTENTICAÇÃO ---
    let db;

    function initDatabase() {
        const storedDb = localStorage.getItem('platformDb');
        db = storedDb ? JSON.parse(storedDb) : initialDatabase;
        localStorage.setItem('platformDb', JSON.stringify(db));
    }

    // AUTH GUARD: Protege as páginas internas
    function protectPage() {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const isLoginPage = document.body.classList.contains('login-page');

        if (!user && !isLoginPage) {
            window.location.href = 'login.html'; // Se não está logado e não está na pág. de login, expulsa.
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
                alert('E-mail não encontrado. Tente novamente.');
            }
        });
    }

    // --- 3. RENDERIZAÇÃO E LÓGICA DAS PÁGINAS ---
    function renderAdminDashboard(user) {
        document.getElementById('username').textContent = user.nome;
        const container = document.getElementById('turmas-container');
        if (!container) return;
        container.innerHTML = '';
        db.turmas.forEach(turma => {
            const card = document.createElement('a');
            card.href = `admin_turma.html?id=${turma.id}`;
            card.className = 'card card-hover';
            card.style.textDecoration = 'none';
            card.innerHTML = `
                <h3 style="color: var(--primary-blue);">${turma.nome}</h3>
                <p>Gerenciar mural, alunos e materiais.</p>
            `;
            container.appendChild(card);
        });
    }
    
    function renderAlunoDashboard(user){
        document.getElementById('username').textContent = user.nome;
        const turma = db.turmas.find(t => t.id === user.turmaId);
        if(!turma) return;
        
        const container = document.getElementById('aluno-turma-container');
        container.innerHTML = `
            <div class="turma-header-card">
                <h2>Você está na turma: ${turma.nome}</h2>
                <p>Acesse o mural para ver avisos e atividades, ou seus materiais de estudo.</p>
            </div>
        `;
    }

    // --- EXECUÇÃO PRINCIPAL ---
    initDatabase();
    const currentUser = protectPage();

    if (document.body.classList.contains('login-page')) {
        setupLoginForm();
    }
    
    if (currentUser) {
        // Lógica para páginas que precisam de um usuário logado
        if (document.body.id === 'admin-dashboard') {
            renderAdminDashboard(currentUser);
        }
        if (document.body.id === 'aluno-dashboard') {
            renderAlunoDashboard(currentUser);
        }
        // ... (Adicionar lógica para outras páginas aqui, se necessário)
    }
});