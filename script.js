// script.js

// Classe principal da aplicação
class App {
    constructor() {
        // Inicializa o banco de dados no localStorage se não existir
        if (!localStorage.getItem('platformDB')) {
            localStorage.setItem('platformDB', JSON.stringify(getInitialData()));
        }
        this.db = JSON.parse(localStorage.getItem('platformDB'));
        this.currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        // Adiciona listeners de eventos globais
        document.addEventListener('DOMContentLoaded', () => {
            this.route(); // Roteia a página com base na URL
            this.setupGlobalUI();
        });
    }

    // Atualiza o banco de dados no localStorage
    updateDB() {
        localStorage.setItem('platformDB', JSON.stringify(this.db));
    }

    // Lida com a lógica de roteamento
    route() {
        const path = window.location.pathname.split('/').pop();
        
        // Protege rotas que exigem login
        const protectedRoutes = ['admin_dashboard.html', 'aluno_dashboard.html', 'turma.html'];
        if (protectedRoutes.includes(path) && !this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        switch (path) {
            case 'login.html':
            case '':
                this.initLoginPage();
                break;
            case 'admin_dashboard.html':
                this.initAdminDashboard();
                break;
            case 'aluno_dashboard.html':
                this.initAlunoDashboard();
                break;
            case 'turma.html':
                this.initTurmaPage();
                break;
        }
    }
    
    // Configura elementos de UI globais (header, botão de logout)
    setupGlobalUI() {
        if (!this.currentUser) return;

        const userNameEl = document.getElementById('user-name');
        const logoutBtn = document.getElementById('logout-btn');
        const dashboardLink = document.getElementById('dashboard-link');

        if (userNameEl) userNameEl.textContent = `Olá, ${this.currentUser.name}`;
        if (logoutBtn) logoutBtn.addEventListener('click', this.logout);
        
        if(dashboardLink) {
            dashboardLink.href = this.currentUser.role === 'professor' ? 'admin_dashboard.html' : 'aluno_dashboard.html';
        }
    }

    // Logout
    logout() {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }

    // --- Páginas Específicas ---

    // Página de Login
    initLoginPage() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const errorEl = document.getElementById('login-error');

                const user = this.db.users.find(u => u.email === email && u.password === password);

                if (user) {
                    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                    if (user.role === 'professor') {
                        window.location.href = 'admin_dashboard.html';
                    } else {
                        window.location.href = 'aluno_dashboard.html';
                    }
                } else {
                    errorEl.style.display = 'block';
                }
            });
        }
    }
    
    // Dashboard do Professor
    initAdminDashboard() {
        const grid = document.getElementById('turmas-grid');
        grid.innerHTML = '';
        this.db.turmas.forEach(turma => {
            const card = document.createElement('a');
            card.href = `turma.html?id=${turma.id}`;
            card.className = 'turma-card card';
            card.innerHTML = `
                <h3>${turma.name}</h3>
                <p>${turma.curso}</p>
            `;
            grid.appendChild(card);
        });
    }

    // Dashboard do Aluno
    initAlunoDashboard() {
        const grid = document.getElementById('turmas-grid');
        const alunoTurma = this.db.turmas.find(t => t.id === this.currentUser.turmaId);
        grid.innerHTML = '';
        if (alunoTurma) {
            const card = document.createElement('a');
            card.href = `turma.html?id=${alunoTurma.id}`;
            card.className = 'turma-card card';
            card.innerHTML = `
                <h3>${alunoTurma.name}</h3>
                <p>${alunoTurma.curso}</p>
            `;
            grid.appendChild(card);
        }
    }
    
    // Página da Turma
    initTurmaPage() {
        // Obter ID da turma da URL
        const urlParams = new URLSearchParams(window.location.search);
        const turmaId = parseInt(urlParams.get('id'));
        if (!turmaId) {
            window.location.href = this.currentUser.role === 'professor' ? 'admin_dashboard.html' : 'aluno_dashboard.html';
            return;
        }
        
        const turma = this.db.turmas.find(t => t.id === turmaId);
        
        // Preencher informações da turma
        document.getElementById('turma-name').textContent = turma.name;
        document.getElementById('turma-curso').textContent = turma.curso;

        // Configurar abas
        const tabs = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Desativa todas
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Ativa a clicada
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });

        // Esconder aba "Alunos" para alunos
        if(this.currentUser.role === 'aluno'){
            document.getElementById('tab-alunos').style.display = 'none';
        }

        // Renderizar conteúdo inicial (Mural)
        this.renderMural(turmaId);
        this.renderAtividades(turmaId);
        this.renderMateriais(turmaId);
        this.renderAlunos(turmaId);

        // Configurar FAB para professor
        if (this.currentUser.role === 'professor') {
            const fab = document.getElementById('fab-add');
            fab.style.display = 'flex';
            fab.addEventListener('click', () => this.openModal(turmaId));
        }
        
        // Fechar modal
        document.getElementById('modal-close').addEventListener('click', this.closeModal);
        document.getElementById('modal').addEventListener('click', (e) => {
            if(e.target.id === 'modal') this.closeModal();
        });
    }

    // --- Funções de Renderização de Conteúdo da Turma ---

    renderMural(turmaId) {
        const container = document.getElementById('mural');
        container.innerHTML = '';
        const items = this.db.mural.filter(item => item.turmaId === turmaId).reverse();
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <p>${item.content}</p>
                <small class="text-secondary">Postado por ${item.author} em ${new Date(item.timestamp).toLocaleDateString()}</small>
                ${this.currentUser.role === 'professor' ? `
                <div class="item-actions">
                    <button onclick="app.deleteItem('mural', ${item.id}, ${turmaId})">&times;</button>
                </div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }

    renderAtividades(turmaId) {
        const container = document.getElementById('atividades');
        container.innerHTML = '';
        const items = this.db.atividades.filter(item => item.turmaId === turmaId);
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <small class="text-secondary">Data de entrega: ${new Date(item.dueDate).toLocaleDateString()}</small>
                 ${this.currentUser.role === 'professor' ? `
                <div class="item-actions">
                    <button onclick="app.deleteItem('atividades', ${item.id}, ${turmaId})">&times;</button>
                </div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }

    renderMateriais(turmaId) {
        const container = document.getElementById('materiais');
        container.innerHTML = '';
        const items = this.db.materiais.filter(item => item.turmaId === turmaId);
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4><a href="${item.url}" target="_blank">${item.title}</a></h4>
                <p>${item.description}</p>
                 ${this.currentUser.role === 'professor' ? `
                <div class="item-actions">
                    <button onclick="app.deleteItem('materiais', ${item.id}, ${turmaId})">&times;</button>
                </div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }
    
    renderAlunos(turmaId){
         const container = document.getElementById('alunos');
         container.innerHTML = '';
         const items = this.db.users.filter(user => user.role === 'aluno' && user.turmaId === turmaId);
         items.forEach(item => {
             const card = document.createElement('div');
             card.className = 'card';
             card.innerHTML = `
                <h4>${item.name}</h4>
                <p class="text-secondary">${item.email}</p>
             `;
             container.appendChild(card);
         });
    }

    // --- Modal e CRUD ---

    openModal(turmaId) {
        const activeTab = document.querySelector('.tab-link.active').dataset.tab;
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('modal-form');
        form.innerHTML = ''; // Limpa o formulário

        let formContent = '';

        switch (activeTab) {
            case 'mural':
                modalTitle.textContent = 'Novo Aviso no Mural';
                formContent = `
                    <div class="form-group">
                        <label for="mural-content">Mensagem</label>
                        <textarea id="mural-content" class="form-control" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Postar</button>
                `;
                form.onsubmit = (e) => this.addItem(e, 'mural', turmaId);
                break;
            case 'atividades':
                 modalTitle.textContent = 'Nova Atividade';
                formContent = `
                    <div class="form-group">
                        <label for="atividade-title">Título</label>
                        <input type="text" id="atividade-title" class="form-control" required>
                    </div>
                     <div class="form-group">
                        <label for="atividade-desc">Descrição</label>
                        <textarea id="atividade-desc" class="form-control" required></textarea>
                    </div>
                     <div class="form-group">
                        <label for="atividade-date">Data de Entrega</label>
                        <input type="date" id="atividade-date" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Criar Atividade</button>
                `;
                form.onsubmit = (e) => this.addItem(e, 'atividades', turmaId);
                break;
            case 'materiais':
                 modalTitle.textContent = 'Novo Material';
                formContent = `
                    <div class="form-group">
                        <label for="material-title">Título</label>
                        <input type="text" id="material-title" class="form-control" required>
                    </div>
                     <div class="form-group">
                        <label for="material-desc">Descrição</label>
                        <input type="text" id="material-desc" class="form-control">
                    </div>
                     <div class="form-group">
                        <label for="material-url">URL do Material</label>
                        <input type="url" id="material-url" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Adicionar Material</button>
                `;
                form.onsubmit = (e) => this.addItem(e, 'materiais', turmaId);
                break;
            case 'alunos':
                 modalTitle.textContent = 'Adicionar Novo Aluno';
                 formContent = `
                    <div class="form-group">
                        <label for="aluno-name">Nome Completo</label>
                        <input type="text" id="aluno-name" class="form-control" required>
                    </div>
                     <div class="form-group">
                        <label for="aluno-email">E-mail</label>
                        <input type="email" id="aluno-email" class="form-control" required>
                    </div>
                    <p class="text-secondary" style="margin-bottom: 1rem;">Uma senha padrão "123" será criada.</p>
                    <button type="submit" class="btn btn-primary">Cadastrar Aluno</button>
                 `;
                 form.onsubmit = (e) => this.addItem(e, 'alunos', turmaId);
                 break;
        }

        form.innerHTML = formContent;
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }
    
    addItem(event, type, turmaId) {
        event.preventDefault();
        const newId = Date.now(); // ID simples baseado no timestamp
        let newItem;

        switch (type) {
            case 'mural':
                newItem = {
                    id: newId,
                    turmaId: turmaId,
                    author: this.currentUser.name,
                    content: document.getElementById('mural-content').value,
                    timestamp: new Date().toISOString()
                };
                this.db.mural.push(newItem);
                break;
            case 'atividades':
                newItem = {
                    id: newId,
                    turmaId: turmaId,
                    title: document.getElementById('atividade-title').value,
                    description: document.getElementById('atividade-desc').value,
                    dueDate: document.getElementById('atividade-date').value
                };
                this.db.atividades.push(newItem);
                break;
            case 'materiais':
                 newItem = {
                    id: newId,
                    turmaId: turmaId,
                    title: document.getElementById('material-title').value,
                    description: document.getElementById('material-desc').value,
                    url: document.getElementById('material-url').value
                };
                this.db.materiais.push(newItem);
                break;
             case 'alunos':
                 newItem = {
                    email: document.getElementById('aluno-email').value,
                    password: '123', // Senha padrão
                    role: 'aluno',
                    name: document.getElementById('aluno-name').value,
                    turmaId: turmaId
                };
                this.db.users.push(newItem);
                break;
        }
        
        this.updateDB();
        this.closeModal();
        
        // Re-renderiza o conteúdo da aba atual
        this[`render${type.charAt(0).toUpperCase() + type.slice(1)}`](turmaId);
    }

    deleteItem(type, itemId, turmaId) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            this.db[type] = this.db[type].filter(item => item.id !== itemId);
            this.updateDB();
            this[`render${type.charAt(0).toUpperCase() + type.slice(1)}`](turmaId);
        }
    }
}

// Inicializa a aplicação
const app = new App();

// Permite chamar métodos da instância globalmente (para os botões onclick)
window.app = app;