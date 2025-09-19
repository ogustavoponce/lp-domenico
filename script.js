document.addEventListener('DOMContentLoaded', () => {

    // --- CONTROLE UNIVERSAL DE TEMA (LIGHT/DARK) ---
    const themeToggles = document.querySelectorAll('#theme-toggle');

    const applyTheme = (theme) => {
        if (theme === 'dark-mode') {
            document.documentElement.classList.add('dark-mode');
            themeToggles.forEach(toggle => toggle.textContent = '☀️');
        } else {
            document.documentElement.classList.remove('dark-mode');
            themeToggles.forEach(toggle => toggle.textContent = '🌙');
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    });


    // --- SAUDAÇÃO DINÂMICA (APENAS NO INDEX) ---
    const greetingElement = document.getElementById('welcome-greeting');
    if (greetingElement) {
        const nomeDoUsuario = "Gustavo"; // Simulado
        const horaAtual = new Date().getHours();
        let saudacao = horaAtual >= 5 && horaAtual < 12 ? "Bom dia" : horaAtual >= 12 && horaAtual < 18 ? "Boa tarde" : "Boa noite";
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha uma ótima ${saudacao.split(' ')[1]}.`;
    }


    // --- VALIDAÇÃO DE CADASTRO ---
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (event) => {
            const senha = document.getElementById('senha');
            const confirmarSenha = document.getElementById('confirmar-senha');
            if (senha.value !== confirmarSenha.value) {
                alert("As senhas não coincidem. Por favor, digite novamente.");
                event.preventDefault();
            }
        });
    }


    // --- VISUALIZAÇÃO DE SENHA ---
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            button.textContent = type === 'password' ? '👁️' : '🙈';
        });
    });

});