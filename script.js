/* --- ARQUIVO: script.js (REFEITO DO ZERO) --- */
document.addEventListener('DOMContentLoaded', () => {
    let db;

    // --- 1. FUNÇÕES GERAIS E AUTENTICAÇÃO ---
    function initDatabase() {
        db = JSON.parse(localStorage.getItem('platformDb')) || initialDatabase;
        localStorage.setItem('platformDb', JSON.stringify(db));
    }

    function protectPage() {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!user && !document.body.classList.contains('login-page')) {
            window.location.href = 'login.html';
        }
        return user;
    }

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

    function setupModal(modalId, openBtnId) {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);
        const closeBtn = modal.querySelector('.close-btn');
        openBtn.onclick = () => modal.style.display = "flex";
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
    }

    // --- 2. LÓGICA DAS PÁGINAS DO PROFESSOR (ADMIN) ---
    function initAdminPages(user) {
        document.getElementById('username').textContent = user.nome;
        const pageId = document.body.id;
        if (pageId === 'admin-dashboard') renderAdminDashboard();
        if (pageId === 'admin-alunos') { renderAdminAlunos(); setupAlunoModal(); }
        if (pageId === 'admin-atividades') { renderAdminAtividades(); setupAtividadeModal(); }
    }

    function renderAdminDashboard() {
        const container = document.getElementById('turmas-grid');
        container.innerHTML = '';
        db.turmas.forEach(turma => {
            container.innerHTML += `<div class="card card-hover"><h3>${turma.nome}</h3></div>`;
        });
    }
    
    function renderAdminAlunos() {
        const tbody = document.getElementById('alunos-table-body');
        tbody.innerHTML = '';
        db.alunos.forEach(aluno => {
            const turma = db.turmas.find(t => t.id === aluno.turmaId) || {nome: 'N/A'};
            tbody.innerHTML += `<tr><td>${aluno.id}</td><td>${aluno.nome}</td><td>${aluno.email}</td><td>${turma.nome}</td></tr>`;
        });
    }

    function renderAdminAtividades() {
        const container = document.getElementById('atividades-container');
        container.innerHTML = '';
        db.atividades.forEach(ativ => {
            const turma = db.turmas.find(t => t.id === ativ.turmaId);
            container.innerHTML += `<div class="card"><h4>${ativ.titulo} (Turma: ${turma.nome})</h4><p>${ativ.descricao}</p><small>Entrega: ${ativ.dataEntrega}</small></div>`;
        });
    }

    function setupAlunoModal() {
        setupModal('add-aluno-modal', 'add-aluno-btn');
        const form = document.getElementById('add-aluno-form');
        const selectTurma = document.getElementById('aluno-turma');
        db.turmas.forEach(turma => {
            selectTurma.innerHTML += `<option value="${turma.id}">${turma.nome}</option>`;
        });
        form.onsubmit = (e) => {
            e.preventDefault();
            db.alunos.push({
                id: Date.now(),
                nome: document.getElementById('aluno-nome').value,
                email: document.getElementById('aluno-email').value,
                turmaId: parseInt(document.getElementById('aluno-turma').value)
            });
            localStorage.setItem('platformDb', JSON.stringify(db));
            renderAdminAlunos();
            document.getElementById('add-aluno-modal').style.display = "none";
            form.reset();
        };
    }

    function setupAtividadeModal() {
        setupModal('add-atividade-modal', 'add-atividade-btn');
        const form = document.getElementById('add-atividade-form');
        const selectTurma = document.getElementById('atividade-turma');
        db.turmas.forEach(turma => {
            selectTurma.innerHTML += `<option value="${turma.id}">${turma.nome}</option>`;
        });
        form.onsubmit = (e) => {
            e.preventDefault();
            db.atividades.push({
                id: Date.now(),
                turmaId: parseInt(document.getElementById('atividade-turma').value),
                titulo: document.getElementById('atividade-titulo').value,
                descricao: document.getElementById('atividade-descricao').value,
                dataEntrega: document.getElementById('atividade-data').value
            });
            localStorage.setItem('platformDb', JSON.stringify(db));
            renderAdminAtividades();
            document.getElementById('add-atividade-modal').style.display = "none";
            form.reset();
        };
    }

    // --- 3. LÓGICA DAS PÁGINAS DO ALUNO ---
    function initAlunoPages(user) {
        document.getElementById('username').textContent = user.nome.split(' ')[0];
        const pageId = document.body.id;
        if (pageId === 'aluno-dashboard') renderAlunoDashboard(user);
        if (pageId === 'aluno-atividades') renderAlunoAtividades(user);
        if (pageId === 'aluno-materiais') renderAlunoMateriais(user);
    }
    
    function renderAlunoDashboard(user) {
        const turma = db.turmas.find(t => t.id === user.turmaId);
        document.getElementById('turma-nome').textContent = turma.nome;
    }

    function renderAlunoAtividades(user) {
        const container = document.getElementById('atividades-container');
        container.innerHTML = '';
        const atividades = db.atividades.filter(a => a.turmaId === user.turmaId);
        atividades.forEach(ativ => {
            container.innerHTML += `<div class="card"><h4>${ativ.titulo}</h4><p>${ativ.descricao}</p><small>Data de Entrega: ${ativ.dataEntrega}</small></div>`;
        });
    }

    function renderAlunoMateriais(user) {
        const container = document.getElementById('materiais-container');
        container.innerHTML = '';
        const materiais = db.materiais.filter(m => m.turmaId === user.turmaId);
        materiais.forEach(material => {
            container.innerHTML += `<div class="card card-hover"><a href="${material.arquivo}" target="_blank" style="text-decoration:none; color:inherit;"><h3>${material.nome}</h3><p>Clique para acessar o material.</p></a></div>`;
        });
    }

    // --- INICIALIZAÇÃO GERAL ---
    if (document.body.classList.contains('login-page')) {
        initDatabase();
        setupLoginForm();
    } else {
        const currentUser = protectPage();
        if (currentUser) {
            initDatabase();
            if (currentUser.type === 'professor') initAdminPages(currentUser);
            if (currentUser.type === 'aluno') initAlunoPages(currentUser);
        }
    }
});