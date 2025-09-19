document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONTROLE DO TEMA (LIGHT/DARK) ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Verifica se já existe um tema salvo no navegador
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.classList.add(savedTheme);
        themeToggle.textContent = savedTheme === 'dark-mode' ? '☀️' : '🌙';
    } else {
        // Se não houver tema salvo, define o padrão
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        // Alterna a classe no elemento <html>
        htmlElement.classList.toggle('dark-mode');

        // Salva a preferência no navegador
        if (htmlElement.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light-mode'); // Salva como 'light-mode'
            localStorage.removeItem('theme'); // Ou remove para usar o padrão
            themeToggle.textContent = '🌙';
        }
    });


    // --- 2. SAUDAÇÃO DINÂMICA ---
    const greetingElement = document.getElementById('welcome-greeting');
    if (greetingElement) {
        const nomeDoUsuario = "Gustavo"; // Simulado
        const horaAtual = new Date().getHours();
        let saudacao = horaAtual >= 5 && horaAtual < 12 ? "Bom dia" : horaAtual >= 12 && horaAtual < 18 ? "Boa tarde" : "Boa noite";
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha uma ótima ${saudacao.split(' ')[1]}.`;
    }


    // --- 3. VERIFICAÇÃO DE SENHA NO CADASTRO ---
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


    // --- 4. FUNCIONALIDADE DE "VER/OCULTAR" SENHA ---
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