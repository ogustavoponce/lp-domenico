// =========================================================================
// SCRIPT FINAL E COMPLETO - PLATAFORMA PROFESSOR DOMENICO
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: CONTROLE DE TEMA ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const applyTheme = (theme) => {
        document.documentElement.className = '';
        if (theme === 'dark-mode') document.documentElement.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = theme === 'dark-mode' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro';
    };
    let currentTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(currentTheme);
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
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
            const email = e.target.querySelector('input[type="email"]').value;
            if (email.toLowerCase() === 'domenico@prof.com') {
                alert('Login como gestor bem-sucedido!');
                window.location.href = 'admin_turmas.html';
            } else {
                alert('Login de aluno bem-sucedido!');
                window.location.href = 'plataforma_aluno.html';
            }
        });
    }

    // --- MÓDULO 3: PAINEL DO ALUNO ---
    const greetingElement = document.getElementById('welcome-greeting');
    if (greetingElement) {
        greetingElement.textContent = `Olá, Gustavo! Tenha uma ótima tarde.`;
    }

    // --- MÓDULO 4: PAINEL DO GESTOR ---
    // Simulação de Modais
    const overlay = document.getElementById('modal-overlay');
    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            if(modal && overlay) {
                overlay.classList.add('active');
                modal.classList.add('active');
            }
        });
    });
    document.querySelectorAll('[data-modal-close]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if(modal && overlay) {
                overlay.classList.remove('active');
                modal.classList.remove('active');
            }
        });
    });

    // Simulação de Abas
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const parentNav = e.target.closest('nav');
            parentNav.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
            
            const viewContainer = document.querySelector('.class-content');
            viewContainer.querySelectorAll('.view-panel').forEach(panel => panel.style.display = 'none');
            
            const targetView = document.getElementById(e.target.dataset.view);
            if(targetView) targetView.style.display = 'block';
        });
    });

    // Simulação de Formulários
    document.querySelectorAll('form').forEach(form => {
        if(form.id !== 'login-form'){
             form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('SIMULAÇÃO: Ação executada com sucesso!');
                const modal = e.target.closest('.modal');
                if(modal && overlay) {
                     overlay.classList.remove('active');
                     modal.classList.remove('active');
                }
            });
        }
    });
});