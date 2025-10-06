class DomenicoClassroom {
  constructor() {
    this.data = null;
    this.currentUser = null;
    this.currentRoute = 'home';
    
    this.init();
  }
  
  init() {
    this.loadData();
    
    if (this.isLoginPage()) {
      this.initLogin();
    } else {
      this.initApp();
    }
  }
  
  loadData() {
    this.data = JSON.parse(localStorage.getItem('domenicoClassroom'));
  }
  
  saveData() {
    localStorage.setItem('domenicoClassroom', JSON.stringify(this.data));
  }
  
  isLoginPage() {
    return document.getElementById('loginForm') !== null;
  }
  
  // ===== LOGIN =====
  initLogin() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value.trim();
      
      const user = this.data.users.find(u => 
        u.email.toLowerCase() === email && u.password === password
      );
      
      if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        errorEl.textContent = 'Email ou senha inválidos';
        errorEl.style.display = 'block';
        setTimeout(() => errorEl.style.display = 'none', 5000);
      }
    });
  }
  
  // ===== APP =====
  initApp() {
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
      window.location.href = 'login.html';
      return;
    }
    
    this.currentUser = JSON.parse(userData);
    this.render();
  }
  
  navigateTo(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;
    this.render();
  }
  
  render() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    const layout = document.createElement('div');
    layout.className = 'app-container fade-in';
    
    layout.appendChild(this.renderSidebar());
    layout.appendChild(this.renderMainContent());
    
    app.appendChild(layout);
    
    this.setupEventListeners();
  }
  
  renderSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    
    const navigation = this.getNavigationItems();
    
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <span class="material-icons">school</span>
          <h1>Classroom+</h1>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        ${navigation.map(section => `
          <div class="nav-section">
            <div class="nav-section-title">${section.title}</div>
            ${section.items.map(item => `
              <button class="nav-item ${this.currentRoute === item.route ? 'active' : ''}" 
                      data-route="${item.route}" ${item.params ? `data-params='${JSON.stringify(item.params)}'` : ''}>
                <span class="material-icons">${item.icon}</span>
                ${item.label}
              </button>
            `).join('')}
          </div>
        `).join('')}
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">${this.currentUser.avatar}</div>
          <div class="user-info">
            <h4>${this.currentUser.name}</h4>
            <p>${this.currentUser.profile === 'professor' ? 'Professor' : 'Aluno'}</p>
          </div>
        </div>
      </div>
    `;
    
    return sidebar;
  }
  
  getNavigationItems() {
    const sections = [
      {
        title: "Principal",
        items: [
          { label: "Início", icon: "home", route: "home" }
        ]
      }
    ];
    
    if (this.currentUser.profile === 'professor') {
      // Adicionar turmas para professor
      const turmas = this.data.turmas.filter(t => t.professor === this.currentUser.id);
      if (turmas.length > 0) {
        sections.push({
          title: "Minhas Turmas",
          items: turmas.map(turma => ({
            label: turma.nome,
            icon: "class",
            route: "turma",
            params: { id: turma.id }
          }))
        });
      }
      
      sections.push({
        title: "Ferramentas",
        items: [
          { label: "Criar Turma", icon: "add_circle", route: "criar-turma" },
          { label: "Sincronizar SUAP", icon: "sync", route: "suap" }
        ]
      });
    } else {
      // Adicionar turmas para aluno
      const minhasTurmas = this.data.turmas.filter(t => 
        t.alunos.includes(this.currentUser.id)
      );
      
      if (minhasTurmas.length > 0) {
        sections.push({
          title: "Minhas Turmas",
          items: minhasTurmas.map(turma => ({
            label: turma.nome,
            icon: "class",
            route: "turma",
            params: { id: turma.id }
          }))
        });
      }
      
      sections.push({
        title: "Acadêmico",
        items: [
          { label: "Minhas Notas", icon: "grade", route: "notas" },
          { label: "Calendário", icon: "event", route: "calendario" }
        ]
      });
    }
    
    sections.push({
      title: "Conta",
      items: [
        { label: "Configurações", icon: "settings", route: "configuracoes" },
        { label: "Sair", icon: "logout", route: "logout" }
      ]
    });
    
    return sections;
  }
  
  renderMainContent() {
    const main = document.createElement('main');
    main.className = 'main-content';
    
    const content = this.getRouteContent();
    
    main.innerHTML = `
      <div class="header">
        <h1>${content.title}</h1>
        ${content.subtitle ? `<p>${content.subtitle}</p>` : ''}
      </div>
      <div class="content">
        ${content.body}
      </div>
    `;
    
    return main;
  }
  
  getRouteContent() {
    switch (this.currentRoute) {
      case 'home':
        return this.renderHome();
      case 'turma':
        return this.renderTurma();
      case 'suap':
        return this.renderSuap();
      case 'logout':
        this.logout();
        return { title: 'Saindo...', body: '' };
      default:
        return {
          title: 'Em Desenvolvimento',
          subtitle: 'Esta funcionalidade está sendo desenvolvida',
          body: '<div class="text-center"><span class="material-icons" style="font-size: 64px; color: var(--text-muted);">construction</span></div>'
        };
    }
  }
  
  renderHome() {
    if (this.currentUser.profile === 'professor') {
      const turmas = this.data.turmas.filter(t => t.professor === this.currentUser.id);
      
      return {
        title: `Bem-vindo, ${this.currentUser.name}!`,
        subtitle: 'Gerencie suas turmas e atividades',
        body: `
          <div class="cards-grid">
            ${turmas.map(turma => {
              const totalAlunos = turma.alunos.length;
              const atividadesAtivas = this.data.atividades.filter(a => 
                a.turmaId === turma.id && a.status === 'ativa'
              ).length;
              
              return `
                <div class="card">
                  <div class="card-header" style="background: linear-gradient(135deg, ${turma.cor}, ${turma.cor}aa);">
                    <div class="card-title">${turma.nome}</div>
                    <div class="card-subtitle">${turma.descricao}</div>
                  </div>
                  <div class="card-body">
                    <div class="teacher-info">
                      <div class="teacher-avatar">${this.currentUser.avatar}</div>
                      <div>
                        <div class="teacher-name">${this.currentUser.name}</div>
                        <div class="teacher-role">Professor</div>
                      </div>
                    </div>
                    <div class="mb-16">
                      <div style="display: flex; gap: 16px; font-size: 14px; color: var(--text-secondary);">
                        <span><span class="material-icons" style="font-size: 16px; vertical-align: middle;">people</span> ${totalAlunos} alunos</span>
                        <span><span class="material-icons" style="font-size: 16px; vertical-align: middle;">assignment</span> ${atividadesAtivas} atividades</span>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <button class="btn btn-success" data-route="turma" data-params='{"id": ${turma.id}}'>
                      <span class="material-icons">arrow_forward</span>
                      Entrar na turma
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="activity-feed">
            <div class="activity-header">
              <h3>Atividade Recente</h3>
            </div>
            ${this.renderActivityFeed()}
          </div>
        `
      };
    } else {
      const minhasTurmas = this.data.turmas.filter(t => 
        t.alunos.includes(this.currentUser.id)
      );
      
      return {
        title: `Olá, ${this.currentUser.name}!`,
        subtitle: 'Suas turmas e atividades',
        body: `
          <div class="cards-grid">
            ${minhasTurmas.map(turma => {
              const professor = this.data.users.find(u => u.id === turma.professor);
              const atividadesPendentes = this.data.atividades.filter(a => {
                const entrega = this.data.entregas.find(e => 
                  e.atividadeId === a.id && e.alunoId === this.currentUser.id
                );
                return a.turmaId === turma.id && a.status === 'ativa' && !entrega;
              }).length;
              
              return `
                <div class="card">
                  <div class="card-header" style="background: linear-gradient(135deg, ${turma.cor}, ${turma.cor}aa);">
                    <div class="card-title">${turma.nome}</div>
                    <div class="card-subtitle">${turma.descricao}</div>
                  </div>
                  <div class="card-body">
                    <div class="teacher-info">
                      <div class="teacher-avatar">${professor.avatar}</div>
                      <div>
                        <div class="teacher-name">${professor.name}</div>
                        <div class="teacher-role">Professor</div>
                      </div>
                    </div>
                    ${atividadesPendentes > 0 ? `
                      <div class="mb-16" style="background: #fff3cd; padding: 12px; border-radius: 8px; border-left: 4px solid #ffc107;">
                        <strong style="color: #856404;">Atenção:</strong>
                        <div style="color: #856404; font-size: 14px;">${atividadesPendentes} atividade(s) pendente(s)</div>
                      </div>
                    ` : ''}
                  </div>
                  <div class="card-footer">
                    <button class="btn btn-success" data-route="turma" data-params='{"id": ${turma.id}}'>
                      <span class="material-icons">arrow_forward</span>
                      Entrar na turma
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="activity-feed">
            <div class="activity-header">
              <h3>Atividades Pendentes</h3>
            </div>
            ${this.renderPendingActivities()}
          </div>
        `
      };
    }
  }
  
  renderTurma() {
    const turmaId = this.routeParams?.id;
    if (!turmaId) return { title: 'Erro', body: 'Turma não encontrada' };
    
    const turma = this.data.turmas.find(t => t.id === turmaId);
    if (!turma) return { title: 'Erro', body: 'Turma não encontrada' };
    
    const professor = this.data.users.find(u => u.id === turma.professor);
    const avisos = this.data.avisos.filter(a => a.turmaId === turmaId).sort((a, b) => 
      new Date(b.criadoEm) - new Date(a.criadoEm)
    );
    const atividades = this.data.atividades.filter(a => a.turmaId === turmaId);
    
    return {
      title: turma.nome,
      subtitle: `${professor.name} • ${turma.alunos.length} alunos`,
      body: `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
          <div>
            <!-- Mural de Avisos -->
            <div class="activity-feed mb-24">
              <div class="activity-header">
                <h3>Mural da Turma</h3>
                ${this.currentUser.profile === 'professor' ? `
                  <button class="btn btn-success" onclick="app.criarAviso(${turmaId})">
                    <span class="material-icons">add</span>
                    Novo Aviso
                  </button>
                ` : ''}
              </div>
              ${avisos.map(aviso => {
                const autor = this.data.users.find(u => u.id === aviso.autorId);
                return `
                  <div class="activity-item">
                    <div class="activity-icon">
                      <span class="material-icons">announcement</span>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">${aviso.titulo}</div>
                      <div class="activity-description">${aviso.conteudo}</div>
                      <div class="activity-time">
                        ${autor.name} • ${this.formatDate(aviso.criadoEm)}
                        ${aviso.fixado ? '<span style="color: var(--accent-green); font-weight: 600;">• Fixado</span>' : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <!-- Atividades -->
            <div class="activity-feed">
              <div class="activity-header">
                <h3>Atividades</h3>
                ${this.currentUser.profile === 'professor' ? `
                  <button class="btn btn-success" onclick="app.criarAtividade(${turmaId})">
                    <span class="material-icons">add</span>
                    Nova Atividade
                  </button>
                ` : ''}
              </div>
              ${atividades.map(atividade => {
                const entrega = this.data.entregas.find(e => 
                  e.atividadeId === atividade.id && e.alunoId === this.currentUser.id
                );
                const isVencida = new Date(atividade.dataEntrega) < new Date();
                
                return `
                  <div class="activity-item">
                    <div class="activity-icon">
                      <span class="material-icons">assignment</span>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">${atividade.titulo}</div>
                      <div class="activity-description">${atividade.descricao}</div>
                      <div class="activity-time">
                        Entrega: ${this.formatDate(atividade.dataEntrega)}
                        ${isVencida ? '<span style="color: #dc2626;">• Vencida</span>' : ''}
                        ${entrega ? '<span style="color: var(--accent-green);">• Entregue</span>' : ''}
                        • ${atividade.pontos} pontos
                      </div>
                    </div>
                    <div style="margin-left: auto;">
                      <button class="btn btn-secondary" onclick="app.verAtividade(${atividade.id})">
                        ${this.currentUser.profile === 'professor' ? 'Gerenciar' : (entrega ? 'Ver entrega' : 'Entregar')}
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <div>
            <!-- Informações da Turma -->
            <div class="card mb-24">
              <div class="card-body">
                <h3 class="mb-16">Informações</h3>
                <div style="margin-bottom: 12px;">
                  <strong>Código da turma:</strong><br>
                  <code style="background: var(--bg-light); padding: 4px 8px; border-radius: 4px;">${turma.codigo}</code>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong>Alunos matriculados:</strong> ${turma.alunos.length}
                </div>
                <div>
                  <strong>Criada em:</strong> ${this.formatDate(turma.criadaEm)}
                </div>
              </div>
            </div>
            
            <!-- Arquivos -->
            <div class="card">
              <div class="card-body">
                <h3 class="mb-16">Arquivos da Turma</h3>
                ${this.data.arquivos.filter(a => a.turmaId === turmaId).map(arquivo => `
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: var(--bg-light); border-radius: 8px;">
                    <span class="material-icons" style="color: var(--text-muted);">description</span>
                    <div style="flex: 1;">
                      <div style="font-weight: 500; font-size: 14px;">${arquivo.nome}</div>
                      <div style="font-size: 12px; color: var(--text-muted);">${arquivo.tamanho}</div>
                    </div>
                  </div>
                `).join('')}
                ${this.currentUser.profile === 'professor' ? `
                  <button class="btn btn-secondary mt-16" onclick="app.adicionarArquivo(${turmaId})">
                    <span class="material-icons">attach_file</span>
                    Adicionar arquivo
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `
    };
  }
  
  renderSuap() {
    return {
      title: 'Sincronização com SUAP',
      subtitle: 'Transfira notas e dados para o sistema oficial do IFPR',
      body: `
        <div class="card" style="max-width: 600px;">
          <div class="card-body text-center">
            <span class="material-icons" style="font-size: 64px; color: var(--primary-blue); margin-bottom: 16px;">sync</span>
            <h3 class="mb-16">Sincronizar com SUAP</h3>
            <p class="mb-24" style="color: var(--text-secondary);">
              Clique no botão abaixo para sincronizar todas as notas e dados das turmas com o sistema SUAP do IFPR.
            </p>
            <button class="btn btn-success" onclick="app.sincronizarSuap()" style="padding: 12px 32px; font-size: 16px;">
              <span class="material-icons">cloud_upload</span>
              Sincronizar Dados
            </button>
          </div>
        </div>
      `
    };
  }
  
  renderActivityFeed() {
    // Simular atividades recentes
    const activities = [
      {
        icon: 'assignment_turned_in',
        title: 'Nova entrega recebida',
        description: 'Maria Silva entregou "Resenha - Dom Casmurro"',
        time: '2 horas atrás'
      },
      {
        icon: 'announcement',
        title: 'Aviso publicado',
        description: 'Lembrete sobre a prova de sexta-feira',
        time: '1 dia atrás'
      }
    ];
    
    return activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">
          <span class="material-icons">${activity.icon}</span>
        </div>
        <div class="activity-content">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-description">${activity.description}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `).join('');
  }
  
  renderPendingActivities() {
    const minhasTurmas = this.data.turmas.filter(t => 
      t.alunos.includes(this.currentUser.id)
    );
    
    const atividadesPendentes = [];
    
    minhasTurmas.forEach(turma => {
      const atividades = this.data.atividades.filter(a => a.turmaId === turma.id);
      atividades.forEach(atividade => {
        const entrega = this.data.entregas.find(e => 
          e.atividadeId === atividade.id && e.alunoId === this.currentUser.id
        );
        if (!entrega && atividade.status === 'ativa') {
          atividadesPendentes.push({ ...atividade, turma });
        }
      });
    });
    
    if (atividadesPendentes.length === 0) {
      return `
        <div class="activity-item text-center">
          <div style="color: var(--text-muted);">
            <span class="material-icons" style="font-size: 48px;">check_circle</span>
            <div>Nenhuma atividade pendente!</div>
          </div>
        </div>
      `;
    }
    
    return atividadesPendentes.map(atividade => `
      <div class="activity-item">
        <div class="activity-icon">
          <span class="material-icons">assignment</span>
        </div>
        <div class="activity-content">
          <div class="activity-title">${atividade.titulo}</div>
          <div class="activity-description">${atividade.turma.nome} • ${atividade.pontos} pontos</div>
          <div class="activity-time">Entrega: ${this.formatDate(atividade.dataEntrega)}</div>
        </div>
        <div style="margin-left: auto;">
          <button class="btn btn-success" onclick="app.verAtividade(${atividade.id})">
            Entregar
          </button>
        </div>
      </div>
    `).join('');
  }
  
  setupEventListeners() {
    // Navegação
    document.querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const route = el.dataset.route;
        const params = el.dataset.params ? JSON.parse(el.dataset.params) : {};
        this.navigateTo(route, params);
      });
    });
  }
  
  // ===== MÉTODOS DE AÇÃO =====
  criarAviso(turmaId) {
    const titulo = prompt('Título do aviso:');
    if (!titulo) return;
    
    const conteudo = prompt('Conteúdo do aviso:');
    if (!conteudo) return;
    
    const novoAviso = {
      id: Date.now(),
      turmaId: turmaId,
      autorId: this.currentUser.id,
      titulo: titulo,
      conteudo: conteudo,
      criadoEm: new Date().toISOString(),
      fixado: false
    };
    
    this.data.avisos.push(novoAviso);
    this.saveData();
    this.render();
  }
  
  criarAtividade(turmaId) {
    const titulo = prompt('Título da atividade:');
    if (!titulo) return;
    
    const descricao = prompt('Descrição da atividade:');
    if (!descricao) return;
    
    const dataEntrega = prompt('Data de entrega (YYYY-MM-DD):');
    if (!dataEntrega) return;
    
    const pontos = prompt('Pontos da atividade:');
    if (!pontos || isNaN(pontos)) return;
    
    const novaAtividade = {
      id: Date.now(),
      turmaId: turmaId,
      professorId: this.currentUser.id,
      titulo: titulo,
      descricao: descricao,
      tipo: 'individual',
      dataEntrega: new Date(dataEntrega + 'T23:59:00Z').toISOString(),
      pontos: parseInt(pontos),
      anexos: [],
      criadaEm: new Date().toISOString(),
      status: 'ativa'
    };
    
    this.data.atividades.push(novaAtividade);
    this.saveData();
    this.render();
  }
  
  verAtividade(atividadeId) {
    alert('Funcionalidade de visualização/entrega de atividade em desenvolvimento!');
  }
  
  adicionarArquivo(turmaId) {
    const nome = prompt('Nome do arquivo:');
    if (!nome) return;
    
    const descricao = prompt('Descrição (opcional):') || '';
    
    const novoArquivo = {
      id: Date.now(),
      turmaId: turmaId,
      nome: nome,
      descricao: descricao,
      arquivo: nome.toLowerCase().replace(/\s+/g, '_') + '.pdf',
      tamanho: Math.floor(Math.random() * 500 + 100) + ' KB',
      uploadEm: new Date().toISOString(),
      autorId: this.currentUser.id
    };
    
    this.data.arquivos.push(novoArquivo);
    this.saveData();
    this.render();
  }
  
  sincronizarSuap() {
    // Simular sincronização
    alert('Dados sincronizados com sucesso no SUAP! 🎉\n\nTodas as notas e informações das turmas foram transferidas para o sistema oficial do IFPR.');
  }
  
  logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
  
  // ===== UTILITÁRIOS =====
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Inicializar aplicação
window.app = new DomenicoClassroom();
