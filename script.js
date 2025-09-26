// =========================================================================
// SCRIPT FINAL E COMPLETO - PLATAFORMA PROFESSOR DOMENICO
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: CONTROLE DE TEMA ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    const applyTheme = (theme) => {
        if (theme === 'dark-mode') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        if (themeToggleBtn) {
            themeToggleBtn.textContent = theme === 'dark-mode' ? 'Modo Claro' : 'Modo Escuro';
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
            const email = e.target.querySelector('#email').value;
            if (email.toLowerCase() === 'domenico@prof.com') {
                window.location.href = 'admin_turmas.html';
            } else {
                window.location.href = 'plataforma_aluno.html';
            }
        });
    }

    // --- MÓDULO 3: SAUDAÇÃO DINÂMICA ---
    const greetingElement = document.getElementById('welcome-greeting');
    if (greetingElement) {
        const userName = "Gustavo"; // Este nome seria dinâmico em um sistema real
        const currentHour = new Date().getHours();
        let greeting = "Olá";
        if (currentHour < 12) {
            greeting = "Bom dia";
        } else if (currentHour < 18) {
            greeting = "Boa tarde";
        } else {
            greeting = "Boa noite";
        }
        greetingElement.textContent = `${greeting}, ${userName}!`;
    }

    // --- MÓDULO 4: SIMULAÇÕES GERAIS ---
    // Adiciona alerta para links e botões sem funcionalidade real ainda
    document.querySelectorAll('a[href="#"], button:not([type="submit"])').forEach(element => {
        // Evita adicionar o evento ao botão de tema que já tem uma função
        if (element.id !== 'theme-toggle-btn') {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                alert('SIMULAÇÃO: Esta funcionalidade será implementada no futuro.');
            });
        }
    });
});