// =========================================================================
// SCRIPT FINAL E COMPLETO - PLATAFORMA PROFESSOR DOMENICO
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: CONTROLE DE TEMA ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const applyTheme = (theme) => {
        document.documentElement.className = '';
        if (theme === 'dark-mode') {
            document.documentElement.classList.add('dark-mode');
        }
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

    // --- MÓDULO 2: AUTENTICAÇÃO E NAVEGAÇÃO ---
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

    // --- MÓDULO 3: SIMULAÇÕES E INTERATIVIDADE GERAL ---
    document.querySelectorAll('form:not(#login-form)').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            alert('SIMULAÇÃO: Ação executada com sucesso!');
        });
    });

    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            alert('SIMULAÇÃO: Esta funcionalidade será implementada no futuro.');
        });
    });
});