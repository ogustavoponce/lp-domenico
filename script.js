// =========================================================================
// SCRIPT FINAL E COMPLETO v19.0 - PLATAFORMA PROFESSOR DOMENICO
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: CONTROLE DE TEMA (LIGHT/DARK) ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const applyTheme = (theme) => {
            if (theme === 'dark-mode') {
                document.documentElement.classList.add('dark-mode');
                themeToggle.textContent = '☀️';
            } else {
                document.documentElement.classList.remove('dark-mode');
                themeToggle.textContent = '🌙';
            }
        };
        
        let currentTheme = localStorage.getItem('theme') || 'light-mode';
        applyTheme(currentTheme);

        themeToggle.addEventListener('click', () => {
            currentTheme = document.documentElement.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    }
    
    // --- MÓDULO 2: AUTENTICAÇÃO ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            if (email.toLowerCase() === 'domenico@prof.com') {
                alert('Login como gestor bem-sucedido! Redirecionando...');
                window.location.href = 'admin_turmas.html';
            } else {
                alert('Login de aluno bem-sucedido! Redirecionando...');
                window.location.href = 'plataforma_aluno.html';
            }
        });
    }

    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Cadastro realizado com sucesso! Redirecionando para a plataforma...');
            window.location.href = 'plataforma_aluno.html';
        });
    }

    // --- MÓDULO 3: PAINEL DO ALUNO ---
    const greetingElement = document.getElementById('welcome-greeting');
    if (greetingElement) {
        const nomeDoUsuario = "Gustavo";
        const horaAtual = new Date().getHours();
        let saudacao = horaAtual < 12 ? "Bom dia" : horaAtual < 18 ? "Boa tarde" : "Boa noite";
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha uma ótima ${saudacao.split(' ')[1]}.`;
    }

    // Navegação por Abas do Aluno
    const studentTabItems = document.querySelectorAll('.student-tab-item');
    const studentViewPanels = document.querySelectorAll('.view-panel');
    studentTabItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            studentTabItems.forEach(item => item.classList.remove('active'));
            studentViewPanels.forEach(panel => { if (panel) panel.style.display = 'none'; });
            tab.classList.add('active');
            const targetViewId = tab.dataset.view;
            const targetView = document.getElementById(`view-${targetViewId}`);
            if(targetView) {
                targetView.style.display = 'block';
            }
        });
    });

    // Simulação de Publicação no Fórum
    const forumForm = document.getElementById('forum-form');
    if (forumForm) {
        forumForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPostContent = document.getElementById('forum-new-post').value;
            if (newPostContent.trim() === '') return;
            const postList = document.getElementById('forum-posts-list');
            const newPost = document.createElement('div');
            newPost.classList.add('forum-post');
            newPost.innerHTML = `<h4><span class="forum-post-author">Gustavo (Você):</span> ${newPostContent}</h4><small>Publicado agora</small>`;
            postList.prepend(newPost);
            forumForm.reset();
        });
    }

    // --- MÓDULO 4: GERAL ---
    // Simulação de "Salvar Alterações" na página de configurações
    const settingsForm = document.getElementById('settings-form');
    if(settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Configurações salvas com sucesso! (Simulação)');
        });
    }

    // Botão de ver senha
    document.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.closest('.password-wrapper').querySelector('input');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    });

    // Simulação de botões sem página definida
    document.querySelectorAll('a[href="#"]').forEach(button => {
        if (!button.classList.contains('student-tab-item')) { // Evita que afete as abas que já funcionam
            button.addEventListener('click', (e) => {
                e.preventDefault();
                alert('SIMULAÇÃO: Esta funcionalidade será implementada no futuro!');
            });
        }
    });
});
