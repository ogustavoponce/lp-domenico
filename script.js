document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const loginForm = document.getElementById('login-form');
    const greetingElement = document.getElementById('welcome-greeting');

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

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            if (email.toLowerCase() === 'domenico@prof.com') {
                window.location.href = 'admin_turmas.html';
            } else {
                window.location.href = 'plataforma_aluno.html';
            }
        });
    }

    if (greetingElement) {
        const userName = "Gustavo";
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
});