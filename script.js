// script.js

// ===================================================================================
// PARTE 1 DE 6: Estrutura da Classe, Construtor, Roteamento e Login
// ===================================================================================

class App {
    constructor() {
        this.initDB();
        this.db = JSON.parse(localStorage.getItem('platformDB'));
        this.currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        // Carrega e aplica o tema salvo
        this.currentTheme = localStorage.getItem('theme') || 'dark-theme';
        document.body.className = this.currentTheme;

        // Adiciona o listener principal que inicia a aplicação
        document.addEventListener('DOMContentLoaded', () => this.route());
    }

    // --- MÉTODOS DO NÚCLEO E BANCO DE DADOS ---

    /**
     * Verifica se o banco de dados existe no localStorage. Se não, cria a partir dos dados iniciais.
     */
    initDB() {
        if (!localStorage.getItem('platformDB')) {
            localStorage.setItem('platformDB', JSON.stringify(getInitialData()));
        }
    }

    /**
     * Salva o estado atual do objeto `this.db` no localStorage.
     */
    updateDB() {
        localStorage.setItem('platformDB', JSON.stringify(this.db));
    }

    /**
     * Direciona o fluxo da aplicação com base na URL e no estado de login do usuário.
     */
    route() {
        const path = window.location.pathname.split('/').pop();

        if (path === 'login.html' || path === '') {
            // Se já estiver logado, redireciona para o app. Senão, inicia a página de login.
            this.currentUser ? window.location.href = 'index.html' : this.initLoginPage();
        } 
        else if (path === 'index.html') {
            // Se não estiver logado, redireciona para o login. Senão, inicia o app principal.
            this.currentUser ? this.initMainApp() : window.location.href = 'login.html';
        }
    }

    /**
     * Limpa a sessão do usuário e redireciona para a página de login.
     */
    logout() {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }
    
    // --- LÓGICA DA PÁGINA DE LOGIN ---

    /**
     * Adiciona o listener de evento ao formulário de login.
     */
    initLoginPage() {
        const form = document.getElementById('login-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;
                const user = this.db.users.find(u => u.email === email && u.password === password);

                if (user) {
                    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                    window.location.href = 'index.html';
                } else {
                    document.getElementById('login-error').style.display = 'block';
                }
            };
        }
    }

    // --- O RESTANTE DOS MÉTODOS VIRÁ NAS PRÓXIMAS PARTES ---

} // Fim da classe App (será continuada)
// ===================================================================================
// PARTE 2 DE 6: Inicialização do App Principal e Renderização da Sidebar
// ===================================================================================

// --- APLICAÇÃO PRINCIPAL (CONTINUAÇÃO DA CLASSE APP) ---

/**
 * Ponto de entrada para a aplicação principal (index.html).
 */
initMainApp() {
    this.renderSidebar();
    this.renderWelcome();
    this.setupModalListeners(); // Será implementado depois
}

/**
 * Constrói e renderiza a barra de navegação lateral com base no perfil do usuário.
 */
renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    let navLinks = '';
    let turmasNav = '';

    // Monta os links principais de acordo com a função do usuário
    if (this.currentUser.role === 'professor') {
        navLinks += this.createNavLink('admin', 'Painel de Administração', 'grid');
        const turmas = this.db.turmas;
        turmasNav = turmas.map(t => this.createNavLink(`turma-${t.id}`, t.name, 'book')).join('');
    } else { // Aluno
        navLinks += this.createNavLink('notas', 'Minhas Notas', 'award');
        const turmasMatriculadas = this.db.turmas.filter(t => t.alunos.includes(this.currentUser.email));
        turmasNav = turmasMatriculadas.map(t => this.createNavLink(`turma-${t.id}`, t.name, 'book')).join('');
    }

    // Monta o HTML completo da sidebar
    sidebar.innerHTML = `
        <div class="sidebar-header"><h1 class="logo">Nexus</h1></div>
        <nav class="sidebar-nav">
            <div class="sidebar-nav-section"><h3>Principal</h3>${navLinks}</div>
            <div class="sidebar-nav-section"><h3>Turmas</h3>${turmasNav}</div>
        </nav>
        <div class="sidebar-footer">
            ${this.createNavLink('settings', 'Configurações', 'settings')}
            <button id="logout-btn" class="icon-btn" title="Sair">${this.getIcon('log-out')}</button>
        </div>
    `;

    // Adiciona os eventos de clique a todos os links de navegação
    document.querySelectorAll('.nav-link').forEach(link => link.onclick = (e) => this.handleNavClick(e, link.id));
    document.getElementById('logout-btn').onclick = () => this.logout();
}

