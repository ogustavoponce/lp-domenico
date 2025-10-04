// script.js

class App {
    constructor() {
        this.initDB();
        this.db = JSON.parse(localStorage.getItem('platformDB'));
        this.currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        document.addEventListener('DOMContentLoaded', () => this.route());
    }

    // --- INICIALIZAÇÃO E ROTEAMENTO ---
    initDB() {
        if (!localStorage.getItem('platformDB')) {
            localStorage.setItem('platformDB', JSON.stringify(getInitialData()));
        }
    }

    updateDB() {
        localStorage.setItem('platformDB', JSON.stringify(this.db));
    }

    route() {
        const path = window.location.pathname.split('/').pop();
        if (path === 'login.html' || path === '') {
            if (this.currentUser) {
                window.location.href = 'index.html';
                return;
            }
            this.initLoginPage();
        } else if (path === 'index.html') {
            if (!this.currentUser) {
                window.location.href = 'login.html';
                return;
            }
            this.initMainApp();
        }
    }

    // --- PÁGINA DE LOGIN ---
    initLoginPage() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const user = this.db.users.find(u => u.email === email && u.password === password);

                if (user) {
                    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                    window.location.href = 'index.html';
                } else {
                    document.getElementById('login-error').style.display = 'block';
                }
            });
        }
    }

    // --- APLICAÇÃO PRINCIPAL (index.html) ---
    initMainApp() {
        this.renderSidebar();
        this.renderWelcomeMessage();
        this.setupModalListeners();
    }

    renderSidebar() {
        const nav = document.getElementById('turmas-nav');
        const profile = document.getElementById('user-profile');
        nav.innerHTML = '<h3>Turmas</h3>';

        const turmas = this.currentUser.role === 'professor'
            ? this.db.turmas
            : this.db.turmas.filter(t => t.id === this.currentUser.turmaId);
        
        turmas.forEach(turma => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'nav-link';
            link.dataset.turmaId = turma.id;
            link.textContent = turma.name;
            link.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.renderTurmaView(turma.id);
            };
            nav.appendChild(link);
        });

        profile.innerHTML = `
            <div class="user-info">
                <span class="user-name">${this.currentUser.name}</span>
                <span class="user-role">${this.currentUser.role}</span>
            </div>
            <button id="logout-btn" class="icon-btn" title="Sair">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
        `;
        document.getElementById('logout-btn').onclick = this.logout;
    }

    renderWelcomeMessage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="welcome-container">
                <h2>Bem-vindo(a), ${this.currentUser.name}!</h2>
                <p>Selecione uma turma na barra lateral para começar.</p>
            </div>
        `;
    }
    
    // --- RENDERIZAÇÃO DA VISÃO DA TURMA ---
    renderTurmaView(turmaId) {
        const turma = this.db.turmas.find(t => t.id === turmaId);
        const mainContent = document.getElementById('main-content');
        
        // Header
        let headerHtml = `
            <div class="turma-view-header">
                <div>
                    <h2>${turma.name}</h2>
                    <p>${turma.curso}</p>
                </div>
        `;
        if (this.currentUser.role === 'professor') {
            headerHtml += `<button id="add-item-btn" class="btn btn-primary">Adicionar +</button>`;
        }
        headerHtml += `</div>`;
        
        // Grid Layout
        mainContent.innerHTML = `
            ${headerHtml}
            <div class="turma-grid-layout">
                <div class="timeline-section">
                    <h3>Linha do Tempo</h3>
                    <div id="timeline-content"></div>
                </div>
                <div class="sidebar-section">
                    <h3>Materiais</h3>
                    <div id="materiais-content"></div>
                    <h3>Alunos</h3>
                    <div id="alunos-content" class="aluno-list"></div>
                </div>
            </div>
        `;

        if (this.currentUser.role === 'professor') {
            document.getElementById('add-item-btn').onclick = () => this.openModal(turmaId);
        }

        this.renderTimeline(turmaId);
        this.renderMateriais(turmaId);
        this.renderAlunos(turmaId);
    }

    renderTimeline(turmaId) {
        const container = document.getElementById('timeline-content');
        const mural = this.db.mural.filter(i => i.turmaId === turmaId).map(i => ({...i, type: 'Mural'}));
        const atividades = this.db.atividades.filter(i => i.turmaId === turmaId).map(i => ({...i, type: 'Atividade'}));
        
        const timelineItems = [...mural, ...atividades]
            .sort((a, b) => new Date(b.timestamp || b.dueDate) - new Date(a.timestamp || a.dueDate));
        
        container.innerHTML = timelineItems.map(item => `
            <div class="timeline-item">
                <div class="item-header">
                    <h4>${item.title || ''}</h4>
                    <span class="item-tag">${item.type}</span>
                </div>
                <p>${item.content || item.description}</p>
                <div class="item-meta">
                    ${item.type === 'Mural' ? `Postado por ${item.author} em ${new Date(item.timestamp).toLocaleDateString()}` : ''}
                    ${item.type === 'Atividade' ? `Entrega: ${new Date(item.dueDate).toLocaleDateString()}` : ''}
                </div>
                ${this.currentUser.role === 'professor' ? `
                <div class="item-actions">
                    <button class="icon-btn" onclick="app.deleteItem('${item.type.toLowerCase()}s', ${item.id}, ${turmaId})">&times;</button>
                </div>` : ''}
            </div>
        `).join('');
    }

    renderMateriais(turmaId) {
        const container = document.getElementById('materiais-content');
        container.innerHTML = this.db.materiais.filter(i => i.turmaId === turmaId).map(item => `
            <div class="sidebar-item">
                <a href="${item.url}" target="_blank">${item.title}</a>
                <p class="item-meta">${item.description}</p>
                ${this.currentUser.role === 'professor' ? `
                <div class="item-actions">
                    <button class="icon-btn" onclick="app.deleteItem('materiais', ${item.id}, ${turmaId})">&times;</button>
                </div>` : ''}
            </div>
        `).join('');
    }

    renderAlunos(turmaId) {
        const container = document.getElementById('alunos-content');
        container.innerHTML = this.db.users.filter(u => u.role === 'aluno' && u.turmaId === turmaId).map(aluno => `
            <div class="sidebar-item aluno-item">
                <span>${aluno.name}</span>
                <span class="email">${aluno.email}</span>
            </div>
        `).join('');
    }

    // --- MODAL E LÓGICA DE CRUD ---
    setupModalListeners() {
        document.getElementById('modal-close').onclick = () => this.closeModal();
        document.getElementById('modal').onclick = (e) => {
            if (e.target.id === 'modal') this.closeModal();
        };
    }

    openModal(turmaId) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('modal-form');
        
        modalTitle.textContent = 'Adicionar Novo Item';
        form.innerHTML = `
            <div class="form-group">
                <label for="item-type">Tipo de Item</label>
                <select id="item-type" class="form-control">
                    <option value="mural">Aviso no Mural</option>
                    <option value="atividade">Atividade</option>
                    <option value="material">Material</option>
                    <option value="aluno">Aluno</option>
                </select>
            </div>
            <div id="form-fields"></div>
        `;
        
        const itemTypeSelect = document.getElementById('item-type');
        itemTypeSelect.onchange = () => this.renderModalFields(itemTypeSelect.value);
        this.renderModalFields(itemTypeSelect.value);

        form.onsubmit = (e) => {
            e.preventDefault();
            this.addItem(itemTypeSelect.value, turmaId);
        };

        modal.classList.add('active');
    }

    renderModalFields(type) {
        const container = document.getElementById('form-fields');
        let html = '';
        switch(type) {
            case 'mural':
                html = `<div class="form-group"><label for="mural-content">Mensagem</label><textarea id="mural-content" class="form-control" required></textarea></div>`;
                break;
            case 'atividade':
                html = `<div class="form-group"><label for="atividade-title">Título</label><input type="text" id="atividade-title" class="form-control" required></div>
                        <div class="form-group"><label for="atividade-desc">Descrição</label><textarea id="atividade-desc" class="form-control" required></textarea></div>
                        <div class="form-group"><label for="atividade-date">Data de Entrega</label><input type="date" id="atividade-date" class="form-control" required></div>`;
                break;
            case 'material':
                html = `<div class="form-group"><label for="material-title">Título</label><input type="text" id="material-title" class="form-control" required></div>
                        <div class="form-group"><label for="material-desc">Descrição</label><input type="text" id="material-desc" class="form-control"></div>
                        <div class="form-group"><label for="material-url">URL do Material</label><input type="url" id="material-url" class="form-control" required></div>`;
                break;
            case 'aluno':
                html = `<div class="form-group"><label for="aluno-name">Nome Completo</label><input type="text" id="aluno-name" class="form-control" required></div>
                        <div class="form-group"><label for="aluno-email">E-mail</label><input type="email" id="aluno-email" class="form-control" required></div>
                        <p class="text-secondary" style="margin-bottom: 1rem;">Uma senha padrão "123" será criada.</p>`;
                break;
        }
        container.innerHTML = html + `<button type="submit" class="btn btn-primary">Adicionar</button>`;
    }

    addItem(type, turmaId) {
        const newId = Date.now();
        let newItem;
        
        switch(type) {
            case 'mural':
                this.db.mural.push({ id: newId, turmaId, author: this.currentUser.name, content: document.getElementById('mural-content').value, timestamp: new Date().toISOString() });
                break;
            case 'atividade':
                this.db.atividades.push({ id: newId, turmaId, title: document.getElementById('atividade-title').value, description: document.getElementById('atividade-desc').value, dueDate: document.getElementById('atividade-date').value, timestamp: new Date().toISOString() });
                break;
            case 'material':
                this.db.materiais.push({ id: newId, turmaId, title: document.getElementById('material-title').value, description: document.getElementById('material-desc').value, url: document.getElementById('material-url').value });
                break;
            case 'aluno':
                this.db.users.push({ email: document.getElementById('aluno-email').value, password: '123', role: 'aluno', name: document.getElementById('aluno-name').value, turmaId });
                break;
        }

        this.updateDB();
        this.closeModal();
        this.renderTurmaView(turmaId);
    }
    
    deleteItem(type, itemId, turmaId) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            this.db[type] = this.db[type].filter(item => item.id !== itemId);
            this.updateDB();
            this.renderTurmaView(turmaId);
        }
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }

    logout() {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }
}

const app = new App();
window.app = app;