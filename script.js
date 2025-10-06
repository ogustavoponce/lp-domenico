class App {
  constructor() {
    this.isLoginPage = !!document.getElementById('loginForm');
    this.theme = localStorage.getItem('theme') || 'dark';
    this.loadData();

    if (this.isLoginPage) this.initLogin();
    else this.initSPA();
  }
  loadData() {
    this.data = JSON.parse(localStorage.getItem('eduSupremeData'));
  }
  saveData() {
    localStorage.setItem('eduSupremeData', JSON.stringify(this.data));
  }
  initLogin() {
    document.body.className = `theme-${this.theme}`;
    document.getElementById('loginForm').onsubmit = (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();
      const user = this.data.users.find(
        u => u.email === email && u.password === password
      );
      if (user) {
        sessionStorage.setItem('loggedUser', JSON.stringify(user));
        window.location = 'index.html';
      } else {
        document.getElementById('loginError').textContent = 'Credenciais inválidas.';
      }
    };
  }
  initSPA() {
    const raw = sessionStorage.getItem('loggedUser');
    if (!raw) { window.location = 'login.html'; return; }
    this.user = JSON.parse(raw);
    document.body.className = `theme-${this.theme}`;
    this.renderApp();

    window.onpopstate = () => this.renderApp();
  }
  renderApp() {
    const app = document.getElementById('app');
    if (!app) return;
    const sidebar = this.renderSidebar();
    const main = this.renderMain();
    app.innerHTML = '';
    app.appendChild(sidebar);
    app.appendChild(main);
  }
  renderSidebar() {
    const div = document.createElement('div');
    div.className = 'sidebar';
    let nav = [];
    if (this.user.profile === 'professor') {
      nav.push({ name: "Dashboard", route: "dashboard" });
      this.data.turmas.filter(t => t.professores.includes(this.user.id)).forEach(turma =>
        nav.push({ name: turma.name, route: `turma-${turma.id}` })
      );
      nav.push({ name: "Configurações", route: "config" });
    } else {
      nav.push({ name: "Painel Principal", route: "dashboard" });
      this.data.turmas.filter(t => t.alunos.includes(this.user.id)).forEach(turma =>
        nav.push({ name: turma.name, route: `turma-${turma.id}` })
      );
      nav.push({ name: "Notificações", route: "notas" });
      nav.push({ name: "Configurações", route: "config" });
    }
    nav.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nav-link';
      btn.textContent = item.name;
      btn.onclick = () => {
        history.pushState(null, '', '?' + item.route);
        this.renderApp();
      };
      if (location.search === '?' + item.route) btn.classList.add('active');
      div.appendChild(btn);
    });
    const userDiv = document.createElement('div');
    userDiv.innerHTML = `<img src="${this.user.avatar || 'avatar.png'}" class="avatar" title="${this.user.name}">`;
    div.appendChild(userDiv);
    return div;
  }
  renderMain() {
    const content = document.createElement('div');
    content.className = 'main-content';
    const route = (location.search || '?').substring(1);
    if (route === "dashboard" || route === "") this.renderDashboard(content);
    else if (route.startsWith('turma-')) this.renderTurma(content, parseInt(route.split('-')[1]));
    else if (route === 'notas') this.renderNotas(content);
    else if (route === 'config') this.renderConfig(content);
    else content.innerHTML = '<h1>404</h1><p>Página não encontrada.</p>';
    return content;
  }
  renderDashboard(content) {
    content.innerHTML = `<h1>Bem-vindo(a), ${this.user.name}</h1>
      <div class="card">
        <h2>Seu Progresso</h2>
        <div class="chart-bar"><div class="chart-bar-fill" style="width:91%"></div></div>
        <div class="status-badge">Engajamento: 91%</div>
      </div>
      <div class="card">
        <h3>Próximos Passos Recomendados <span>⚡</span></h3>
        <div>- Complete sua missão em <b>Algoritmos Avançados</b></div>
        <div>- Participe da gamificação semanal <span>🏆</span></div>
      </div>
      <div class="card">
        <h3>Notificações</h3>
        <div><b>2</b> novas mensagens da turma</div>
        <div><b>Badge desbloqueado:</b> Suprema Crown 🎖️</div>
      </div>`;
  }
  renderTurma(content, turmaId) {
    const turma = this.data.turmas.find(t => t.id === turmaId && (t.professores.includes(this.user.id) || t.alunos.includes(this.user.id)));
    if (!turma) { content.innerHTML = "<h2>Turma não encontrada</h2>"; return; }
    content.innerHTML = `<h1>${turma.name}</h1><h2>${turma.curso}</h2>`;
    const modulos = turma.modulos.map(mid => this.data.modulos.find(m => m.id === mid)).filter(Boolean);
    modulos.forEach(mod => {
      content.innerHTML += `<div class="card"><h3>${mod.title}</h3>`;
      mod.conteudos.map(cid => this.data.conteudos.find(c => c.id === cid)).forEach(conteudo => {
        if (conteudo.type === "texto") content.innerHTML += `<div><b>${conteudo.title}:</b> ${conteudo.body}</div>`;
        if (conteudo.type === "atividade") content.innerHTML += `
          <div>
            <b>${conteudo.title} (Atividade):</b> ${conteudo.description}<br>
            <span>Entrega até: ${conteudo.dataEntrega}</span>
          </div>`;
        if (conteudo.type === "badge") {
          const badge = this.data.badges.find(b => b.id === conteudo.badge);
          content.innerHTML += `<div class="status-badge" style="background:${badge.color}">${badge.label} | ${conteudo.points} pontos</div>`;
        }
      });
      content.innerHTML += `</div>`;
    });
  }
  renderNotas(content) {
    content.innerHTML = `<h1>Minhas Notas</h1>`;
    const turmas = this.data.turmas.filter(t => t.alunos.includes(this.user.id));
    turmas.forEach(turma => {
      content.innerHTML += `<h2>${turma.name} - ${turma.curso}</h2>`;
      turma.modulos.map(mid => this.data.modulos.find(m => m.id === mid)).forEach(modulo => {
        modulo.conteudos.filter(cid => {
          const c = this.data.conteudos.find(c => c.id === cid);
          return c && c.type === "atividade";
        }).forEach(cid => {
          const atividade = this.data.conteudos.find(c => c.id === cid);
          const entrega = this.data.entregas.find(e => e.conteudoId === atividade.id && e.alunoId === this.user.id);
          content.innerHTML += `<div class="card">
            <b>${atividade.title}</b> - Status: ${entrega?.entregue ? "Entregue" : "Pendente"} | Nota: ${entrega?.nota ?? "-"}
            ${entrega?.timestamp ? `<div><small>Data entrega: ${entrega.timestamp}</small></div>` : ''}
          </div>`;
        });
      });
    });
  }
  renderConfig(content) {
    content.innerHTML = `<h1>Configurações</h1>
      <div class='card'>
        <b>Usuário:</b> ${this.user.name}<br>
        <b>E-mail:</b> ${this.user.email}<br>
        <button class='switch-theme' onclick="window.app.toggleTheme()">${this.theme === 'dark' ? 'Escuro' : 'Claro'}</button>
        <button class='button-accent' onclick="window.app.logout()">Sair</button>
      </div>`;
  }
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.renderApp();
  }
  logout() {
    sessionStorage.removeItem('loggedUser');
    window.location = 'login.html';
  }
}
window.app = new App();
