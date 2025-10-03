/* --- ARQUIVO: script.js --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DO ALTERNADOR DE TEMA (LIGHT/DARK) ---
    const themeToggler = document.getElementById('theme-toggler');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    }

    if (themeToggler) {
        themeToggler.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark-mode');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }

    // --- 2. LÓGICA DA SAUDAÇÃO DINÂMICA ---
    const greetingElement = document.getElementById('greeting');
    
    if (greetingElement) {
        const currentHour = new Date().getHours();
        
        if (currentHour >= 5 && currentHour < 12) {
            greetingElement.textContent = 'Bom dia';
        } else if (currentHour >= 12 && currentHour < 18) {
            greetingElement.textContent = 'Boa tarde';
        } else {
            greetingElement.textContent = 'Boa noite';
        }
    }

    // --- 3. LÓGICA DO LOGIN SIMULADO ---
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();

            if (email === 'domenico@prof.com') {
                window.location.href = 'admin_turmas.html';
            } else {
                window.location.href = 'plataforma_aluno.html';
            }
        });
    }
});