/**
 * Lida com o clique em um link de navegação, atualizando a UI e chamando a função de renderização correta.
 * @param {Event} event - O evento de clique.
 * @param {string} id - O ID do link clicado.
 */
handleNavClick(event, id) {
    event.preventDefault();
    // Atualiza o estado visual dos links (ativo/inativo)
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // Chama a função de renderização apropriada
    if (id.startsWith('turma-')) this.renderTurma(parseInt(id.split('-')[1]));
    else if (id === 'admin') this.renderAdminPanel();
    else if (id === 'settings') this.renderSettings();
    else if (id === 'notas') this.renderNotas();
}

// --- RENDERIZAÇÃO DE SEÇÕES E UTILITÁRIOS DE UI ---

/**
 * Renderiza a mensagem de boas-vindas inicial no painel principal.
 */
renderWelcome() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="page-header"><h2>Bem-vindo(a), ${this.currentUser.name}!</h2></div>
        <p>Selecione uma turma ou uma opção no menu lateral para começar a usar a plataforma.</p>
    `;
}

/**
 * Cria o HTML para um link de navegação da sidebar.
 * @param {string} id - O ID do elemento.
 * @param {string} text - O texto do link.
 * @param {string} iconName - O nome do ícone a ser usado.
 * @returns {string} O HTML do link.
 */
createNavLink(id, text, iconName) {
    return `<a href="#" class="nav-link" id="${id}">${this.getIcon(iconName)}<span>${text}</span></a>`;
}

/**
 * Retorna o SVG de um ícone específico.
 * @param {string} name - O nome do ícone.
 * @returns {string} A string SVG do ícone.
 */
getIcon(name) {
    const icons = {
        grid: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        book: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
        award: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>',
        settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        'log-out': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
    };
    return icons[name] || '';
}

// ===================================================================================
// PARTE 3 DE 6: Renderização da Turma com Sistema de Módulos
// ===================================================================================

/**
 * Renderiza a visualização completa de uma turma, incluindo seus módulos e conteúdos.
 * @param {number} turmaId - O ID da turma a ser renderizada.
 */
renderTurma(turmaId) {
    const turma = this.db.turmas.find(t => t.id === turmaId);
    const mainContent = document.getElementById('main-content');

    // Estrutura principal da página da turma
    mainContent.innerHTML = `
        <div class="page-header">
            <div>
                <h2>${turma.name}</h2>
                <p>${turma.curso}</p>
            </div>
        </div>
        <div class="turma-layout">
            <aside id="modulo-sidebar" class="modulo-sidebar"></aside>
            <main id="conteudo-area" class="conteudo-area"></main>
        </div>
    `;

    // Renderiza a barra lateral com a lista de módulos
    this.renderModuloSidebar(turmaId);
}

/**
 * Renderiza a lista de módulos na barra lateral da página da turma.
 * @param {number} turmaId - O ID da turma.
 */
renderModuloSidebar(turmaId) {
    const sidebar = document.getElementById('modulo-sidebar');
    const modulos = this.db.modulos.filter(m => m.turmaId === turmaId).sort((a, b) => a.order - b.order);

    let header = '<div class="modulo-sidebar-header"><h3>Módulos</h3>';
    if (this.currentUser.role === 'professor') {
        header += `<button id="add-modulo-btn" class="icon-btn" title="Adicionar Módulo">${this.getIcon('plus')}</button>`;
    }
    header += '</div>';

    const links = modulos.map(m => `
        <a href="#" class="modulo-link" id="modulo-${m.id}" onclick="app.handleModuloClick(${m.id})">${m.name}</a>
    `).join('');

    sidebar.innerHTML = header + links;
    
    if (this.currentUser.role === 'professor') {
        document.getElementById('add-modulo-btn').onclick = () => this.openModal({ type: 'addModulo', turmaId });
    }

    // Ativa e renderiza o conteúdo do primeiro módulo da lista por padrão
    if (modulos.length > 0) {
        document.getElementById(`modulo-${modulos[0].id}`).classList.add('active');
        this.renderConteudoDoModulo(modulos[0].id);
    } else {
        document.getElementById('conteudo-area').innerHTML = '<p>Nenhum módulo foi criado para esta turma ainda.</p>';
    }
}

/**
 * Renderiza o conteúdo (páginas, atividades, links) de um módulo específico.
 * @param {number} moduloId - O ID do módulo.
 */
renderConteudoDoModulo(moduloId) {
    const area = document.getElementById('conteudo-area');
    const modulo = this.db.modulos.find(m => m.id === moduloId);
    const conteudos = this.db.conteudos.filter(c => c.moduloId === moduloId);

    let header = '<div class="conteudo-header"><h3>Conteúdo do Módulo</h3>';
    if (this.currentUser.role === 'professor') {
        header += `<button id="add-conteudo-btn" class="btn btn-primary">Adicionar Conteúdo</button>`;
    }
    header += '</div>';
    
    let conteudosHtml = conteudos.map(c => {
        let cardContent = '';
        switch (c.type) {
            case 'pagina':
                cardContent = `<span class="tag">PÁGINA</span><h4>${c.title}</h4><p>${c.content}</p>`;
                break;
            case 'atividade':
                cardContent = `<span class="tag">ATIVIDADE</span><h4>${c.title}</h4><p>${c.description}</p><small>Entrega: ${c.dueDate}</small>`;
                break;
            case 'link':
                cardContent = `<span class="tag">LINK</span><h4>${c.title}</h4><a href="${c.url}" target="_blank">${c.url}</a>`;
                break;
        }

        let actions = '';
        if (this.currentUser.role === 'professor') {
            actions = `
                <div class="card-actions">
                    <button class="icon-btn" onclick="app.deleteItem('conteudo', ${c.id})">&times;</button>
                </div>
            `;
        }
        return `<div class="conteudo-card">${actions}${cardContent}</div>`;
    }).join('');

    if (conteudos.length === 0) {
        conteudosHtml = '<p>Nenhum conteúdo adicionado a este módulo.</p>';
    }

    area.innerHTML = header + conteudosHtml;

    if (this.currentUser.role === 'professor') {
        document.getElementById('add-conteudo-btn').onclick = () => this.openModal({ type: 'addConteudo', moduloId, turmaId: modulo.turmaId });
    }
}

/**
 * Lida com o clique em um link de módulo, atualizando a UI.
 * @param {number} moduloId 
 */
handleModuloClick(moduloId) {
    document.querySelectorAll('.modulo-link').forEach(l => l.classList.remove('active'));
    document.getElementById(`modulo-${moduloId}`).classList.add('active');
    this.renderConteudoDoModulo(moduloId);
}

// ===================================================================================
// PARTE 4 DE 6: Painel de Administração do Professor
// ===================================================================================

/**
 * Renderiza o Painel de Administração principal com suas abas.
 */
renderAdminPanel() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="page-header">
            <h2>Painel de Administração</h2>
        </div>
        <nav class="turma-tabs" style="margin-bottom: 2rem;"> <a class="tab-link active" id="tab-turmas" href="#">Gerenciar Turmas</a>
            <a class="tab-link" id="tab-alunos" href="#">Gerenciar Alunos</a>
        </nav>
        <div id="admin-content"></div>
    `;

    document.getElementById('tab-turmas').onclick = (e) => {
        e.preventDefault();
        this.setActiveAdminTab('turmas');
        this.renderAdminTurmas();
    };
    document.getElementById('tab-alunos').onclick = (e) => {
        e.preventDefault();
        this.setActiveAdminTab('alunos');
        this.renderAdminAlunos();
    };

    // Renderiza a primeira aba por padrão
    this.renderAdminTurmas();
}

