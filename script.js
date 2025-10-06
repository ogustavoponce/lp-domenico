class EduSupremeApp {
  constructor() {
    this.data = null;
    this.currentUser = null;
    this.currentRoute = '';
    this.theme = 'dark';
    
    this.init();
  }

  async init() {
    this.loadData();
    this.loadTheme();
    
    if (this.isLoginPage()) {
      this.initLogin();
    } else {
      await this.initApp();
    }
  }

  loadData() {
    const data = localStorage.getItem('eduSupremeData');
    this.data = data ? JSON.parse(data) : null;
  }

  saveData() {
    localStorage.setItem('eduSupremeData', JSON.stringify(this.data));
  }

  loadTheme() {
    this.theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  saveTheme() {
    localStorage.setItem('theme', this.theme);
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.saveTheme();
  }

  isLoginPage() {
    return document.body.classList.contains('login-page');
  }

  // ===== LOGIN SYSTEM =====
  initLogin() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      
      const user = this.data.users.find(u => 
        u.email === email && u.password === password
      );

      if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        errorEl.textContent = 'Email ou senha inválidos';
        errorEl.classList.add('show');
        setTimeout(() => errorEl.classList.remove('show'), 5000);
      }
    });
  }

  // ===== APP INITIALIZATION =====
  async initApp() {
    // Verificar autenticação
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
      window.location.href = 'login.html';
      return;
    }

    this.currentUser = JSON.parse(userData);
    
    // Configurar roteamento
    this.setupRouting();
    
    // Renderizar app
    this.render();
    
    // Configurar listeners globais
    this.setupGlobalListeners();
  }

  setupRouting() {
    // Capturar mudanças de rota
    window.addEventListener('popstate', () => this.handleRouteChange());
    
    // Rota inicial
    this.handleRouteChange();
  }

  handleRouteChange() {
    const path = window.location.pathname;
    const hash = window.location.hash.substring(1);
    
    this.currentRoute = hash || 'dashboard';
    this.render();
  }

  navigateTo(route) {
    window.location.hash = route;
    this.currentRoute = route;
    this.render();
  }

  setupGlobalListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch(e.key) {
          case 'k':
            e.preventDefault();
            this.openCommandPalette();
            break;
          case ',':
            e.preventDefault();
            this.navigateTo('settings');
            break;
        }
      }
    });
  }

  // ===== RENDERING SYSTEM =====
  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      ${this.renderSidebar()}
      ${this.renderMainContent()}
    `;
    
    // Configurar event listeners após renderização
    this.setupEventListeners();
  }

  renderSidebar() {
    const navigation = this.getNavigationItems();
    
    return `
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M8 12h16v2H8zm0 4h12v2H8zm0 4h8v2H8z" fill="white"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            <h1>EduSuprema</h1>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${navigation.map(section => `
            <div class="nav-section">
              <div class="nav-section-title">${section.title}</div>
              <div class="nav-items">
                ${section.items.map(item => `
                  <div class="nav-item ${this.currentRoute === item.route ? 'active' : ''}" 
                       data-route="${item.route}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="${item.icon}"/>
                    </svg>
                    <span>${item.name}</span>
                    ${item.badge ? `<span class="badge badge-${item.badge.type}">${item.badge.text}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile" data-action="user-menu">
            <div class="user-avatar">${this.currentUser.avatar}</div>
            <div class="user-info">
              <h4>${this.currentUser.name}</h4>
              <p>${this.currentUser.profile === 'professor' ? 'Professor' : 'Estudante'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMainContent() {
    const content = this.getRouteContent();
    
    return `
      <div class="main-content">
        <div class="content-header">
          <h1 class="content-title">${content.title}</h1>
          <p class="content-subtitle">${content.subtitle}</p>
        </div>
        <div class="content-body">
          ${content.body}
        </div>
      </div>
    `;
  }

  getNavigationItems() {
    const baseItems = [
      {
        title: "Principal",
        items: [
          { name: "Dashboard", route: "dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }
        ]
      }
    ];

    if (this.currentUser.profile === 'professor') {
      baseItems.push({
        title: "Ensino",
        items: [
          { name: "Meus Cursos", route: "courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
          { name: "Estudantes", route: "students", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a.75.75 0 01-.75.75H21A2.25 2.25 0 0118.75 15H18a.75.75 0 01-.75-.75 2.25 2.25 0 012.25-2.25H21a.75.75 0 01.75.75z" },
          { name: "Analytics", route: "analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
        ]
      });
    } else {
      baseItems.push({
        title: "Aprendizagem",
        items: [
          { name: "Meus Cursos", route: "my-courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
          { name: "Explorar", route: "explore", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
          { name: "Progresso", route: "progress", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
          { 
            name: "Badges", 
            route: "badges", 
            icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
            badge: { type: "success", text: "3" }
          }
        ]
      });
    }

    // Notificações com contador
    const unreadNotifications = this.data.notifications.filter(n => 
      n.userId === this.currentUser.id && !n.read
    ).length;

    baseItems.push({
      title: "Conta",
      items: [
        { 
          name: "Notificações", 
          route: "notifications", 
          icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
          badge: unreadNotifications > 0 ? { type: "warning", text: unreadNotifications.toString() } : null
        },
        { name: "Configurações", route: "settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
      ]
    });

    return baseItems;
  }

  getRouteContent() {
    switch (this.currentRoute) {
      case 'dashboard':
        return {
          title: `Olá, ${this.currentUser.name.split(' ')[0]}! 👋`,
          subtitle: "Aqui está um resumo da sua atividade hoje",
          body: this.renderDashboard()
        };
      case 'my-courses':
        return {
          title: "Meus Cursos",
          subtitle: "Continue de onde parou ou explore novos conteúdos",
          body: this.renderMyCourses()
        };
      case 'badges':
        return {
          title: "Badges & Conquistas",
          subtitle: "Suas conquistas e progresso na plataforma",
          body: this.renderBadges()
        };
      case 'settings':
        return {
          title: "Configurações",
          subtitle: "Personalize sua experiência na plataforma",
          body: this.renderSettings()
        };
      default:
        return {
          title: "Página em Construção",
          subtitle: "Esta funcionalidade está sendo desenvolvida",
          body: this.renderComingSoon()
        };
    }
  }

  // ===== DASHBOARD =====
  renderDashboard() {
    const stats = this.getDashboardStats();
    const recentActivity = this.getRecentActivity();
    const recommendedCourses = this.getRecommendedCourses();

    return `
      <div class="card-grid animate-fade-in">
        ${stats.map(stat => `
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">${stat.title}</span>
              <svg class="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="${stat.icon}"/>
              </svg>
            </div>
            <div class="stat-value">${stat.value}</div>
            <div class="stat-change ${stat.change >= 0 ? 'positive' : 'negative'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="${stat.change >= 0 ? 'm7 14l5-5 5 5' : 'm17 10l-5 5-5-5'}"/>
              </svg>
              <span>${Math.abs(stat.change)}% vs semana passada</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6); margin-top: var(--space-6);">
        <div class="card">
          <h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">Progresso Semanal</h3>
          <div class="chart-container">
            📊 Gráfico de progresso (Em desenvolvimento)
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">Atividade Recente</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${recentActivity.map(activity => `
              <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2); border-radius: var(--radius-md); background: var(--bg-tertiary);">
                <span style="font-size: 1.5rem;">${activity.icon}</span>
                <div style="flex: 1;">
                  <div style="font-weight: var(--font-weight-medium); color: var(--text-primary); font-size: 0.875rem;">${activity.title}</div>
                  <div style="color: var(--text-tertiary); font-size: 0.75rem;">${activity.time}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: var(--space-6);">
        <h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">Continue Aprendendo</h3>
        <div class="learning-path">
          ${recommendedCourses.map((course, index) => `
            <div class="path-item ${course.status}" data-course="${course.id}">
              <div class="path-step">${index + 1}</div>
              <div class="path-content" style="flex: 1;">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div style="display: flex; align-items: center; gap: var(--space-4); margin-top: var(--space-2);">
                  <span class="badge badge-${course.level === 'Básico' ? 'success' : course.level === 'Intermediário' ? 'warning' : 'primary'}">${course.level}</span>
                  <span style="color: var(--text-tertiary); font-size: 0.75rem;">${course.duration}</span>
                  <div style="flex: 1;">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                  </div>
                  <span style="color: var(--text-tertiary); font-size: 0.75rem;">${course.progress}%</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getDashboardStats() {
    if (this.currentUser.profile === 'professor') {
      return [
        { title: "Cursos Criados", value: this.currentUser.stats.coursesCreated, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253", change: 8.2 },
        { title: "Estudantes", value: this.currentUser.stats.studentsImpacted, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197", change: 12.4 },
        { title: "Avaliação Média", value: this.currentUser.stats.averageRating.toFixed(1), icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", change: 4.1 },
        { title: "Horas de Conteúdo", value: "156h", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", change: 15.3 }
      ];
    } else {
      const userProgress = this.data.analytics.userProgress[this.currentUser.id];
      return [
        { title: "Cursos Concluídos", value: this.currentUser.stats.coursesCompleted, icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806", change: 25.0 },
        { title: "Horas Estudadas", value: this.currentUser.stats.hoursStudied + "h", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", change: 18.7 },
        { title: "Média Geral", value: this.currentUser.stats.averageGrade.toFixed(1), icon: "M13 10V3L4 14h7v7l9-11h-7z", change: 8.9 },
        { title: "Sequência Atual", value: userProgress.dailyStreak + " dias", icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z", change: 12.5 }
      ];
    }
  }

  getRecentActivity() {
    return [
      { icon: "🎯", title: "Completou: Análise de Complexidade", time: "2 horas atrás" },
      { icon: "⭐", title: "Ganhou badge: Alto Desempenho", time: "1 dia atrás" },
      { icon: "📚", title: "Iniciou: Design Systems", time: "2 dias atrás" },
      { icon: "💬", title: "Comentou em: Algoritmos", time: "3 dias atrás" }
    ];
  }

  getRecommendedCourses() {
    return this.data.courses.map(course => ({
      ...course,
      status: course.progress > 0 ? (course.progress === 100 ? 'completed' : 'active') : 'locked'
    }));
  }

  // ===== COURSES =====
  renderMyCourses() {
    const enrolledCourses = this.data.courses.filter(course => 
      course.students.includes(this.currentUser.id)
    );

    return `
      <div class="card-grid animate-fade-in">
        ${enrolledCourses.map(course => `
          <div class="card" style="cursor: pointer; transition: transform var(--transition-fast);" 
               onmouseover="this.style.transform='translateY(-4px)'" 
               onmouseout="this.style.transform='translateY(0)'"
               data-course="${course.id}">
            <div style="aspect-ratio: 16/9; background: var(--accent-gradient); border-radius: var(--radius-md); margin-bottom: var(--space-4); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
              📚
            </div>
            <h3 style="margin-bottom: var(--space-2); color: var(--text-primary);">${course.title}</h3>
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); line-height: 1.5;">${course.description}</p>
            
            <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-4);">
              <span class="badge badge-${course.level === 'Básico' ? 'success' : course.level === 'Intermediário' ? 'warning' : 'primary'}">${course.level}</span>
              <span style="color: var(--text-tertiary); font-size: 0.75rem;">⏱️ ${course.duration}</span>
              <span style="color: var(--text-tertiary); font-size: 0.75rem;">⭐ ${course.rating}</span>
            </div>

            <div style="margin-bottom: var(--space-4);">
              <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                <span style="font-size: 0.875rem; color: var(--text-secondary);">Progresso</span>
                <span style="font-size: 0.875rem; color: var(--text-primary); font-weight: var(--font-weight-medium);">${course.progress}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${course.progress}%"></div>
              </div>
            </div>

            <button class="btn btn-secondary" style="width: 100%;">
              ${course.progress === 0 ? 'Começar Curso' : course.progress === 100 ? 'Revisar' : 'Continuar'}
            </button>
          </div>
        `).join('')}
      </div>

      ${enrolledCourses.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-12);">
          <div style="font-size: 4rem; margin-bottom: var(--space-4);">📚</div>
          <h3 style="margin-bottom: var(--space-2);">Nenhum curso encontrado</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">Explore nosso catálogo e comece sua jornada de aprendizagem!</p>
          <button class="btn-primary" onclick="app.navigateTo('explore')">Explorar Cursos</button>
        </div>
      ` : ''}
    `;
  }

  // ===== BADGES =====
  renderBadges() {
    const userBadges = this.data.badges.filter(badge => 
      badge.unlockedBy.includes(this.currentUser.id)
    );
    
    const lockedBadges = this.data.badges.filter(badge => 
      !badge.unlockedBy.includes(this.currentUser.id)
    );

    return `
      <div style="margin-bottom: var(--space-8);">
        <h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">Badges Conquistados (${userBadges.length})</h3>
        <div class="card-grid">
          ${userBadges.map(badge => `
            <div class="card" style="text-align: center; position: relative;">
              <div style="position: absolute; top: var(--space-3); right: var(--space-3);">
                <span class="badge badge-${badge.rarity === 'common' ? 'success' : badge.rarity === 'rare' ? 'warning' : 'primary'}">${badge.rarity}</span>
              </div>
              <div style="font-size: 4rem; margin-bottom: var(--space-4);">${badge.icon}</div>
              <h3 style="margin-bottom: var(--space-2); color: var(--text-primary);">${badge.name}</h3>
              <p style="color: var(--text-secondary); font-size: 0.875rem;">${badge.description}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">Próximos Badges</h3>
        <div class="card-grid">
          ${lockedBadges.map(badge => `
            <div class="card" style="text-align: center; opacity: 0.6; position: relative;">
              <div style="position: absolute; top: var(--space-3); right: var(--space-3);">
                <span class="badge" style="background: var(--bg-tertiary); color: var(--text-tertiary);">🔒</span>
              </div>
              <div style="font-size: 4rem; margin-bottom: var(--space-4); filter: grayscale(1);">${badge.icon}</div>
              <h3 style="margin-bottom: var(--space-2); color: var(--text-secondary);">${badge.name}</h3>
              <p style="color: var(--text-tertiary); font-size: 0.875rem;">${badge.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ===== SETTINGS =====
  renderSettings() {
    return `
      <div class="card-grid" style="grid-template-columns: 1fr;">
        <div class="card">
          <h3 style="margin-bottom: var(--space-4);">Aparência</h3>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h4 style="margin-bottom: var(--space-1);">Tema</h4>
              <p style="color: var(--text-secondary); font-size: 0.875rem;">Escolha entre tema claro ou escuro</p>
            </div>
            <div class="theme-toggle" onclick="app.toggleTheme()"></div>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom: var(--space-4);">Perfil</h3>
          <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
            <div class="user-avatar" style="width: 80px; height: 80px; font-size: 2rem;">${this.currentUser.avatar}</div>
            <div style="flex: 1;">
              <h4 style="margin-bottom: var(--space-1);">${this.currentUser.name}</h4>
              <p style="color: var(--text-secondary); margin-bottom: var(--space-2);">${this.currentUser.email}</p>
              <span class="badge badge-primary">${this.currentUser.profile === 'professor' ? 'Professor' : 'Estudante'}</span>
            </div>
          </div>
          <button class="btn btn-secondary">Editar Perfil</button>
        </div>

        <div class="card">
          <h3 style="margin-bottom: var(--space-4);">Conta</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <button class="btn btn-ghost" style="justify-content: flex-start;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Privacidade & Segurança
            </button>
            <button class="btn btn-ghost" style="justify-content: flex-start;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              Notificações
            </button>
            <button class="btn btn-ghost" style="justify-content: flex-start; color: var(--error-500);" onclick="app.logout()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9"/>
              </svg>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderComingSoon() {
    return `
      <div class="card" style="text-align: center; padding: var(--space-12);">
        <div style="font-size: 4rem; margin-bottom: var(--space-4);">🚀</div>
        <h3 style="margin-bottom: var(--space-2);">Em Breve!</h3>
        <p style="color: var(--text-secondary);">Esta funcionalidade está sendo desenvolvida e estará disponível em breve.</p>
      </div>
    `;
  }

  // ===== EVENT HANDLERS =====
  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.dataset.route;
        this.navigateTo(route);
      });
    });

    // User menu
    const userProfile = document.querySelector('[data-action="user-menu"]');
    if (userProfile) {
      userProfile.addEventListener('click', () => {
        this.navigateTo('settings');
      });
    }

    // Course cards
    document.querySelectorAll('[data-course]').forEach(card => {
      card.addEventListener('click', () => {
        const courseId = parseInt(card.dataset.course);
        this.openCourse(courseId);
      });
    });
  }

  openCourse(courseId) {
    // Implementar navegação para curso específico
    console.log('Abrindo curso:', courseId);
    // this.navigateTo(`course/${courseId}`);
  }

  openCommandPalette() {
    // Implementar command palette
    console.log('Command palette opened');
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

// Initialize app
window.app = new EduSupremeApp();