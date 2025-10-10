class App {
  constructor() {
    this.loadData();
    this.theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('theme-dark', this.theme === 'dark');
    document.body.classList.toggle('theme-light', this.theme === 'light');
    this.route();
  }

  loadData() {
    if (!localStorage.NEXUS_DATA) {
      localStorage.NEXUS_DATA = JSON.stringify(window.NEXUS_DB_SEED);
    }
    this.data = JSON.parse(localStorage.NEXUS_DATA);
  }

  saveData() {
    localStorage.NEXUS_DATA = JSON.stringify(this.data);
  }

  login(email, password) {
    return this.data.users.find(u => u.email === email && u.password === password) || null;
  }

  setSession(user) {
    sessionStorage.NEXUS_SESSION = JSON.stringify(user);
  }

  getSession() {
    return sessionStorage.NEXUS_SESSION ? JSON.parse(sessionStorage.NEXUS_SESSION) : null;
  }

  route() {
    if (location.pathname.endsWith('login.html')) {
      this.renderLogin();
    } else {
      if (!this.getSession()) {
        location.replace('login.html');
        return;
      }
      this.renderApp();
    }
  }

  renderLogin() {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');
    form.onsubmit = e => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      const user = this.login(email, password);
      if (user) {
        this.setSession(user);
        location.replace('index.html');
      } else {
        errorMsg.textContent = 'Usuário ou senha incorretos.';
      }
    };
  }

  renderApp() {
    this.loadData();
    const user = this.getSession();
    const app = document.getElementById('app');
    app.innerHTML = '';

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-header">NEXUS</div>
      <div class="sidebar-profile">
        <div class="sidebar-avatar">${user.name.charAt(0)}</div>
        <div>
          <div class="sidebar-info">${user.name}</div>
          <div class="sidebar-info-small">${user.role === 'professor' ? 'Professor' : 'Aluno'}</div>
        </div>
      </div>
      <nav class="sidebar-nav"></nav>
    `;
    app.appendChild(sidebar);

    // Main
    const main = document.createElement('main');
    main.className = 'main-content';
    app.appendChild(main);

    const nav = sidebar.querySelector('.sidebar-nav');

    const links = user.role === 'professor'
      ? [
        { label: 'Painel de Administração', anchor: 'admin', icon: this.iconDashboard() }, 
        { label: 'Minhas Turmas', anchor: 'turmas', icon: this.iconClass() },
        { label: 'Configurações', anchor: 'config', icon: this.iconSettings() }
      ]
      : [
        { label: 'Minhas Turmas', anchor: 'turmas', icon: this.iconClass() },
        { label: 'Minhas Notas', anchor: 'notas', icon: this.iconGrade() },
        { label: 'Configurações', anchor: 'config', icon: this.iconSettings() }
      ];

    links.forEach(lk => {
      const a = document.createElement('a');
      a.href = `#${lk.anchor}`;
      a.className = '';
      a.innerHTML = `${lk.icon} ${lk.label}`;
      a.dataset.anchor = lk.anchor;
      nav.appendChild(a);
    });

    const navigate = () => {
      if (!location.hash) {
        location.hash = user.role === 'professor' ? '#admin' : '#turmas';
      }
      [...nav.children].forEach(a => a.classList.toggle('active', a.dataset.anchor === location.hash.slice(1)));
      main.innerHTML = '';

      switch(location.hash) {
        case '#admin':
          if(user.role === 'professor') this.renderAdmin(main, user);
          else main.innerHTML = '<p>Acesso negado.</p>';
          break;
        case '#turmas':
          this.renderTurmas(main, user);
          break;
        case '#config':
          this.renderConfig(main, user);
          break;
        case '#notas':
          if(user.role === 'aluno') this.renderNotas(main, user);
          else main.innerHTML = '<p>Acesso negado.</p>';
          break;
        default:
          if(location.hash.startsWith('#turma_')) {
            const id = location.hash.split('_')[1];
            this.renderTurmaDetalhe(main, user, id);
          } else {
            main.innerHTML = '<p>Página não encontrada</p>';
          }
      }
    };

    window.addEventListener('hashchange', navigate);
    navigate();
  }

  renderAdmin(main, user) {
    main.innerHTML = `<h2 class="main-header">Painel de Administração</h2><p>Funcionalidades avançadas aqui (em desenvolvimento)</p>`;
  }

  renderTurmas(main, user) {
    main.innerHTML = `<h2 class="main-header">Minhas Turmas</h2>`;
    const list = document.createElement('ul');
    list.className = 'list-reset';
    const turmas = user.role === 'professor'
      ? this.data.turmas.filter(t => t.professorId === user.id)
      : this.data.turmas.filter(t => t.alunos.includes(user.id));

    if(!turmas.length) {
      main.innerHTML += '<p>Você ainda não possui turmas.</p>';
      return;
    }
    turmas.forEach(t => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#turma_${t.id}`;
      a.className = 'text-link';
      a.textContent = `${t.name} (${t.curso})`;
      li.appendChild(a);
      list.appendChild(li);
    });
    main.appendChild(list);
  }

  renderTurmaDetalhe(main, user, turmaId) {
    const turma = this.data.turmas.find(t => t.id === turmaId);

    if(!turma) {
      main.innerHTML = '<p>Turma não encontrada.</p>';
      return;
    }
    main.innerHTML = `<h2 class="main-header">${turma.name}</h2>`;

    turma.modulos.forEach(mod => {
      const section = document.createElement('section');
      section.style.marginBottom = '20px';

      const h3 = document.createElement('h3');
      h3.textContent = mod.name;
      section.appendChild(h3);

      if(!mod.conteudos.length) {
        const p = document.createElement('p');
        p.textContent = 'Nenhum conteúdo.';
        p.style.color = 'var(--text-secondary)';
        section.appendChild(p);
      } else {
        const ul = document.createElement('ul');
        ul.className = 'list-reset';
        mod.conteudos.forEach(c => {
          const li = document.createElement('li');
          let text = c.titulo;
          if(c.type === 'atividade') {
            text += ` (Entrega: ${c.dataEntrega})`;
          }
          const span = document.createElement('span');
          span.textContent = text;
          li.appendChild(span);
          ul.appendChild(li);
        });
        section.appendChild(ul);
      }
      main.appendChild(section);
    });
  }

  renderConfig(main, user) {
    main.innerHTML = `
      <h2 class="main-header">Configurações</h2>
      <p><strong>Nome:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Tipo:</strong> ${user.role === 'professor' ? 'Professor' : 'Aluno'}</p>
      <button id="btnLogout" class="btn btn-primary">Sair</button>
    `;
    document.getElementById('btnLogout').onclick = () => {
      sessionStorage.removeItem('NEXUS_SESSION');
      location.href = 'login.html';
    };
  }

  renderNotas(main, user) {
    const entregas = this.data.entregas.filter(e => e.alunoId === user.id);

    main.innerHTML = `<h2 class="main-header">Minhas Notas</h2>`;

    if(!entregas.length) {
      main.innerHTML += '<p>Você não possui notas ainda.</p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Turma</th>
        <th>Atividade</th>
        <th>Status</th>
        <th>Nota</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    entregas.forEach(e => {
      const t = this.data.turmas.find(tu => tu.id === e.turmaId);
      const conteudo = t ? t.modulos.flatMap(m => m.conteudos).find(c => c.id === e.conteudoId) : null;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t ? t.name : ''}</td>
        <td>${conteudo ? conteudo.titulo : ''}</td>
        <td>${e.status}</td>
        <td>${e.nota != null ? e.nota : '-'}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    main.appendChild(table);
  }

  // Ícones SVG para sidebar
  iconDashboard() {
    return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h8V3H3z"></path><path d="M3 21h8v-6H3z"></path><path d="M13 21h8v-10h-8z"></path><path d="M13 3v6h8V3z"></path></svg>`;
  }
  iconClass() {
    return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 3l-4 4-4-4"></path></svg>`;
  }
  iconSettings() {
    return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a2 2 0 00.53-2.6"></path></svg>`;
  }
  iconGrade() {
    return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M2 10h20"></path></svg>`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.NEXUS_APP = new App();
});