/**
 * Define qual aba do painel de administração está ativa.
 * @param {string} tabName - O nome da aba ('turmas' or 'alunos').
 */
setActiveAdminTab(tabName) {
    document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

/**
 * Renderiza a tabela de gerenciamento de turmas.
 */
renderAdminTurmas() {
    const container = document.getElementById('admin-content');
    const turmas = this.db.turmas;

    const tableRows = turmas.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.name}</td>
            <td>${t.curso}</td>
            <td>${t.alunos.length}</td>
            <td class="actions-cell">
                <button class="icon-btn" title="Gerenciar Matrículas" onclick="app.openModal({ type: 'manageEnrollment', turmaId: ${t.id} })">👥</button>
                <button class="icon-btn" title="Excluir Turma" onclick="app.deleteItem('turma', ${t.id})">🗑️</button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="page-header" style="padding-bottom: 0; border: none;">
            <h3>Todas as Turmas</h3>
            <button id="add-turma-btn" class="btn btn-primary">Criar Nova Turma</button>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Curso</th>
                        <th>Alunos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('add-turma-btn').onclick = () => this.openModal({ type: 'addTurma' });
}

/**
 * Renderiza a tabela de gerenciamento de alunos.
 */
renderAdminAlunos() {
    const container = document.getElementById('admin-content');
    const alunos = this.db.users.filter(u => u.role === 'aluno');

    const tableRows = alunos.map(a => `
        <tr>
            <td>${a.name}</td>
            <td>${a.email}</td>
            <td class="actions-cell">
                <button class="icon-btn" title="Excluir Aluno" onclick="app.deleteItem('aluno', '${a.email}')">🗑️</button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="page-header" style="padding-bottom: 0; border: none;">
            <h3>Todos os Alunos</h3>
            <button id="add-aluno-btn" class="btn btn-primary">Cadastrar Novo Aluno</button>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('add-aluno-btn').onclick = () => this.openModal({ type: 'addAluno' });
}

// ===================================================================================
// PARTE 5 DE 6: Seções de Notas, Configurações e Lógica do Modal
// ===================================================================================

/**
 * Renderiza a página "Minhas Notas" para o aluno.
 */
renderNotas() {
    const mainContent = document.getElementById('main-content');
    const entregas = this.db.entregas.filter(e => e.alunoEmail === this.currentUser.email);

    const tableRows = entregas.map(e => {
        const atividade = this.db.conteudos.find(c => c.id === e.conteudoId);
        return `
            <tr>
                <td>${atividade ? atividade.title : 'Atividade não encontrada'}</td>
                <td>${e.status}</td>
                <td>${e.grade !== null ? e.grade : 'N/A'}</td>
            </tr>
        `;
    }).join('');

    mainContent.innerHTML = `
        <div class="page-header">
            <h2>Minhas Notas</h2>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>Status</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Renderiza a página de Configurações.
 */
renderSettings() {
    const mainContent = document.getElementById('main-content');
    const isChecked = this.currentTheme === 'dark-theme' ? 'checked' : '';
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h2>Configurações</h2>
        </div>
        <div class="settings-grid">
            <div class="setting-card">
                <h3>Aparência</h3>
                <div class="theme-switcher">
                    <span>Modo Escuro (Dark Mode)</span>
                    <label class="switch">
                        <input type="checkbox" id="theme-toggle" ${isChecked}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="setting-card">
                <h3>Perfil</h3>
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" class="form-control" value="${this.currentUser.name}" disabled>
                </div>
                 <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" value="${this.currentUser.email}" disabled>
                </div>
            </div>
        </div>
    `;

    document.getElementById('theme-toggle').onchange = () => this.toggleTheme();
}

/**
 * Alterna entre o tema claro e escuro e salva a preferência.
 */
toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    document.body.className = this.currentTheme;
    localStorage.setItem('theme', this.currentTheme);
}

// --- LÓGICA DO MODAL ---

/**
 * Configura os listeners globais para fechar o modal.
 */
setupModalListeners() {
    const modal = document.getElementById('modal');
    document.getElementById('modal-close').onclick = () => this.closeModal();
    modal.onclick = (e) => {
        if (e.target.id === 'modal') this.closeModal();
    };
}

/**
 * Abre e configura o modal com base na ação solicitada.
 * @param {object} config - Objeto de configuração para o modal.
 */
openModal(config) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('modal-form');
    let formContent = '';

    switch (config.type) {
        case 'addTurma':
            title.textContent = 'Criar Nova Turma';
            formContent = `
                <div class="form-group"><label>Nome da Turma</label><input id="turma-name" type="text" class="form-control" required></div>
                <div class="form-group"><label>Nome do Curso</label><input id="turma-curso" type="text" class="form-control" required></div>
                <button type="submit" class="btn btn-primary">Criar Turma</button>
            `;
            form.onsubmit = (e) => { e.preventDefault(); this.addItem('turma'); };
            break;
        
        case 'addAluno':
            title.textContent = 'Cadastrar Novo Aluno';
            formContent = `
                <div class="form-group"><label>Nome Completo</label><input id="aluno-name" type="text" class="form-control" required></div>
                <div class="form-group"><label>Email</label><input id="aluno-email" type="email" class="form-control" required></div>
                <p class="text-secondary" style="margin-bottom: 1rem;">Uma senha padrão "123" será criada.</p>
                <button type="submit" class="btn btn-primary">Cadastrar Aluno</button>
            `;
            form.onsubmit = (e) => { e.preventDefault(); this.addItem('aluno'); };
            break;

        case 'manageEnrollment':
            const turma = this.db.turmas.find(t => t.id === config.turmaId);
            const todosAlunos = this.db.users.filter(u => u.role === 'aluno');
            title.textContent = `Matricular Alunos em: ${turma.name}`;
            
            const checkboxes = todosAlunos.map(aluno => {
                const isEnrolled = turma.alunos.includes(aluno.email);
                return `<div><label><input type="checkbox" value="${aluno.email}" ${isEnrolled ? 'checked' : ''}> ${aluno.name} (${aluno.email})</label></div>`;
            }).join('');
            
            formContent = `
                <div class="form-group">${checkboxes}</div>
                <button type="submit" class="btn btn-primary">Salvar Matrículas</button>
            `;
            form.onsubmit = (e) => { e.preventDefault(); this.updateEnrollment(config.turmaId, e.target); };
            break;

        case 'addModulo':
            title.textContent = 'Criar Novo Módulo';
            formContent = `
                <div class="form-group"><label>Nome do Módulo</label><input id="modulo-name" type="text" class="form-control" required></div>
                <button type="submit" class="btn btn-primary">Criar Módulo</button>
            `;
            form.onsubmit = (e) => { e.preventDefault(); this.addItem('modulo', { turmaId: config.turmaId }); };
            break;
        
        case 'addConteudo':
             title.textContent = 'Adicionar Novo Conteúdo';
             formContent = `
                <div class="form-group"><label>Tipo de Conteúdo</label>
                    <select id="conteudo-type" class="form-control">
                        <option value="pagina">Página</option>
                        <option value="atividade">Atividade</option>
                        <option value="link">Link Externo</option>
                    </select>
                </div>
                <div id="conteudo-fields"></div>
             `;
             form.onsubmit = (e) => { e.preventDefault(); this.addItem('conteudo', { moduloId: config.moduloId, turmaId: config.turmaId }); };
             
             // Atraso para garantir que o HTML está no DOM antes de adicionar o listener
             setTimeout(() => {
                const typeSelect = document.getElementById('conteudo-type');
                this.renderConteudoFields(typeSelect.value); // Renderiza os campos iniciais
                typeSelect.onchange = () => this.renderConteudoFields(typeSelect.value);
             }, 0);
             break;
    }

    form.innerHTML = formContent;
    modal.classList.add('active');
}

/**
 * Renderiza os campos específicos para cada tipo de conteúdo no modal.
 * @param {string} type - O tipo de conteúdo ('pagina', 'atividade', 'link').
 */
renderConteudoFields(type) {
    const container = document.getElementById('conteudo-fields');
    let fields = '';
    switch (type) {
        case 'pagina':
            fields = `<div class="form-group"><label>Título</label><input id="conteudo-title" type="text" class="form-control" required></div>
                      <div class="form-group"><label>Conteúdo</label><textarea id="conteudo-content" class="form-control" required></textarea></div>`;
            break;
        case 'atividade':
            fields = `<div class="form-group"><label>Título</label><input id="conteudo-title" type="text" class="form-control" required></div>
                      <div class="form-group"><label>Descrição</label><textarea id="conteudo-description" class="form-control" required></textarea></div>
                      <div class="form-group"><label>Data de Entrega</label><input id="conteudo-dueDate" type="date" class="form-control" required></div>`;
            break;
        case 'link':
            fields = `<div class="form-group"><label>Título</label><input id="conteudo-title" type="text" class="form-control" required></div>
                      <div class="form-group"><label>URL</label><input id="conteudo-url" type="url" class="form-control" required></div>`;
            break;
    }
    container.innerHTML = fields + `<button type="submit" class="btn btn-primary">Adicionar</button>`;
}


/**
 * Fecha o modal.
 */
closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// ===================================================================================
// PARTE 6 DE 6: Lógica de CRUD (Adicionar, Deletar, Atualizar) e Finalização
// ===================================================================================

/**
 * Adiciona um novo item (turma, aluno, módulo, etc.) ao banco de dados.
 * @param {string} type - O tipo de item a ser adicionado.
 * @param {object} context - Dados de contexto, como IDs de turma ou módulo.
 */
addItem(type, context = {}) {
    const newId = Date.now(); // ID simples para novos itens
    switch (type) {
        case 'turma':
            const newTurma = {
                id: newId,
                name: document.getElementById('turma-name').value,
                curso: document.getElementById('turma-curso').value,
                alunos: []
            };
            this.db.turmas.push(newTurma);
            this.renderAdminTurmas();
            break;

        case 'aluno':
            const newAluno = {
                email: document.getElementById('aluno-email').value,
                password: '123',
                role: 'aluno',
                name: document.getElementById('aluno-name').value
            };
            this.db.users.push(newAluno);
            this.renderAdminAlunos();
            break;
            
        case 'modulo':
            const newModulo = {
                id: newId,
                turmaId: context.turmaId,
                name: document.getElementById('modulo-name').value,
                order: (this.db.modulos.filter(m => m.turmaId === context.turmaId).length) + 1
            };
            this.db.modulos.push(newModulo);
            this.renderTurma(context.turmaId);
            break;

        case 'conteudo':
            const tipoConteudo = document.getElementById('conteudo-type').value;
            const newConteudo = { id: newId, moduloId: context.moduloId, type: tipoConteudo };
            
            newConteudo.title = document.getElementById('conteudo-title').value;
            if (tipoConteudo === 'pagina') newConteudo.content = document.getElementById('conteudo-content').value;
            if (tipoConteudo === 'atividade') {
                newConteudo.description = document.getElementById('conteudo-description').value;
                newConteudo.dueDate = document.getElementById('conteudo-dueDate').value;
            }
            if (tipoConteudo === 'link') newConteudo.url = document.getElementById('conteudo-url').value;
            
            this.db.conteudos.push(newConteudo);
            this.renderTurma(context.turmaId);
            break;
    }

    this.updateDB();
    this.closeModal();
}

/**
 * Deleta um item do banco de dados.
 * @param {string} type - O tipo de item a ser deletado.
 * @param {number|string} id - O ID (ou email para aluno) do item.
 */
deleteItem(type, id) {
    if (!confirm(`Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.`)) return;

    switch (type) {
        case 'turma':
            // Além de deletar a turma, deleta módulos e conteúdos associados
            const modulosDaTurma = this.db.modulos.filter(m => m.turmaId === id).map(m => m.id);
            this.db.conteudos = this.db.conteudos.filter(c => !modulosDaTurma.includes(c.moduloId));
            this.db.modulos = this.db.modulos.filter(m => m.turmaId !== id);
            this.db.turmas = this.db.turmas.filter(t => t.id !== id);
            this.renderAdminTurmas();
            break;

        case 'aluno':
            this.db.users = this.db.users.filter(u => u.email !== id);
            // Remove o aluno de todas as turmas em que estava matriculado
            this.db.turmas.forEach(t => {
                t.alunos = t.alunos.filter(email => email !== id);
            });
            this.renderAdminAlunos();
            break;

        case 'conteudo':
            const conteudo = this.db.conteudos.find(c => c.id === id);
            const modulo = this.db.modulos.find(m => m.id === conteudo.moduloId);
            this.db.conteudos = this.db.conteudos.filter(c => c.id !== id);
            this.renderTurma(modulo.turmaId);
            break;
    }

    this.updateDB();
}

/**
 * Atualiza a lista de alunos matriculados em uma turma.
 * @param {number} turmaId - O ID da turma.
 * @param {HTMLFormElement} form - O elemento do formulário com os checkboxes.
 */
updateEnrollment(turmaId, form) {
    const turma = this.db.turmas.find(t => t.id === turmaId);
    const selectedAlunos = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    turma.alunos = selectedAlunos;

    this.updateDB();
    this.closeModal();
    this.renderAdminTurmas();
}

} // ESTE É O '}' QUE FECHA A CLASSE APP

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
// Cria uma instância da classe App para iniciar tudo.
const app = new App();
// Disponibiliza a instância globalmente para que os `onclick` no HTML possam chamar os métodos (ex: onclick="app.deleteItem(...)").
window.app = app;