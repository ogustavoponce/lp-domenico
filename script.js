class App {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('domenicoClassroom'));
    this.isLogin = !!document.getElementById('loginForm');
    if (this.isLogin) this.initLogin();
    else this.initSPA();
  }
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
        let err = document.getElementById('loginError');
        err.textContent = "Email ou senha inválidos";
        err.style.display = "block";
        setTimeout(() => err.style.display = "none", 4200);
      }
    }
  }
  initSPA() {
    let user = sessionStorage.getItem('loggedUser');
    if (!user) { window.location = 'login.html'; return; }
    this.user = JSON.parse(user);
    this.route = "dashboard";
    this.render();
  }
  setRoute(r) { this.route = r; this.render(); }
  render() {
    const app = document.getElementById('app'); app.innerHTML = '';
    app.appendChild(this.renderSidebar());
    app.appendChild(this.renderMain());
  }
  renderSidebar() {
    let sb = document.createElement('div'); sb.className = 'sidebar';
    sb.innerHTML = `
      <div class="logo-area"><span class="logo-classroom material-icons">school</span><h1>Classroom+</h1></div>
      <nav class="side-menu"></nav>
      <div class="menu-footer">
        <div class="user-avatar">${this.user.avatar}</div>
        <div class="user-name">${this.user.name}</div>
      </div>
    `;
    const nav = sb.querySelector('.side-menu');
    if (this.user.profile === 'professor') {
      nav.innerHTML = `
        <button class="side-link${this.route==='dashboard'?' active':''}" onclick="app.setRoute('dashboard')"><span class="material-icons">home</span>Meus Painéis</button>
        <button class="side-link${this.route==='admin'?' active':''}" onclick="app.setRoute('admin')"><span class="material-icons">manage_accounts</span>Admin</button>
        ${this.data.turmas.map((t,i)=>`
        <button class="side-link${this.route==='turma'+t.id?' active':''}" onclick="app.setRoute('turma${t.id}')"><span class="material-icons">class</span>${t.nome}</button>
        `).join('')}
        <button class="side-link" onclick="app.logout()"><span class="material-icons">logout</span>Sair</button>
      `;
    } else {
      nav.innerHTML = `
        <button class="side-link${this.route==='dashboard'?' active':''}" onclick="app.setRoute('dashboard')"><span class="material-icons">home</span>Painel</button>
        <button class="side-link${this.route==='turma'?' active':''}" onclick="app.setRoute('turma')"><span class="material-icons">class</span>Turma</button>
        <button class="side-link${this.route==='atividades'?' active':''}" onclick="app.setRoute('atividades')"><span class="material-icons">assignment</span>Atividades</button>
        <button class="side-link${this.route==='arquivos'?' active':''}" onclick="app.setRoute('arquivos')"><span class="material-icons">folder</span>Arquivos</button>
        <button class="side-link" onclick="app.logout()"><span class="material-icons">logout</span>Sair</button>
      `;
    }
    return sb;
  }
  renderMain() {
    let m = document.createElement('div'); m.className = 'main';
    m.appendChild(this.renderTopbar());
    if (this.user.profile === 'professor') {
      if (this.route === 'dashboard') {
        m.innerHTML += `<div class="cards">` +
          this.data.turmas.map(t=>`
            <div class="turma-card" style="border-left:8px solid ${t.cor};">
              <div class="turma-title">${t.nome}</div>
              <div class="turma-prof">Professor: ${this.user.name}</div>
              <div class="turma-desc">Alunos: ${this.data.users.filter(u=>u.turmaId===t.id).length}</div>
              <button class="turma-btn" onclick="app.setRoute('turma'+t.id)">Acessar Turma</button>
            </div>
          `).join('') + `</div>`;
      }
      else if (this.route.startsWith('turma')) {
        let turmaId = Number(this.route.slice(5)), turma = this.data.turmas.find(t=>t.id===turmaId);
        m.innerHTML += `<div class="mural-card"><strong>Mural:</strong><br>` +
        this.data.mural.filter(a=>a.turmaId===turmaId).map(a=>`<div><b>${a.autor}</b>: ${a.msg} <i style="color:#64748b; font-size:.93em;">[${a.ts}]</i></div>`).join("") +
        `<form onsubmit="app.addAviso(event,${turmaId})" style="margin-top:9px;">
           <input style="width:70%" placeholder="Novo aviso" id="avisoMsg">
           <button class="atividade-btn" type="submit">Publicar</button>
         </form></div>
        <div class="mural-card"><strong>Atividades:</strong><br>` +
         this.data.atividades.filter(a=>a.turmaId===turmaId).map(a=>
          `<div class="atividade-card"><div class="atividade-title">${a.titulo}</div><div>${a.descricao}</div>
           <div>Entrega: <b>${a.entrega}</b></div>
           <button class="atividade-btn" onclick="app.lancarNota(${a.id},${turmaId})">Lançar Nota</button></div>`
         ).join("") +
        `<form onsubmit="app.addAtividade(event,${turmaId})" style="margin-top:7px;">
           <input style="width:45%" placeholder="Nova atividade" id="ativTitulo">
           <input style="width:30%" placeholder="Entrega (2025-10-15)" id="ativEntrega">
           <button class="atividade-btn" type="submit">Criar</button>
         </form></div>
        <div class="mural-card"><strong>Arquivos:</strong><br>`+
         this.data.arquivos.filter(a=>a.turmaId===turmaId).map(f=>`<div>${f.nome}</div>`).join("") +
        `<form onsubmit="app.addArquivo(event,${turmaId})" style="margin-top:7px;">
           <input style="width:55%" placeholder="Novo arquivo" id="arqNome">
           <button class="atividade-btn" type="submit">Adicionar</button>
         </form></div>`
      }
      else if(this.route === 'admin') m.innerHTML += this.renderAdmin();
    }
    else {
      let turma = this.data.turmas.find(t=>t.id===this.user.turmaId);
      if (!turma) { m.innerHTML += `<div class="mural-card">Erro: sem turma atribuída.</div>`; return m; }
      if(this.route==='dashboard') {
        m.innerHTML += `<div class="mural-card"><strong>Bem-vindo à sua turma!</strong><br>${turma.nome}</div>
          <div class="mural-card"><b>Mural:</b><br>` +
          this.data.mural.filter(a=>a.turmaId===turma.id).map(a=>`<div><b>${a.autor}</b>: ${a.msg} <i style="color:#64748b;font-size:.93em;">[${a.ts}]</i></div>`).join("") + `</div>`;
      }
      else if(this.route==='turma' || this.route==='atividades'){
        m.innerHTML += `<div class="mural-card"><b>Atividades:</b><br>` +
        this.data.atividades.filter(a=>a.turmaId===turma.id).map(a=>
          `<div class="atividade-card"><div class="atividade-title">${a.titulo}</div><div>${a.descricao}</div>Entrega: <b>${a.entrega}</b>
           <button class="atividade-btn" onclick="app.entregarAtiv(${a.id})">Enviar Resposta</button>
          </div>`
        ).join("")+`</div>`;
      }
      else if(this.route==='arquivos'){
        m.innerHTML += `<div class="mural-card"><b>Arquivos:</b><br>`+
        this.data.arquivos.filter(a=>a.turmaId===turma.id).map(f=>`<div>${f.nome}</div>`).join("");
      }
    }
    return m;
  }
  renderTopbar() {
    let div = document.createElement('div'); div.className = "topbar";
    div.innerHTML = `<span class="top-title">${this.user.profile==='professor'?'Professor':'Aluno'} - ${this.user.name}</span>
      <button class="logout-btn" onclick="app.logout()">Sair</button>`;
    return div;
  }
  renderAdmin() {
    let alunos = this.data.users.filter(u=>u.profile==='aluno');
    let tbl = `<div class="admin-panel"><div class="admin-title">Gestão de Alunos</div>
        <table class="admin-table"><tr><th>Nome</th><th>Email</th><th>Turma</th><th></th></tr>
        ${alunos.map(a=>{
          let turma = this.data.turmas.find(t=>t.id===a.turmaId);
          return `<tr>
            <td>${a.name}</td>
            <td>${a.email}</td>
            <td>${turma?turma.nome:'-'}</td>
            <td>
              <button class="admin-action" onclick="app.removeAluno('${a.email}')"><span class="material-icons">person_remove</span></button>
            </td>
          </tr>`;
        }).join("")}</table>
        <form class="add-aluno-form" onsubmit="app.addAluno(event)">
           <input placeholder="Nome" id="novoNome" required>
           <input placeholder="Email" id="novoEmail" required>
           <select id="novoTurma" required>
              ${this.data.turmas.map(t=>`<option value="${t.id}">${t.nome}</option>`).join('')}
           </select>
           <button type="submit"><span class="material-icons">person_add</span>Adicionar</button>
        </form></div>`;
    return tbl;
  }
  addAluno(e) {
    e.preventDefault();
    let nome = document.getElementById('novoNome').value.trim();
    let email = document.getElementById('novoEmail').value.trim().toLowerCase();
    let turmaId = Number(document.getElementById('novoTurma').value);
    if (!nome || !email) return;
    if (this.data.users.find(u=>u.email===email)) { alert("Email já cadastrado!"); return; }
    this.data.users.push({
      id: Date.now(), email, password: "12345", profile: "aluno", name: nome, avatar: nome[0].toUpperCase(), turmaId
    });
    this.save(); alert("Aluno cadastrado!");
    this.setRoute("admin");
  }
  removeAluno(email) {
    if (!confirm("Remover este aluno?")) return;
    this.data.users = this.data.users.filter(u=>u.email!==email);
    this.save(); this.setRoute("admin");
  }
  addAviso(e, turmaId) {
    e.preventDefault();
    let msg = document.getElementById('avisoMsg').value;
    if(msg.trim()){this.data.mural.unshift({turmaId,autor:this.user.name,msg,ts:"Agora"});this.save();this.render();}
  }
  addAtividade(e, turmaId) {
    e.preventDefault();
    let titulo = document.getElementById('ativTitulo').value, entrega = document.getElementById('ativEntrega').value;
    if(!titulo||!entrega)return;
    this.data.atividades.push({id:Date.now(),turmaId,titulo,entrega,descricao:"Atividade criada.",tipo:"texto"});
    this.save(); this.setRoute('turma'+turmaId);
  }
  addArquivo(e, turmaId) {
    e.preventDefault(); let nome = document.getElementById('arqNome').value;
    if(!nome.trim())return;
    this.data.arquivos.unshift({turmaId, nome: nome.trim()});
    this.save(); this.setRoute('turma'+turmaId);
  }
  entregarAtiv(ativId){alert('Resposta enviada!');}
  lancarNota(ativId, turmaId){alert('Nota lançada!');}
  save(){localStorage.setItem('domenicoClassroom',JSON.stringify(this.data));}
  logout(){sessionStorage.removeItem('loggedUser');window.location="login.html";}
}
window.app = new App();
