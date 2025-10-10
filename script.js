class App {
  constructor() {
    this.init();
  }

  init() {
    // Carrega dados e configurações
    this.loadData();
    this.theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('theme-dark', this.theme === 'dark');
    document.body.classList.toggle('theme-light', this.theme === 'light');

    this.route();
  }

  // Banco localStorage
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
    return this.data.users.find(u => u.email === email && u.password === password) || null;
  }

  setSession(user) {
    sessionStorage.NEXUS_SESSION = JSON.stringify(user);
  }

  getSession() {
    return sessionStorage.NEXUS_SESSION ? JSON.parse(sessionStorage.NEXUS_SESSION) : null;
  }

  // Roteamento e renderização básica
  route() {
    const isLoginPage = location.pathname.endsWith('login.html');
    if (isLoginPage) this.renderLogin();
    else {
      const user = this.getSession();
      if (!user) location.replace('login.html');
      else this.renderApp();
    }
  }

  /* **************************************
   * LOGIN
   ***************************************/
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

  /* **************************************
   * APP PRINCIPAL
   ***************************************/
  renderApp() {
    this.loadData(); // garante dados atualizados
    const user = this.getSession();
    const app = document.getElementById('app');
    app.innerHTML = '';

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-header">NEXUS</div>
      <div class="sidebar-profile">
        <div class="sidebar-avatar" aria-label="Avatar do usuário">${user.name.charAt(0)}</div>
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

    // Links Sidebar de acordo com o perfil
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

    nav.innerHTML = '';
    links.forEach(lk => {
      const a = document.createElement('a');
      a.href = `#${lk.anchor}`;
      a.dataset.anchor = lk.anchor;
      a.className = '';
      a.innerHTML = `${lk.icon} ${lk.label}`;
      nav.appendChild(a);
    });

    // Navegação SPA hash
    const navigate = () => {
      const h = location.hash || (user.role === 'professor' ? '#admin' : '#turmas');
      [...nav.children].forEach(a => a.classList.toggle('active', a.dataset.anchor === h.slice(1)));
      main.innerHTML = '';

      switch (h) {
        case '#admin':
          if (user.role === 'professor') this.renderAdmin(main, user);
          else main.innerHTML = '<p>Acesso negado.</p>';
          break;
        case '#turmas':
          this.renderTurmas(main, user);
          break;
        case '#config':
          this.renderConfig(main, user);
          break;
        case '#notas':
          if (user.role === 'aluno') this.renderNotas(main, user);
          else main.innerHTML = '<p>Acesso negado.</p>';
          break;
        default:
          if (h.startsWith('#turma_')) {
            const id = h.split('_')[1];
            this.renderTurmaDetalhe(main, user, id);
          } else {
            main.innerHTML = '<p>Página não encontrada.</p>';
          }
      }
    };

    window.onhashchange = navigate;
    navigate();
  }

  /* **************************************
   * ADMIN (PROFESSOR)
   ***************************************/
  renderAdmin(main, user) {
    main.innerHTML = `<h2 class="main-header">Painel de Administração</h2>`;

    // Botão Criar turma
    const voltarBtn = document.createElement('button');
    voltarBtn.className = 'btn btn-primary';
    voltarBtn.textContent = '+ Nova Turma';
    voltarBtn.style.marginBottom = '20px';
    voltarBtn.onclick = () => this.modalTurma(null, user, () => this.renderAdmin(main, user));
    main.appendChild(voltarBtn);

    // Lista turmas da associação
    const turmas = this.data.turmas.filter(t => t.professorId === user.id);
    if (!turmas.length) {
      const p = document.createElement('p');
      p.textContent = 'Nenhuma turma cadastrada ainda.';
      main.appendChild(p);
      return;
    }

    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
      <thead>
        <tr><th>Nome</th><th>Curso</th><th>Alunos</th><th>Ações</th></tr>
      </thead>
      <tbody></tbody>
    `;
    turmas.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.name}</td>
        <td>${t.curso}</td>
        <td>${t.alunos.length}</td>
        <td>
          <button class="btn" data-act="edit" data-id="${t.id}">Editar</button>
          <button class="btn btn-danger" data-act="del" data-id="${t.id}">Excluir</button>
          <button class="btn" data-act="alunos" data-id="${t.id}">Alunos</button>
        </td>
      `;
      table.querySelector('tbody').appendChild(tr);
    });
    main.appendChild(table);

    // Eventos para botões
    table.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        if (btn.dataset.act === 'edit') {
          this.modalTurma(this.data.turmas.find(t => t.id === id), user, () => this.renderAdmin(main, user));
        } else if (btn.dataset.act === 'del') {
          if (confirm('Deseja excluir esta turma e todo o conteúdo?')) {
            this.data.turmas = this.data.turmas.filter(t => t.id !== id);
            this.saveData();
            this.renderAdmin(main, user);
          }
        } else if (btn.dataset.act === 'alunos') {
          this.modalMatricula(id, () => this.renderAdmin(main, user));
        }
      };
    });
  }

  modalTurma(turma, user, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `
      <form>
        <h2>${turma ? 'Editar Turma' : 'Nova Turma'}</h2>
        <div class="form-group">
          <label>Nome</label>
          <input type="text" value="${turma ? turma.name : ''}" required />
        </div>
        <div class="form-group">
          <label>Curso</label>
          <input type="text" value="${turma ? turma.curso : ''}" required />
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">${turma ? 'Salvar' : 'Criar'}</button>
          <button type="button" class="btn btn-danger">Cancelar</button>
        </div>
      </form>
    `;
    document.body.appendChild(modal.bg);
    modal.form.onsubmit = e => {
      e.preventDefault();
      const name = modal.form[0].value.trim();
      const curso = modal.form[1].value.trim();
      if (turma) {
        turma.name = name;
        turma.curso = curso;
      } else {
        let novaTurma = {id: 't'+Date.now(), name, curso, professorId: user.id, alunos: [], modulos: [], apostilas: []};
        this.data.turmas.push(novaTurma);
      }
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form.querySelector('button.btn-danger').onclick = () => document.body.removeChild(modal.bg);
  }

  modalMatricula(turmaId, cb) {
    const turma = this.data.turmas.find(t => t.id === turmaId);
    if (!turma) return;
    const modal = this.renderModal();
    modal.innerHTML = `
      <form>
        <h2>Gerenciar Alunos - ${turma.name}</h2>
        <div style="max-height: 250px; overflow-y: auto;">
          ${this.data.alunos.map(aluno => `
            <label style="display:block; margin-bottom:8px;">
              <input type="checkbox" value="${aluno.id}" ${turma.alunos.includes(aluno.id) ? 'checked' : ''} />
              ${aluno.name} (${aluno.email})
            </label>
          `).join('')}
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Salvar</button> 
          <button type="button" class="btn btn-danger">Cancelar</button>
        </div>
      </form>
    `;
    document.body.appendChild(modal.bg);

    modal.form.onsubmit = e => {
      e.preventDefault();
      const checked = Array.from(modal.form.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
      turma.alunos = checked;
      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };
    modal.form.querySelector('button.btn-danger').onclick = () => document.body.removeChild(modal.bg);
  }

  renderTurmas(main, user) {
    main.innerHTML = `<h2 class="main-header">Minhas Turmas</h2>`;
    const list = document.createElement('ul');
    list.className = 'list-reset';
    const turmas = user.role === 'professor'
      ? this.data.turmas.filter(t => t.professorId === user.id)
      : this.data.turmas.filter(t => t.alunos.includes(user.id));
    if (!turmas.length) {
      main.innerHTML += '<p>Nenhuma turma encontrada.</p>';
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
    if (!turma) {
      main.innerHTML = '<p>Turma não encontrada.</p>';
      return;
    }
    main.innerHTML = `<h2 class="main-header">${turma.name}</h2>`;

    // Apostilas
    if (turma.apostilas && turma.apostilas.length) {
      const apostilasSection = document.createElement('section');
      apostilasSection.style.marginBottom = '32px';
      apostilasSection.innerHTML = `<h3>Apostilas</h3>`;
      const ul = document.createElement('ul');
      ul.className = 'list-reset';
      turma.apostilas.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="text-link" href="${a.url}" target="_blank">${a.titulo}</a> - <small>${a.descricao}</small>`;
        ul.appendChild(li);
      });
      apostilasSection.appendChild(ul);
      if (user.role === 'professor') {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = '+ Gerenciar Apostilas';
        btn.style.marginTop = '12px';
        btn.onclick = () => this.modalGerenciarApostilas(turma, () => this.renderTurmaDetalhe(main, user, turmaId));
        apostilasSection.appendChild(btn);
      }
      main.appendChild(apostilasSection);
    } else if (user.role === 'professor') {
      const section = document.createElement('section');
      section.style.marginBottom = '32px';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = '+ Adicionar Apostila';
      btn.onclick = () => this.modalGerenciarApostilas(turma, () => this.renderTurmaDetalhe(main, user, turmaId));
      section.appendChild(btn);
      main.appendChild(section);
    }

    turma.modulos.forEach(mod => {
      const section = document.createElement('section');
      section.style.marginBottom = '20px';
      const h3 = document.createElement('h3');
      h3.textContent = mod.name;
      section.appendChild(h3);
      if (!mod.conteudos.length) {
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
          if (c.type === 'atividade') text += ` (Entrega: ${c.dataEntrega})`;
          li.textContent = text;
          ul.appendChild(li);
        });
        section.appendChild(ul);
      }
      main.appendChild(section);
    });

    // Avaliações
    if (user.role === 'professor') {
      const avalSection = document.createElement('section');
      avalSection.style.marginTop = '36px';
      avalSection.innerHTML = `<h3>Avaliações e Feedbacks</h3>`;
      const table = document.createElement('table');
      table.className = 'table';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Redação</th>
            <th>Língua</th>
            <th>Interpretação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      turma.alunos.forEach(alunoId => {
        const aluno = this.data.alunos.find(a => a.id === alunoId);
        const entrega = this.data.entregas.find(e => e.turmaId === turmaId && e.alunoId === alunoId) || { avaliacao: {} };
        const tbody = table.querySelector('tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${aluno ? aluno.name : 'Desconhecido'}</td>
          <td><b>${entrega.avaliacao.redacao?.conceito || '-'}</b><br/><small>${entrega.avaliacao.redacao?.feedback || 'Sem feedback'}</small></td>
          <td><b>${entrega.avaliacao.lingua?.conceito || '-'}</b><br/><small>${entrega.avaliacao.lingua?.feedback || 'Sem feedback'}</small></td>
          <td><b>${entrega.avaliacao.interpretacao?.conceito || '-'}</b><br/><small>${entrega.avaliacao.interpretacao?.feedback || 'Sem feedback'}</small></td>
          <td><button class="btn" data-id="${alunoId}">Editar</button></td>
        `;
        tr.querySelector('button').onclick = () => this.modalEditarAvaliacao(turma, aluno, entrega, () => this.renderTurmaDetalhe(main, user, turmaId));
        tbody.appendChild(tr);
      });
      avalSection.appendChild(table);
      main.appendChild(avalSection);
    } else if (user.role === 'aluno') {
      const aval = this.data.entregas.find(e => e.turmaId === turmaId && e.alunoId === user.id);
      const avalSection = document.createElement('section');
      avalSection.style.marginTop = '32px';
      avalSection.innerHTML = `<h3>Minhas Avaliações</h3>`;
      if (!aval) {
        avalSection.innerHTML += `<p>Sem avaliações registradas ainda.</p>`;
      } else {
        const div = document.createElement('div');
        ['redacao', 'lingua', 'interpretacao'].forEach(cat => {
          const conceito = aval.avaliacao[cat]?.conceito || '-';
          const feedback = aval.avaliacao[cat]?.feedback || 'Sem feedback.';
          const p = document.createElement('p');
          p.innerHTML = `<strong>${cat.charAt(0).toUpperCase() + cat.slice(1)}:</strong> ${conceito} <br/> <em>${feedback}</em>`;
          div.appendChild(p);
        });
        avalSection.appendChild(div);
      }
      main.appendChild(avalSection);
    }
  }

  modalGerenciarApostilas(turma, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `
      <form>
        <h2>Gerenciar Apostilas - ${turma.name}</h2>
        <div style="max-height: 260px; overflow-y: auto; margin-bottom:12px;">
          ${turma.apostilas.map(a =>
            `<div style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              <strong>${a.titulo}</strong><br/>
              <small>${a.descricao}</small><br/>
              <a href="${a.url}" target="_blank" class="text-link">${a.url}</a>
              <button type="button" class="btn btn-danger btn-remove" data-id="${a.id}" style="float:right;">Excluir</button>
            </div>`).join('')}
        </div>
        <div class="form-group">
          <label for="apoTitulo">Título da Apostila</label>
          <input id="apoTitulo" type="text" required>
        </div>
        <div class="form-group">
          <label for="apoDescricao">Descrição</label>
          <textarea id="apoDescricao" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="apoUrl">Link (URL da apostila)</label>
          <input id="apoUrl" type="url" required>
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Adicionar / Atualizar</button>
          <button type="button" class="btn btn-danger">Cancelar</button>
        </div>
      </form>`;

    const form = modal.form;
    document.body.appendChild(modal.bg);

    modal.bg.querySelectorAll('.btn-remove').forEach(btn => {
      btn.onclick = () => {
        if (confirm('Excluir esta apostila?')) {
          turma.apostilas = turma.apostilas.filter(a => a.id !== btn.dataset.id);
          this.saveData();
          this.modalGerenciarApostilas(turma, cb);
          document.body.removeChild(modal.bg);
        }
      };
    });

    form.onsubmit = e => {
      e.preventDefault();
      const titulo = form.querySelector('#apoTitulo').value.trim();
      const descricao = form.querySelector('#apoDescricao').value.trim();
      const url = form.querySelector('#apoUrl').value.trim();

      if (!titulo || !url) {
        alert('Título e URL são obrigatórios.');
        return;
      }

      turma.apostilas.push({
        id: 'a' + Date.now(),
        titulo,
        descricao,
        url
      });

      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };

    form.querySelector('.btn-danger').onclick = () => {
      document.body.removeChild(modal.bg);
    };
  }

  modalEditarAvaliacao(turma, aluno, entrega, cb) {
    const modal = this.renderModal();
    modal.innerHTML = `
      <form>
        <h2>Avaliar ${aluno.name} - ${turma.name}</h2>
        <div class="form-group">
          <label for="redacaoC">Redação - Conceito</label>
          <select id="redacaoC" required>
            <option value="">Selecione</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'A' ? 'selected' : ''}>A</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'B' ? 'selected' : ''}>B</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'C' ? 'selected' : ''}>C</option>
            <option ${entrega.avaliacao.redacao?.conceito === 'D' ? 'selected' : ''}>D</option>
          </select>
          <label for="redacaoF">Feedback</label>
          <textarea id="redacaoF" rows="3">${entrega.avaliacao.redacao?.feedback || ''}</textarea>
        </div>

        <div class="form-group">
          <label for="linguaC">Língua - Conceito</label>
          <select id="linguaC" required>
            <option value="">Selecione</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'A' ? 'selected' : ''}>A</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'B' ? 'selected' : ''}>B</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'C' ? 'selected' : ''}>C</option>
            <option ${entrega.avaliacao.lingua?.conceito === 'D' ? 'selected' : ''}>D</option>
          </select>
          <label for="linguaF">Feedback</label>
          <textarea id="linguaF" rows="3">${entrega.avaliacao.lingua?.feedback || ''}</textarea>
        </div>

        <div class="form-group">
          <label for="interpretacaoC">Interpretação - Conceito</label>
          <select id="interpretacaoC" required>
            <option value="">Selecione</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'A' ? 'selected' : ''}>A</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'B' ? 'selected' : ''}>B</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'C' ? 'selected' : ''}>C</option>
            <option ${entrega.avaliacao.interpretacao?.conceito === 'D' ? 'selected' : ''}>D</option>
          </select>
          <label for="interpretacaoF">Feedback</label>
          <textarea id="interpretacaoF" rows="3">${entrega.avaliacao.interpretacao?.feedback || ''}</textarea>
        </div>

        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Salvar Avaliação</button>
          <button type="button" class="btn btn-danger">Cancelar</button>
        </div>
      </form>
    `;
    document.body.appendChild(modal.bg);

    modal.form.onsubmit = e => {
      e.preventDefault();
      const redacaoC = modal.form.querySelector('#redacaoC').value;
      const redacaoF = modal.form.querySelector('#redacaoF').value.trim();
      const linguaC = modal.form.querySelector('#linguaC').value;
      const linguaF = modal.form.querySelector('#linguaF').value.trim();
      const interpretacaoC = modal.form.querySelector('#interpretacaoC').value;
      const interpretacaoF = modal.form.querySelector('#interpretacaoF').value.trim();

      if (!redacaoC || !linguaC || !interpretacaoC) {
        alert('Por favor, selecione todos os conceitos.');
        return;
      }

      entrega.avaliacao = {
        redacao: { conceito: redacaoC, feedback: redacaoF },
        lingua: { conceito: linguaC, feedback: linguaF },
        interpretacao: { conceito: interpretacaoC, feedback: interpretacaoF }
      };

      if (!this.data.entregas.find(e => e.id === entrega.id)) {
        entrega.id = 'e' + Date.now();
        entrega.turmaId = turma.id;
        entrega.alunoId = aluno.id;
        this.data.entregas.push(entrega);
      }

      this.saveData();
      document.body.removeChild(modal.bg);
      cb();
    };

    modal.form.querySelector('.btn-danger').onclick = () => document.body.removeChild(modal.bg);
  }

  // Métodos para ícones no sidebar, mantidos limpos e funcionais
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

document.addEventListener('DOMContentLoaded', () => {
  window.NEXUS_APP = new App();
});
