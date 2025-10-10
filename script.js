// script.js — Classe App de lógica da plataforma Nexus

class App {
  constructor() {
    this.loadData();
    this.route();
    this.theme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('theme-dark', this.theme === 'dark');
    document.body.classList.toggle('theme-light', this.theme === 'light');
  }

  // Carrega e sincroniza estado do "banco"
  loadData() {
    if (!localStorage.NEXUS_DATA) {
      localStorage.NEXUS_DATA = JSON.stringify(window.NEXUS_DB_SEED);
    }
    this.data = JSON.parse(localStorage.NEXUS_DATA);
  }
  saveData() {
    localStorage.NEXUS_DATA = JSON.stringify(this.data);
  }

  // Autenticação
  login(email, password) {
    const user = this.data.users.find(u => u.email === email && u.password === password);
    return user || null;
  }
  setSession(user) {
    sessionStorage.NEXUS_SESSION = JSON.stringify(user);
  }
  getSession() {
    return sessionStorage.NEXUS_SESSION ? JSON.parse(sessionStorage.NEXUS_SESSION) : null;
  }

  // Roteamento
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

  // ---------------- PÁGINA DE LOGIN ----------------
  renderLogin() {
    document.getElementById('loginForm').onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const user = this.login(email, password);
      const errorMsg = document.getElementById('loginError');

      if (user) {
        this.setSession(user);
        location.replace('index.html');
      } else {
        errorMsg.textContent = 'Usuário ou senha incorretos.';
      }
    };
  }

  // ---------------- SPA PRINCIPAL ----------------
  renderApp() {
    this.loadData(); // Recarrega em cada navegação
    const user = this.getSession();
    const appEl = document.getElementById('app');
    appEl.innerHTML = "";

    // Sidebar Principal
    const sidebar = document.createElement('nav');
    sidebar.className = 'nexus-sidebar';

    const main = document.createElement('section');
    main.className = 'nexus-main';

    // Sidebar Links
    sidebar.innerHTML = `<h2>Nexus</h2>`;

    if (user.role === 'professor') {
      sidebar.appendChild(this.sidebarLink('Painel de Administração', 'admin'));
      sidebar.appendChild(this.sidebarLink('Minhas Turmas', 'turmas'));
      sidebar.appendChild(this.sidebarLink('Configurações', 'config'));
    } else {
      sidebar.appendChild(this.sidebarLink('Minhas Turmas', 'turmas'));
      sidebar.appendChild(this.sidebarLink('Minhas Notas', 'notas'));
      sidebar.appendChild(this.sidebarLink('Configurações', 'config'));
    }

    appEl.appendChild(sidebar);
    appEl.appendChild(main);

    // Navegação SPA simples usando hash
    const setPage = () => {
      if (!location.hash) {
        location.hash = user.role === 'professor' ? '#admin' : '#turmas';
      }
      [...sidebar.querySelectorAll('.nexus-link')].forEach(l => l.classList.remove('active'));
      sidebar.querySelector(`[data-link="${location.hash.substring(1)}"]`).classList.add('active');
      main.innerHTML = "";
      if (location.hash === '#admin' && user.role === 'professor') this.panelAdmin(main, user);
      if (location.hash === '#turmas') this.panelTurmas(main, user);
      if (location.hash === '#notas' && user.role === 'aluno') this.panelNotas(main, user);
      if (location.hash === '#config') this.panelConfig(main, user);
    };
    window.onhashchange = setPage;
    setPage();
  }

  sidebarLink(label, target) {
    const a = document.createElement('a');
    a.className = 'nexus-link';
    a.href = `#${target}`;
    a.dataset.link = target;
    a.textContent = label;
    return a;
  }

  // ---------------- PAINEL DE ADMIN (PROF) ----------------
  panelAdmin(main, user) {
    const panel = document.createElement('div');
    panel.className = 'nexus-panel';

    panel.innerHTML = `<h1>Painel de Administração</h1>
      <div class="tabs">
        <button class="tab-btn active" data-tab="turmas">Gerenciar Turmas</button>
        <button class="tab-btn" data-tab="alunos">Gerenciar Alunos</button>
      </div>`;

    const content = document.createElement('div');
    panel.appendChild(content);

    let currentTab = 'turmas';
    const switchTab = (tab) => {
      currentTab = tab;
      [...panel.querySelectorAll('.tab-btn')].forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
      content.innerHTML = '';
      if (tab === 'turmas') this.tabGerenciarTurmas(content, user);
      else this.tabGerenciarAlunos(content, user);
    };
    panel.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => switchTab(btn.dataset.tab);
    });
    switchTab(currentTab);

    main.appendChild(panel);
  }

  // Turmas - tabela CRUD turmas
  tabGerenciarTurmas(el, user) {
    const turmas = this.data.turmas.filter(t => t.professorId === user.id);

    el.innerHTML = `<h2>Turmas do Professor</h2>
      <table class="nexus-table">
        <thead><tr>
          <th>Nome</th><th>Curso</th><th>Alunos</th><th>Ações</th>
        </tr></thead>
        <tbody>
          ${turmas.map(t =>
            `<tr>
              <td>${t.name}</td>
              <td>${t.curso}</td>
              <td>${t.alunos.length}</td>
              <td>
                <button class="nexus-btn" data-act="editTurma" data-id="${t.id}">Editar</button>
                <button class="nexus-btn danger" data-act="delTurma" data-id="${t.id}">Excluir</button>
                <button class="nexus-btn" data-act="manageAlunos" data-id="${t.id}">Alunos</button>
              </td>
            </tr>`
          ).join('')}
        </tbody>
      </table>
      <button class="nexus-btn" id="btnAddTurma">+ Nova Turma</button>`;

    el.querySelector("#btnAddTurma").onclick = () => this.modalTurma(null, user, () => this.renderApp());
    el.querySelectorAll("[data-act]").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        if (btn.dataset.act === 'editTurma') this.modalTurma(this.data.turmas.find(t => t.id === id), user, () => this.renderApp());
        if (btn.dataset.act === 'delTurma') {
          if (confirm('Remover turma?')) {
            this.data.turmas = this.data.turmas.filter(t => t.id !== id);
            this.saveData(); this.renderApp();
          }
        }
        if (btn.dataset.act === 'manageAlunos') this.modalMatriculas(id, user, () => this.renderApp());
      };
    });
  }

  // CRUD dialog turma
  modalTurma(turma, user, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `<form>
      <h2>${turma ? 'Editar Turma' : 'Criar Turma'}</h2>
      <label>Nome</label>
      <input type="text" value="${turma ? turma.name : ''}" required />
      <label>Curso</label>
      <input type="text" value="${turma ? turma.curso : ''}" required />
      <div class="nexus-modal-actions">
        <button type="submit" class="nexus-btn">${turma ? 'Salvar' : 'Criar'}</button>
        <button type="button" class="nexus-btn danger">Cancelar</button>
      </div>
    </form>`;
    document.body.appendChild(modal.bg);

    modal.form.onsubmit = (e) => {
      e.preventDefault();
      const name = modal.form[0].value.trim();
      const curso = modal.form[1].value.trim();
      if (turma) {
        turma.name = name; turma.curso = curso;
      } else {
        this.data.turmas.push({ id: 't' + Date.now(), name, curso, professorId: user.id, alunos: [], modulos: [] });
      }
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form[3].onclick = () => document.body.removeChild(modal.bg);
  }

  // CRUD alunos (criar/remover)
  tabGerenciarAlunos(el, user) {
    el.innerHTML = `<h2>Alunos na Plataforma</h2>
      <table class="nexus-table">
        <thead><tr><th>Nome</th><th>E-mail</th><th>Ações</th></tr></thead>
        <tbody>
          ${this.data.alunos.map(a =>
            `<tr>
              <td>${a.name}</td>
              <td>${a.email}</td>
              <td>
                <button class="nexus-btn danger" data-act="delAluno" data-id="${a.id}">Excluir</button>
              </td>
            </tr>`
          ).join('')}
        </tbody>
      </table>
      <button class="nexus-btn" id="btnAddAluno">+ Cadastrar Aluno</button>`;

    el.querySelector("#btnAddAluno").onclick = () => this.modalAluno(null, () => this.renderApp());
    el.querySelectorAll("[data-act=delAluno]").forEach(btn => {
      btn.onclick = () => {
        if (confirm('Excluir aluno permanentemente?')) {
          const id = btn.dataset.id;
          this.data.alunos = this.data.alunos.filter(a => a.id !== id);
          this.data.users = this.data.users.filter(u => u.id !== id);
          this.data.turmas.forEach(t => t.alunos = t.alunos.filter(aid => aid !== id));
          this.saveData(); this.renderApp();
        }
      };
    });
  }

  // Modal de cadastro de aluno
  modalAluno(aluno, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `<form>
      <h2>${aluno ? 'Editar Aluno' : 'Novo Aluno'}</h2>
      <label>Nome</label>
      <input type="text" value="${aluno ? aluno.name : ''}" required />
      <label>E-mail</label>
      <input type="email" value="${aluno ? aluno.email : ''}" required />
      <label>Senha</label>
      <input type="password" value="" required />
      <div class="nexus-modal-actions">
        <button type="submit" class="nexus-btn">${aluno ? 'Salvar' : 'Cadastrar'}</button>
        <button type="button" class="nexus-btn danger">Cancelar</button>
      </div>
    </form>`;
    document.body.appendChild(modal.bg);
    modal.form.onsubmit = (e) => {
      e.preventDefault();
      const name = modal.form[0].value.trim();
      const email = modal.form[1].value.trim();
      const password = modal.form[2].value.trim();
      if (aluno) {
        aluno.name = name; aluno.email = email;
        const user = this.data.users.find(u => u.id === aluno.id);
        if (user) { user.email = email; user.name = name; user.password = password; }
      } else {
        const id = 'u' + Date.now();
        this.data.alunos.push({ id, name, email });
        this.data.users.push({ id, name, email, password, role: 'aluno' });
      }
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form[4].onclick = () => document.body.removeChild(modal.bg);
  }

  // Matricular/desmatricular alunos em turma via modal
  modalMatriculas(turmaId, user, cb) {
    const turma = this.data.turmas.find(t => t.id === turmaId);
    const allAlunos = this.data.alunos;
    const modal = this.renderModal();
    modal.innerHTML = `<form>
      <h2>Matricular Alunos</h2>
      <div style="max-height:220px;overflow-y:auto;">
        ${allAlunos.map(a =>
          `<label>
            <input type="checkbox" value="${a.id}" ${turma.alunos.includes(a.id) ? 'checked' : ''}/>
            ${a.name} (${a.email})
          </label>`
        ).join('')}
      </div>
      <div class="nexus-modal-actions">
        <button type="submit" class="nexus-btn">Salvar</button>
        <button type="button" class="nexus-btn danger">Cancelar</button>
      </div>
    </form>`;
    document.body.appendChild(modal.bg);
    modal.form.onsubmit = (e) => {
      e.preventDefault();
      turma.alunos = Array.from(modal.form.querySelectorAll('input[type=checkbox]:checked')).map(c => c.value);
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form[1].onclick = () => document.body.removeChild(modal.bg);
  }

  // ---------------- PAINEL TURMAS (PROF/ALUNO) ----------------
  panelTurmas(main, user) {
    let turmas;
    if (user.role === 'professor') {
      turmas = this.data.turmas.filter(t => t.professorId === user.id);
    } else {
      turmas = this.data.turmas.filter(t => t.alunos.includes(user.id));
    }

    const panel = document.createElement('div');
    panel.className = 'nexus-panel';
    panel.innerHTML = `<h1>${user.role === 'professor' ? 'Minhas Turmas' : 'Turmas Matriculadas'}</h1>
      <ul style="margin:22px 0 0 0;padding:0;list-style:none;">
        ${turmas.length ? turmas.map(t =>
          `<li>
            <a href="#turma_${t.id}" class="nexus-link">${t.name} <span style="color:var(--accent);font-size:.92em;">(${t.curso})</span></a>
          </li>`
        ).join('') : '<li style="margin-top:16px;color:var(--text-second-dark)">Nenhuma turma encontrada.</li>'}
      </ul>`;
    main.appendChild(panel);

    // SPA navegação interna para turma
    panel.querySelectorAll('.nexus-link').forEach(a => {
      a.onclick = (e) => {
        e.preventDefault();
        location.hash = `turma_${a.href.split('_')[1]}`;
      };
    });

    // Turma selecionada: layout dual columns
    if (location.hash.startsWith('#turma_')) {
      const turmaId = location.hash.split('_')[1];
      const turma = this.data.turmas.find(t => t.id === turmaId);
      if (!turma) { this.panelTurmas(main, user); return; }
      main.innerHTML = "";

      const columns = document.createElement('div');
      columns.className = 'nexus-dual-columns';

      // Coluna 1: Módulos
      const col1 = document.createElement('div');
      col1.className = 'nexus-col1';
      col1.innerHTML = `<h2>Módulos da Turma</h2>
        <ul style="list-style:none;margin:16px 0 0 0;padding:0;">
          ${turma.modulos.map(m =>
            `<li>
              <a href="#" class="nexus-link" data-mod="${m.id}">${m.name}</a>
              ${user.role === 'professor' ? `<button class="nexus-btn danger" style="font-size:0.9em;" data-act="delMod" data-id="${m.id}">-</button>` : ''}
            </li>`
          ).join('')}
        </ul>
        ${user.role === 'professor' ? '<button class="nexus-btn" id="btnAddModulo">+ Novo Módulo</button>' : ''}
      `;
      columns.appendChild(col1);

      // Coluna 2: Conteúdo do módulo
      const col2 = document.createElement('div');
      col2.className = 'nexus-col2';
      columns.appendChild(col2);

      main.appendChild(columns);

      // Seleção de módulo
      let modId = turma.modulos.length ? turma.modulos[0].id : null;
      const renderConteudo = (modIdSel) => {
        modId = modIdSel;
        const modulo = turma.modulos.find(m => m.id === modId);
        if (!modulo) { col2.innerHTML = '<p>Selecione um módulo.</p>'; return; }
        col2.innerHTML = `<h2>${modulo.name}</h2>
          <div style="margin-top:22px;">
            ${modulo.conteudos.length ?
            modulo.conteudos.map(conteudo => this.renderConteudoModulo(conteudo, turma, user)).join('')
            : '<p style="color:var(--text-second-dark);margin:12px 0;">Nenhum conteúdo neste módulo.</p>'}
            ${user.role === 'professor' ?
              `<button class="nexus-btn" id="btnAddTexto">+ Texto</button>
               <button class="nexus-btn" id="btnAddAtividade">+ Atividade</button>
               <button class="nexus-btn" id="btnAddLink">+ Link Externo</button>` : ''}
          </div>`;
        if (user.role === 'professor') {
          col2.querySelector('#btnAddTexto').onclick = () => this.modalConteudo(modulo, 'texto', () => renderConteudo(modId));
          col2.querySelector('#btnAddAtividade').onclick = () => this.modalConteudo(modulo, 'atividade', () => renderConteudo(modId));
          col2.querySelector('#btnAddLink').onclick = () => this.modalConteudo(modulo, 'link', () => renderConteudo(modId));
          col2.querySelectorAll(".nexus-btn.danger[data-act=delCnt]").forEach(b => {
            b.onclick = () => {
              if (confirm('Excluir conteúdo?')) {
                modulo.conteudos = modulo.conteudos.filter(c => c.id !== b.dataset.id);
                this.saveData(); renderConteudo(modId);
              }
            };
          });
        }
      };

      // Inicial: seleciona o primeiro módulo
      col1.querySelectorAll('.nexus-link[data-mod]').forEach(a => {
        a.onclick = (e) => { e.preventDefault(); renderConteudo(a.dataset.mod); };
      });
      if (user.role === 'professor') {
        col1.querySelectorAll('[data-act=delMod]').forEach(btn => {
          btn.onclick = () => {
            if (confirm('Remover módulo?')) {
              turma.modulos = turma.modulos.filter(m => m.id !== btn.dataset.id);
              this.saveData(); this.panelTurmas(main, user);
            }
          };
        });
        col1.querySelector("#btnAddModulo").onclick = () => this.modalModulo(turma, () => this.panelTurmas(main, user));
      }

      if (turma.modulos.length) renderConteudo(modId);
    }
  }

  // Modal de novo módulo
  modalModulo(turma, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `<form>
      <h2>Novo Módulo</h2>
      <label>Nome do Módulo</label>
      <input type="text" required />
      <div class="nexus-modal-actions">
        <button type="submit" class="nexus-btn">Criar</button>
        <button type="button" class="nexus-btn danger">Cancelar</button>
      </div>
    </form>`;
    document.body.appendChild(modal.bg);
    modal.form.onsubmit = (e) => {
      e.preventDefault();
      turma.modulos.push({ id: 'm' + Date.now(), name: modal.form[0].value.trim(), conteudos: [] });
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form[2].onclick = () => document.body.removeChild(modal.bg);
  }

  // Renderização de conteúdo dos módulos
  renderConteudoModulo(conteudo, turma, user) {
    let html = "";
    if (conteudo.type === 'texto') {
      html = `<div style="margin-bottom:18px;padding:14px 18px;background:#007aff14;border-radius:10px;">
        <h3 style="margin-top:0;">${conteudo.titulo}</h3>
        <p style="margin:8px 0 0 0;">${conteudo.texto}</p>
        ${user.role === 'professor' ? `<button class="nexus-btn danger" data-act="delCnt" data-id="${conteudo.id}">Excluir</button>` : ''}
      </div>`;
    }
    if (conteudo.type === 'atividade') {
      html = `<div style="margin-bottom:18px;padding:14px 18px;background:#007aff14;border-radius:10px;">
        <h3 style="margin-top:0;">${conteudo.titulo}</h3>
        <p style="margin:8px 0 0 0;">${conteudo.descricao}</p>
        <small style="color:var(--accent);font-weight:600;">Entrega: ${conteudo.dataEntrega}</small>
        ${user.role === 'professor' ? `<button class="nexus-btn danger" data-act="delCnt" data-id="${conteudo.id}">Excluir</button>` : ''}
      </div>`;
    }
    if (conteudo.type === 'link') {
      html = `<div style="margin-bottom:18px;padding:14px 18px;background:#007aff22;border-radius:10px;">
        <h3 style="margin-top:0;">${conteudo.titulo}</h3>
        <a href="${conteudo.url}" target="_blank" style="color:var(--accent);">Acessar Link</a>
        ${user.role === 'professor' ? `<button class="nexus-btn danger" data-act="delCnt" data-id="${conteudo.id}">Excluir</button>` : ''}
      </div>`;
    }
    return html;
  }

  // Modal de criação de conteúdo
  modalConteudo(modulo, tipo, cb) {
    const modal = this.renderModal();
    let fields = '';
    if (tipo === 'texto') {
      fields = `<label>Título</label><input type="text" required /><label>Texto</label><textarea required rows="3"></textarea>`;
    }
    if (tipo === 'atividade') {
      fields = `<label>Título</label><input type="text" required /><label>Descrição</label><textarea required rows="3"></textarea><label>Data de Entrega</label><input type="date" required />`;
    }
    if (tipo === 'link') {
      fields = `<label>Título</label><input type="text" required /><label>URL</label><input type="url" required />`;
    }
    modal.innerHTML = `<form>
      <h2>Novo Conteúdo: ${tipo[0].toUpperCase() + tipo.slice(1)}</h2>
      ${fields}
      <div class="nexus-modal-actions">
        <button type="submit" class="nexus-btn">Adicionar</button>
        <button type="button" class="nexus-btn danger">Cancelar</button>
      </div>
    </form>`;
    document.body.appendChild(modal.bg);

    modal.form.onsubmit = (e) => {
      e.preventDefault();
      const values = Array.from(modal.form.querySelectorAll('input,textarea')).map(i => i.value.trim());
      const id = 'c' + Date.now();
      if (tipo === 'texto') {
        modulo.conteudos.push({ id, type: 'texto', titulo: values[0], texto: values[1] });
      }
      if (tipo === 'atividade') {
        modulo.conteudos.push({ id, type: 'atividade', titulo: values[0], descricao: values[1], dataEntrega: values[2] });
      }
      if (tipo === 'link') {
        modulo.conteudos.push({ id, type: 'link', titulo: values[0], url: values[1] });
      }
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form.lastElementChild.onclick = () => document.body.removeChild(modal.bg);
  }

  // ---------------- PAINEL NOTAS (ALUNO) ----------------
  panelNotas(main, user) {
    const painel = document.createElement('div');
    painel.className = 'nexus-panel';
    painel.innerHTML = `<h1>Minhas Notas</h1>
      <table class="nexus-table">
        <thead>
          <tr><th>Turma</th><th>Atividade</th><th>Status</th><th>Nota</th></tr>
        </thead>
        <tbody>
          ${this.data.entregas.filter(e => e.alunoId === user.id).map(e => {
            const turma = this.data.turmas.find(t => t.id === e.turmaId);
            const conteudo = turma ? turma.modulos.flatMap(m => m.conteudos).find(c => c.id === e.conteudoId) : null;
            return `<tr>
              <td>${turma ? turma.name : ''}</td>
              <td>${conteudo ? conteudo.titulo : ''}</td>
              <td>${e.status}</td>
              <td>${e.nota != null ? e.nota : '-'}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>`;
    main.appendChild(painel);
  }

  // ---------------- PAINEL CONFIGURAÇÕES ----------------
  panelConfig(main, user) {
    const panel = document.createElement('div');
    panel.className = 'nexus-panel';
    panel.innerHTML = `<h1>Configurações</h1>
      <h2>Perfil</h2>
      <div style="margin-bottom:12px;margin-top:8px;">
        <b>Nome:</b> ${user.name} <br/>
        <b>E-mail:</b> ${user.email} <br/>
        <b>Tipo:</b> ${user.role === 'professor' ? 'Professor' : 'Aluno'}
      </div>
      <h2>Aparência</h2>
      <div style="margin:8px 0 20px;">
        Tema: 
        <button class="nexus-btn" id="btnTemaDark" ${this.theme==='dark'?'style="font-weight:bold;"':''}>Escuro</button>
        <button class="nexus-btn" id="btnTemaLight" ${this.theme==='light'?'style="font-weight:bold;"':''}>Claro</button>
      </div>
      <button class="nexus-btn danger" id="btnLogout">Sair da Plataforma</button>`;

    main.appendChild(panel);

    panel.querySelector('#btnTemaDark').onclick = () => this.setTheme('dark');
    panel.querySelector('#btnTemaLight').onclick = () => this.setTheme('light');
    panel.querySelector('#btnLogout').onclick = () => {
      sessionStorage.removeItem('NEXUS_SESSION');
      location.replace('login.html');
    };
  }
  setTheme(val) {
    this.theme = val;
    localStorage.setItem('theme', val);
    document.body.classList.toggle('theme-dark', val === 'dark');
    document.body.classList.toggle('theme-light', val === 'light');
  }

  // ---------------- Utility: Render Modal ----------------
  renderModal() {
    const bg = document.createElement('div');
    bg.className = 'nexus-modal-bg';
    const modal = document.createElement('div');
    modal.className = 'nexus-modal';
    bg.appendChild(modal);
    return {
      bg,
      modal,
      form: null,
      get innerHTML() { return modal.innerHTML; },
      set innerHTML(html) {
        modal.innerHTML = html;
        this.form = modal.querySelector('form');
      }
    };
  }
}

// Inicialização global segura
document.addEventListener('DOMContentLoaded', () => {
  window.NEXUS_APP = new App();
});
