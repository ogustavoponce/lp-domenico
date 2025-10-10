class App {
  constructor() { this.init(); }
  init() {
    this.loadData();
    document.body.classList.add('theme-light');
    this.route();
  }
  loadData() {
    if (!localStorage.NEXUS_DATA) localStorage.NEXUS_DATA = JSON.stringify(window.NEXUS_DB_SEED);
    this.data = JSON.parse(localStorage.NEXUS_DATA);
  }
  saveData() { localStorage.NEXUS_DATA = JSON.stringify(this.data); }
  login(email, password) { return this.data.users.find(u => u.email === email && u.password === password) || null; }
  setSession(user) { sessionStorage.setItem('NEXUS_SESSION', JSON.stringify(user)); }
  getSession() { const s = sessionStorage.getItem('NEXUS_SESSION'); return s ? JSON.parse(s) : null; }
  route() {
    if (location.pathname.endsWith('login.html')) this.renderLoginCadastro();
    else { const user = this.getSession(); if (!user) location.replace('login.html'); else this.renderApp(); }
  }
  renderLoginCadastro() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errLogin = document.getElementById('loginError');
    const errRegister = document.getElementById('registerError');
    const succRegister = document.getElementById('registerSuccess');
    tabLogin.onclick =()=>{tabLogin.classList.add('tab-active'); tabRegister.classList.remove('tab-active'); loginForm.classList.remove('hidden'); registerForm.classList.add('hidden'); errLogin.textContent=''; errRegister.textContent=''; succRegister.textContent='';};
    tabRegister.onclick =()=>{tabRegister.classList.add('tab-active'); tabLogin.classList.remove('tab-active'); registerForm.classList.remove('hidden'); loginForm.classList.add('hidden'); errLogin.textContent=''; errRegister.textContent=''; succRegister.textContent='';};
    loginForm.onsubmit = e => {e.preventDefault(); const email=loginForm.emailLogin.value.trim(); const pwd=loginForm.passwordLogin.value.trim(); const user=this.login(email,pwd); if(user){this.setSession(user); location.replace('index.html');} else{errLogin.textContent='Usuário ou senha incorretos.';}};
    registerForm.onsubmit = e => {
      e.preventDefault();
      errRegister.textContent=''; succRegister.textContent='';
      const name=registerForm.nameRegister.value.trim(),email=registerForm.emailRegister.value.trim(),pwd=registerForm.passwordRegister.value.trim(),code=registerForm.codeTurma.value.trim();
      if(!name||!email||!pwd||!code) { errRegister.textContent='Preencha todos os campos.'; return;}
      if(this.data.users.some(u=>u.email===email)) { errRegister.textContent='Email já cadastrado.'; return;}
      const turma=this.data.turmas.find(t=>t.code===code); if(!turma) {errRegister.textContent='Código da turma inválido.'; return;}
      const id='u'+Date.now(); const aluno={id,email,password:pwd,name,role:'aluno'}; this.data.users.push(aluno); this.data.alunos.push({id,name,email}); turma.alunos.push(id); this.saveData(); succRegister.textContent='Cadastro realizado! Faça login.'; registerForm.reset();
    }; tabLogin.click();
  }
  renderApp() {
    this.loadData(); const user=this.getSession(); const app=document.getElementById('app'); app.innerHTML='';
    const sidebar=document.createElement('aside');
    sidebar.className='sidebar'; sidebar.innerHTML=`
      <div class="sidebar-header">Domine Português</div>
      <div class="sidebar-profile">
        <div class="sidebar-avatar">${user.name.charAt(0)}</div>
        <div><div class="sidebar-info">${user.name}</div>
        <div class="sidebar-info-small">${user.role==='professor'?'Professor':'Aluno'}</div></div></div>
      <nav class="sidebar-nav"></nav>
    `; app.appendChild(sidebar);
    const main=document.createElement('main'); main.className='main-content'; app.appendChild(main);
    const nav=sidebar.querySelector('.sidebar-nav');
    const links=user.role==='professor'
      ?[{label:'Turmas',anchor:'turmas',icon:this.iconClass()},{label:'Apostilas',anchor:'apostilas',icon:this.iconBook()},{label:'Avaliações',anchor:'avaliacoes',icon:this.iconCheck()},{label:'Administração',anchor:'admin',icon:this.iconSettings()},{label:'Configurações',anchor:'config',icon:this.iconUser()}]
      :[{label:'Minhas Turmas',anchor:'turmas',icon:this.iconClass()},{label:'Apostilas',anchor:'apostilas',icon:this.iconBook()},{label:'Avaliações',anchor:'avaliacoes',icon:this.iconCheck()},{label:'Configurações',anchor:'config',icon:this.iconUser()}];
    nav.innerHTML=''; links.forEach(lk=>{const a=document.createElement('a');a.href=`#${lk.anchor}`;a.dataset.anchor=lk.anchor;a.innerHTML=`${lk.icon} ${lk.label}`;nav.appendChild(a);});
    const navigate=()=>{const hash=location.hash||'#turmas';[...nav.children].forEach(link=>link.classList.toggle('active',link.dataset.anchor===hash.slice(1)));main.innerHTML='';switch(hash){case'#turmas':this.renderTurmas(main,user);break;case'#apostilas':this.renderApostilas(main,user);break;case'#avaliacoes':this.renderAvaliacoes(main,user);break;case'#admin':if(user.role==='professor')this.renderAdmin(main,user);else main.innerHTML='<p>Acesso negado</p>';break;case'#config':this.renderConfig(main,user);break;default:main.innerHTML='<p>Página não encontrada</p>';}};window.onhashchange=navigate;navigate();}
  // Ícones
  iconClass(){return`<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3l-4 4-4-4"/></svg>`;}
  iconBook(){return`<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/><path d="M20 6V2a2 2 0 0 0-2-2H6A2 2 0 0 0 4 2v17"/></svg>`;}
  iconCheck(){return`<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><polyline points="20 6 9 17 4 12"/></svg>`;}
  iconSettings(){return`<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 00.53-2.6"/></svg>`;}
  iconUser(){return`<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><circle cx="12" cy="7" r="4"/></svg>`;}

  // Métodos auxiliares robustos (CRUD turmas, apostilas, avaliações, configs etc.) podem ser detalhados conforme fluxo
}
document.addEventListener('DOMContentLoaded',()=>{window.NEXUS_APP=new App();});
