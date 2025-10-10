class App {
  constructor() {
    this.init();
  }
  init() {
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
  saveData() { localStorage.NEXUS_DATA = JSON.stringify(this.data); }
  login(email, password) { return this.data.users.find(u => u.email === email && u.password === password) || null; }
  setSession(user) { sessionStorage.setItem('NEXUS_SESSION', JSON.stringify(user)); }
  getSession() { const s = sessionStorage.getItem('NEXUS_SESSION'); return s ? JSON.parse(s) : null; }
  route() {
    const isLogin = location.pathname.endsWith('login.html');
    if (isLogin) this.renderLogin();
    else { const user = this.getSession(); if (!user) location.replace('login.html'); else this.renderApp(); }
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
      <div class="sidebar-header">Domine Português</div>
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
    const links = user.role === 'professor' ?
      [
        { label: 'Turmas', anchor: 'turmas', icon: this.iconClass() },
        { label: 'Apostilas', anchor: 'apostilas', icon: this.iconBook() },
        { label: 'Avaliações', anchor: 'avaliacoes', icon: this.iconCheck() },
        { label: 'Configurações', anchor: 'config', icon: this.iconSettings() }
      ] :
      [
        { label: 'Turmas', anchor: 'turmas', icon: this.iconClass() },
        { label: 'Apostilas', anchor: 'apostilas', icon: this.iconBook() },
        { label: 'Minhas Avaliações', anchor: 'avaliacoes', icon: this.iconCheck() },
        { label: 'Configurações', anchor: 'config', icon: this.iconSettings() }
      ];
    nav.innerHTML = '';
    links.forEach(lk => {
      const a = document.createElement('a');
      a.href = `#${lk.anchor}`;
      a.dataset.anchor = lk.anchor;
      a.innerHTML = `${lk.icon} ${lk.label}`;
      nav.appendChild(a);
    });

    const navigate = () => {
      const hash = location.hash || '#turmas';
      [...nav.children].forEach(link => link.classList.toggle('active', link.dataset.anchor === hash.slice(1)));
      main.innerHTML = '';
      if (hash === '#turmas') this.renderTurmas(main, user);
      else if (hash === '#apostilas') this.renderApostilas(main, user);
      else if (hash === '#avaliacoes') this.renderAvaliacoes(main, user);
      else if (hash === '#config') this.renderConfig(main, user);
      else main.innerHTML = '<p>Página não encontrada.</p>';
    };
    window.onhashchange = navigate;
    navigate();
  }

  // Turmas
  renderTurmas(main, user) {
    main.innerHTML = `<h2 class="main-header">Turmas</h2>`;
    const turmas = user.role === 'professor'
      ? this.data.turmas.filter(t => t.professorId === user.id)
      : this.data.turmas.filter(t => t.alunos.includes(user.id));
    if (!turmas.length) return main.innerHTML += '<p>Nenhuma turma encontrada.</p>';
    const ul = document.createElement('ul');
    ul.className = 'list-reset';
    turmas.forEach(turma => {
      const li = document.createElement('li');
      li.innerHTML = `<b>${turma.name}</b> — <small>${turma.curso}</small>`;
      ul.appendChild(li);
    });
    main.appendChild(ul);
  }

  // Apostilas
  renderApostilas(main, user) {
    main.innerHTML = `<h2 class="main-header">Apostilas</h2>`;
    const turmas = user.role === 'professor'
      ? this.data.turmas.filter(t => t.professorId === user.id)
      : this.data.turmas.filter(t => t.alunos.includes(user.id));
    turmas.forEach(turma => {
      const section = document.createElement('section');
      section.innerHTML = `<div class="section-title">${turma.name}</div>`;
      const ul = document.createElement('ul'); ul.className = 'list-reset';
      turma.apostilas.forEach(apo => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${apo.url}" class="text-link" target="_blank">${apo.titulo}</a> — <small>${apo.descricao}</small>`;
        ul.appendChild(li);
      });
      if (user.role === 'professor') {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = '+ Apostila';
        btn.onclick = () => this.modalApostila(turma, () => this.renderApostilas(main, user));
        section.appendChild(btn);
      }
      section.appendChild(ul);
      main.appendChild(section);
    });
  }

  modalApostila(turma, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `<form>
      <h2>Adicionar Apostila (${turma.name})</h2>
      <div class="form-group"><label>Título</label><input type="text" required /></div>
      <div class="form-group"><label>Descrição</label><input type="text"/></div>
      <div class="form-group"><label>Link (URL PDF)</label><input type="url" required /></div>
      <div class="btn-group">
        <button type="submit" class="btn btn-primary">Salvar</button>
        <button type="button" class="btn btn-danger">Cancelar</button>
      </div>
    </form>`;
    document.body.appendChild(modal.bg);
    modal.form.onsubmit = (e) => {
      e.preventDefault();
      turma.apostilas.push({
        id: 'a' + Date.now(),
        titulo: modal.form[0].value.trim(),
        descricao: modal.form[1].value.trim(),
        url: modal.form[2].value.trim()
      });
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form.querySelector('.btn-danger').onclick = () => document.body.removeChild(modal.bg);
  }

  // Avaliações
  renderAvaliacoes(main, user) {
    main.innerHTML = `<h2 class="main-header">Avaliações</h2>`;
    if (user.role === 'professor') {
      this.data.turmas.filter(t => t.professorId === user.id).forEach(turma => {
        const section = document.createElement('section');
        section.innerHTML = `<div class="section-title">${turma.name}</div>`;
        const table = document.createElement('table');
        table.className = 'table';
        table.innerHTML = `<thead>
          <tr>
            <th>Aluno</th>
            <th>Redação</th>
            <th>Língua</th>
            <th>Interpretação</th>
            <th></th>
          </tr></thead><tbody></tbody>`;
        turma.alunos.forEach(alunoId => {
          const aluno = this.data.alunos.find(a => a.id === alunoId);
          const entrega = this.data.entregas.find(e => e.turmaId === turma.id && e.alunoId === alunoId) || { avaliacao: {} };
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${aluno ? aluno.name : ''}</td>
            <td>${entrega.avaliacao.redacao?.conceito || '-'}<br><small>${entrega.avaliacao.redacao?.feedback || ''}</small></td>
            <td>${entrega.avaliacao.lingua?.conceito || '-'}<br><small>${entrega.avaliacao.lingua?.feedback || ''}</small></td>
            <td>${entrega.avaliacao.interpretacao?.conceito || '-'}<br><small>${entrega.avaliacao.interpretacao?.feedback || ''}</small></td>
            <td><button class="btn btn-primary btn-edit" data-aluno="${aluno.id}" data-turma="${turma.id}">Editar</button></td>
          `;
          table.querySelector('tbody').appendChild(tr);
        });
        section.appendChild(table);
        main.appendChild(section);

        section.querySelectorAll('.btn-edit').forEach(btn => {
          btn.onclick = () => {
            const aluno = this.data.alunos.find(a => a.id === btn.getAttribute('data-aluno'));
            const entrega = this.data.entregas.find(e => e.turmaId === turma.id && e.alunoId === aluno.id) || { alunoId: aluno.id, turmaId: turma.id, avaliacao: {} };
            this.modalAvaliacao(turma, aluno, entrega, () => this.renderAvaliacoes(main, user));
          };
        });
      });
    } else {
      this.data.turmas.filter(t => t.alunos.includes(user.id)).forEach(turma => {
        const entrega = this.data.entregas.find(e => e.turmaId === turma.id && e.alunoId === user.id);
        const section = document.createElement('section');
        section.innerHTML = `<div class="section-title">${turma.name}</div>`;
        if (!entrega) {
          section.innerHTML += `<p>Sem avaliação registrada.</p>`;
        } else {
          ['redacao','lingua','interpretacao'].forEach(campo => {
            const bloco = entrega.avaliacao[campo];
            section.innerHTML += `<div style="margin-bottom:9px;"><b>${campo.charAt(0).toUpperCase()+campo.slice(1)}:</b>
              <span>${bloco?.conceito || '-'}</span><br>
              <small>${bloco?.feedback || ''}</small></div>`;
          });
        }
        main.appendChild(section);
      });
    }
  }

  modalAvaliacao(turma, aluno, entrega, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `
      <form>
        <h2>Avaliar ${aluno.name} — ${turma.name}</h2>
        <div class="form-group"><label>Redação - Conceito</label>
          <select required>
            <option value="">Selecione</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'A' ? 'selected':''}>A</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'B' ? 'selected':''}>B</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'C' ? 'selected':''}>C</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'D' ? 'selected':''}>D</option>
          </select>
        </div>
        <div class="form-group"><label>Feedback Redação</label><input type="text" value="${entrega.avaliacao.redacao?.feedback||''}"></div>
        <div class="form-group"><label>Língua - Conceito</label>
          <select required>
            <option value="">Selecione</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'A' ? 'selected':''}>A</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'B' ? 'selected':''}>B</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'C' ? 'selected':''}>C</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'D' ? 'selected':''}>D</option>
          </select>
        </div>
        <div class="form-group"><label>Feedback Língua</label><input type="text" value="${entrega.avaliacao.lingua?.feedback||''}"></div>
        <div class="form-group"><label>Interpretação - Conceito</label>
          <select required>
            <option value="">Selecione</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'A' ? 'selected':''}>A</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'B' ? 'selected':''}>B</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'C' ? 'selected':''}>C</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'D' ? 'selected':''}>D</option>
          </select>
        </div>
        <div class="form-group"><label>Feedback Interpretação</label><input type="text" value="${entrega.avaliacao.interpretacao?.feedback||''}"></div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Salvar</button>
          <button type="button" class="btn btn-danger">Cancelar</button>
        </div>
      </form>
    `;
    document.body.appendChild(modal.bg);
    modal.form.onsubmit = e => {
      e.preventDefault();
      entrega.avaliacao = {
        redacao:  { conceito: modal.form[0].value, feedback: modal.form[1].value.trim() },
        lingua:   { conceito: modal.form[2].value, feedback: modal.form[3].value.trim() },
        interpretacao: { conceito: modal.form[4].value, feedback: modal.form[5].value.trim() }
      };
      if(!entrega.id) { entrega.id = 'e'+Date.now(); entrega.turmaId = turma.id; entrega.alunoId = aluno.id; this.data.entregas.push(entrega); }
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form.querySelector('.btn-danger').onclick = ()=>document.body.removeChild(modal.bg);
  }

  // Configurações
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

  renderModal() {
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    const modal = document.createElement('div');
    modal.className = 'modal';
    bg.appendChild(modal);
    return {
      bg, modal,
      form: null, get innerHTML() { return modal.innerHTML; },
      set innerHTML(html) { modal.innerHTML = html; this.form = modal.querySelector('form'); }
    };
  }

  iconClass() { return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3l-4 4-4-4"/></svg>`; }
  iconBook() { return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/><path d="M20 6V2a2 2 0 0 0-2-2H6A2 2 0 0 0 4 2v17"/></svg>`; }
  iconCheck() { return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><polyline points="20 6 9 17 4 12"/></svg>`; }
  iconSettings() { return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 00.53-2.6"/></svg>`; }
}

document.addEventListener('DOMContentLoaded', () => { window.NEXUS_APP = new App(); });
