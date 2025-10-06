class DomenicoClassroomApp {
  constructor() {
    this.state = {route:'dashboard'};
    this.data = JSON.parse(localStorage.getItem('domenicoClassroom'));
    this.isLoginPage = !!document.getElementById('loginForm');
    if(this.isLoginPage) this.initLogin();
    else this.initSPA();
  }
  // Login robusto
  initLogin() {
    document.getElementById('loginForm').onsubmit = (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim().toLowerCase();
      const pass = e.target.password.value.trim();
      const user = this.data.users.find(u=>u.email.toLowerCase()===email && u.password===pass);
      if(user){
        sessionStorage.setItem('loggedUser',JSON.stringify(user));
        window.location="index.html";
      }else{
        const err = document.getElementById('loginError');
        err.textContent = 'Email ou senha inválidos';
        err.style.display='block';
        setTimeout(()=>err.style.display='none',4000);
      }
    };
  }
  // App principal
  initSPA() {
    let raw = sessionStorage.getItem('loggedUser');
    if(!raw){window.location="login.html";return;}
    this.user = JSON.parse(raw);
    this.render();
  }
  setRoute(route){
    this.state.route=route;
    this.render();
  }
  render() {
    const app = document.getElementById('app'); app.innerHTML='';
    app.appendChild(this.renderSidebar());
    app.appendChild(this.renderMain());
  }
  // Sidebar
  renderSidebar() {
    let sidebar=document.createElement('div');
    sidebar.className='sidebar';
    let links = this.user.profile==='professor' ?
      [{txt:'Painel',route:'dashboard'},
       {txt:'Mural de Avisos',route:'avisos'},
       {txt:'Atividades',route:'atividades'},
       {txt:'Arquivos',route:'arquivos'},
       {txt:'Notas e SUAP',route:'suap'},
       {txt:'Sair',route:'logout'}]
      : [{txt:'Painel',route:'dashboard'},
         {txt:'Mural',route:'avisos'},
         {txt:'Minhas Atividades',route:'atividades'},
         {txt:'Arquivos',route:'arquivos'},
         {txt:'Minhas Notas',route:'notas'},
         {txt:'Sair',route:'logout'}];
    links.forEach(l=>{
      let btn=document.createElement('button');
      btn.className='nav-item'+(this.state.route===l.route?' active':'');
      btn.textContent=l.txt;
      btn.onclick=()=>this.setRoute(l.route);
      sidebar.appendChild(btn);
    });
    return sidebar;
  }
  // Topbar
  renderTopbar() {
    let bar=document.createElement('div');
    bar.className='topbar';
    bar.innerHTML = `<div class="userbox">
      <div class="avatar">${this.user.avatar}</div>
      <span class="user-name">${this.user.name}</span>
      <span class="user-role">${this.user.profile==='professor'?'Professor':'Aluno'}</span>
      <button class="logout-btn" onclick="app.setRoute('logout')">Sair</button>
    </div>`;
    return bar;
  }
  // Main content - separa por route
  renderMain() {
    let cont=document.createElement('div');
    cont.className='main-content';
    cont.appendChild(this.renderTopbar());
    let turma = this.data.turmas[0], user=this.user;
    if(this.state.route==='dashboard'){
      cont.innerHTML+=user.profile==='professor'?
        `<div class="card card-title">Bem-vindo, ${user.name}!</div>
         <div class="card">Turma: ${turma.nome}</div>
         <div class="card"><b>Mural:</b> ${turma.avisos[0].txt}</div>
         <div class="card">Atividades Pendentes: ${turma.atividades.map(a=>a.titulo).join(", ")}</div>`
       :`<div class="card card-title">Olá, ${user.name}!</div>
         <div class="card">Turma: ${turma.nome}</div>
         <div class="card"><b>Último Aviso:</b> ${turma.avisos[0].txt}</div>
         <div class="card">Minhas Atividades Pendentes: ${turma.atividades.map(a=>a.titulo).join(", ")}</div>`;
    }
    else if(this.state.route==='avisos'){
      cont.innerHTML+=`<div class="avisos-wrap">
       <h2>Mural de Avisos</h2>
       <ul class="avisos-list">${turma.avisos.map(a=>`<li class="avisos-item"><b>${a.user}:</b> ${a.txt} <span style="float:right;color:#bae6fd;">${a.ts}</span></li>`).join('')}</ul>
       ${user.profile==='professor'?`
         <div class="avisos-add-box">
           <input class="avisos-add-input" id="avisoTxt" placeholder="Novo aviso">
           <button class="avisos-add-btn" onclick="app.addAviso()">Publicar</button>
         </div>`:""}
      </div>`;
    }
    else if(this.state.route==='atividades'){
      cont.innerHTML+=`<h2>Atividades da Turma</h2>
      <ul class="atividade-list">
       ${turma.atividades.map(a=>`
         <li class="atividade-item">
          <div class="atividade-left">
            <div class="atividade-title">${a.titulo}</div>
            <div class="atividade-date">Entrega: ${a.entrega}</div>
          </div>
          <button class="atividade-btn" onclick="app.verAtividade(${a.id})">${user.profile==='professor'?'Ver':'Responder'}</button>
         </li>`).join('')}
      </ul>
      ${user.profile==='professor'?`<button class="atividade-btn" style="margin-top:15px;" onclick="app.addAtividade()">Nova Atividade</button>`:""}`;
    }
    else if(this.state.route==='arquivos'){
      cont.innerHTML+=`<div class="files-wrap">
        <div class="files-title">Arquivos da Turma</div>
        <ul>${turma.arquivos.map(f=>`<li>${f}</li>`).join('')}</ul>
        ${user.profile==='professor'?`
           <input type="text" placeholder="Novo arquivo" id="fileInput" style="margin-top:11px;">
           <button class="atividade-btn" onclick="app.addArquivo()">Adicionar</button>
         `:""}
      </div>`;
    }
    else if(this.state.route==='suap'){
      cont.innerHTML+=`<div class="suap-wrap">
        <h2>Lançar notas no SUAP</h2>
        <button class="suap-btn" onclick="app.suapNotas()">Sincronizar Notas</button>
      </div>`;
    }
    else if(this.state.route==='notas'){
      let notas = turma.notas.filter(n=>n.alunoId===user.id);
      cont.innerHTML+=`<h2>Minhas Notas</h2>
        <ul>${notas.map(n=>{
          let atividade = turma.atividades.find(a=>a.id===n.atividadeId);
          return `<li>${atividade.titulo}: <b>${n.nota}</b> (${n.feedback})</li>`;
        }).join('')}</ul>`;
    }
    else if(this.state.route==='logout'){
      sessionStorage.removeItem('loggedUser');window.location="login.html";
    }
    return cont;
  }
  // Aviso: professor
  addAviso() {
    let txt = document.getElementById("avisoTxt").value;
    if(txt.trim()){
      let turma = this.data.turmas[0];
      turma.avisos.unshift({txt, user:this.user.name, ts:"Agora"});
      localStorage.setItem('domenicoClassroom',JSON.stringify(this.data));
      this.setRoute('avisos');
    }
  }
  // Atividade professor
  addAtividade() {
    let titulo=prompt('Título:');let entrega=prompt('Entrega (aaaa-mm-dd):');
    if(titulo&&entrega){
      let turma = this.data.turmas[0];
      let id=Date.now();
      turma.atividades.push({id,titulo,entrega,tipo:"texto",conteudo:"Nova atividade criada."});
      localStorage.setItem('domenicoClassroom',JSON.stringify(this.data));
      this.setRoute('atividades');
    }
  }
  // Arquivo professor
  addArquivo() {
    let nome=document.getElementById('fileInput').value;
    if(nome.trim()){
      let turma = this.data.turmas[0];
      turma.arquivos.unshift(nome.trim());
      localStorage.setItem('domenicoClassroom',JSON.stringify(this.data));
      this.setRoute('arquivos');
    }
  }
  // Atividade ver
  verAtividade(id) {
    let turma=this.data.turmas[0],a=turma.atividades.find(a=>a.id===id);
    let cont=document.querySelector('.main-content');cont.innerHTML='';
    cont.appendChild(this.renderTopbar());
    cont.innerHTML+= `<div class="card card-title">${a.titulo}</div>
      <div class="card">${a.conteudo}<br><b>Entrega até:</b> ${a.entrega}</div>
      ${this.user.profile==='professor'?`
        <button class="atividade-btn" onclick="app.lancarNota(${id})">Lançar Nota</button>
      `:`<button class="atividade-btn" onclick="app.enviarResp(${id})">Enviar Resposta</button>`}
      <button class="atividade-btn" onclick="app.setRoute('atividades')">Voltar</button>`;
  }
  // Lançar nota: professor
  lancarNota(id){
    let nota=prompt('Nota (0-10):');if(!nota||isNaN(nota))return;
    let turma=this.data.turmas[0],aluno=turma.alunos[0];
    let nObj = turma.notas.find(n=>n.atividadeId===id&&n.alunoId===aluno);
    let feedback=prompt('Feedback para o aluno?');
    if(nObj){nObj.nota=Number(nota);nObj.feedback=feedback||'';}
    else turma.notas.push({atividadeId:id,alunoId:aluno,nota:Number(nota),feedback:feedback||''});
    localStorage.setItem('domenicoClassroom',JSON.stringify(this.data));
    alert('Nota lançada!');this.setRoute('atividades');
  }
  // Sincronizar SUAP
  suapNotas(){alert('Notas sincronizadas no SUAP (simulado)!');}
  // Resposta aluno
  enviarResp(id){alert('Resposta enviada ao professor!');}
}
window.app=new DomenicoClassroomApp();
