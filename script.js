class DomenicoClassroomApp {
  constructor() {
    this.isLoginPage = !!document.getElementById('loginForm');
    this.loadData();
    if (this.isLoginPage) this.initLogin();
    else this.initSPA();
  }
  loadData() {
    this.data = JSON.parse(localStorage.getItem('domenicoData'));
  }
  saveData() {
    localStorage.setItem('domenicoData', JSON.stringify(this.data));
  }
  // Login simplificado
  initLogin() {
    document.getElementById('loginForm').onsubmit = (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim().toLowerCase();
      const password = e.target.password.value.trim();
      const user = this.data.users.find(u => u.email.toLowerCase() === email && u.password === password);
      if (user) {
        sessionStorage.setItem('loggedUser', JSON.stringify(user));
        window.location = 'index.html';
      } else {
        const err = document.getElementById('loginError');
        err.textContent = 'Email ou senha inválidos';
        err.style.display = 'block';
        setTimeout(() => err.style.display = 'none', 4000);
      }
    };
  }
  // SPA principal
  initSPA() {
    const raw = sessionStorage.getItem('loggedUser');
    if (!raw) { window.location = 'login.html'; return; }
    this.user = JSON.parse(raw);
    this.renderApp();
  }
  renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(this.renderSidebar());
    app.appendChild(this.renderMain());
  }
  renderSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';

    if (this.user.profile === 'professor') {
      const links = [
        { text: 'Principal', route: 'dashboard' },
        { text: 'Turma 1º Ano A', route: 'turma-1' },
        { text: 'Sincronizar Notas SUAP', route: 'suap' },
        { text: 'Sair', route: 'logout' }
      ];
      links.forEach(l => {
        const btn = document.createElement('button');
        btn.className = 'nav-link';
        btn.textContent = l.text;
        btn.onclick = () => this.handleRoute(l.route);
        sidebar.appendChild(btn);
      });
    } else {
      const links = [
        { text: 'Principal', route: 'dashboard' },
        { text: 'Minha Turma', route: 'turma-1' },
        { text: 'Sair', route: 'logout' }
      ];
      links.forEach(l => {
        const btn = document.createElement('button');
        btn.className = 'nav-link';
        btn.textContent = l.text;
        btn.onclick = () => this.handleRoute(l.route);
        sidebar.appendChild(btn);
      });
    }
    return sidebar;
  }
  renderMain() {
    const main = document.createElement('div');
    main.className = 'main-content';
    const route = sessionStorage.getItem('route') || 'dashboard';

    if (route === 'dashboard') {
      main.innerHTML = this.user.profile === 'professor' ?
        `<h1>Bem-vindo, Prof. Domenico!</h1>
         <div class="card">Turma atual: 1º Ano A</div>
         <div class="card">Últimos avisos:<br>${this.data.turmas[0].avisos.map(a => `<div>• ${a}</div>`).join('')}</div>
         <button class="button" onclick="app.handleRoute('turma-1')">Ver atividades da turma</button>
         <div class="avisos-box">
          <b>Quadro de Avisos:</b>
          <button class="button" style="margin-left:7px;" onclick="app.addAviso()">Adicionar aviso</button>
          <ul id="avisos-ul">${this.data.turmas[0].avisos.map(av => `<li>${av}</li>`).join('')}</ul>
         </div>`
        :
        `<h1>Bem-vindo, ${this.user.name}!</h1>
         <div class="card">Turma: 1º Ano A</div>
         <div class="card">Atividades e avisos:<br>${this.data.turmas[0].avisos.map(a => `<div>• ${a}</div>`).join('')}</div>
         <button class="button" onclick="app.handleRoute('turma-1')">Ver minhas atividades</button>`;
    } else if (route === 'turma-1') {
      const turma = this.data.turmas[0];
      main.innerHTML = `<h2>${turma.nome}</h2>
      <div class="card"><b>Professor:</b> Domenico Sturiale</div>
      <div class="card"><b>Atividades:</b><ul>
      ${turma.atividades.map(aid => {
        const ativ = this.data.atividades.find(at => at.id === aid);
        return `<li>${ativ.titulo} - Entrega até ${ativ.entrega} <button class="button" style="padding:4px 12px;font-size:0.8rem;" onclick="app.verAtividade(${ativ.id})">Ver</button></li>`;
      }).join('')}</ul></div>
      ${this.user.profile === 'professor' ? `<button class="button" onclick="app.addAtividade()">Nova Atividade</button>`:''}
      <button class="button" onclick="app.handleRoute('dashboard')">Voltar</button>`;
    } else if (route === 'suap') {
      main.innerHTML = `<h1>Sincronizar Notas com SUAP</h1>
        <div class="card">Clique no botão para transferir todas as notas da atividade atual para o SUAP.<br>
        <button class="button" onclick="app.sincronizarSuap()">Sincronizar</button>
        </div>
        <button class="button" onclick="app.handleRoute('dashboard')">Voltar</button>`;
    } else if (route === 'logout') {
      sessionStorage.removeItem('loggedUser');
      sessionStorage.removeItem('route');
      window.location = 'login.html';
    }
    return main;
  }
  handleRoute(route) {
    sessionStorage.setItem('route', route);
    this.renderApp();
  }
  // Criação de Avisos (Professor)
  addAviso() {
    const aviso = prompt('Digite o aviso que deseja publicar:');
    if (aviso && aviso.trim().length > 0) {
      this.data.turmas[0].avisos.unshift(aviso.trim());
      this.saveData();
      this.renderApp();
    }
  }
  // Criação de Atividades (Professor)
  addAtividade() {
    const titulo = prompt('Título da Atividade:');
    const entrega = prompt('Data de entrega (aaaa-mm-dd):');
    if (titulo && entrega) {
      const id = Date.now();
      this.data.atividades.push({ id, turmaId: 1, titulo, tipo: "texto", entrega, conteudo: "Nova atividade." });
      this.data.turmas[0].atividades.push(id);
      this.saveData();
      this.renderApp();
    }
  }
  // Visualizar e lançamento de Nota (Professor/Aluno)
  verAtividade(id) {
    const ativ = this.data.atividades.find(a => a.id === id);
    let main = document.querySelector('.main-content');
    main.innerHTML = `<h2>${ativ.titulo}</h2>
     <div class="card">${ativ.conteudo}<br>Entrega até <b>${ativ.entrega}</b></div>
     ${
      this.user.profile === 'professor'
      ? `<button class="button" onclick="app.lancarNota(${id})">Lançar Nota</button>`
      : `<button class="button" onclick="alert('Atividade enviada para o professor!')">Enviar Atividade</button>`
     }
     <button class="button" onclick="app.handleRoute('turma-1')">Voltar</button>`;
  }
  // Lançar Nota (professor)
  lancarNota(atividadeId) {
    const nota = prompt('Digite a nota do aluno (0-10):');
    if(nota && !isNaN(nota)) {
      const alunoId = this.data.users.find(u => u.profile === 'aluno').id;
      let nObj = this.data.notas.find(n => n.atividadeId === atividadeId && n.alunoId === alunoId);
      if (nObj) nObj.nota = Number(nota);
      else this.data.notas.push({ atividadeId, alunoId, nota: Number(nota) });
      this.saveData();
      alert('Nota lançada com sucesso!');
      this.renderApp();
    }
  }
  // Sincronizar notas com SUAP
  sincronizarSuap() {
    alert('Notas enviadas para o SUAP (portal oficial do IFPR)');
  }
}
window.app = new DomenicoClassroomApp();
