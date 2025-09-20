// =========================================================================
// SCRIPT FINAL E ROBUSTO v12.0 - PLATAFORMA PROFESSOR DOMENICO
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: CONTROLE DE TEMA (LIGHT/DARK) ---
    const themeToggles = document.querySelectorAll('#theme-toggle');
    const applyTheme = (theme) => {
        if (theme === 'dark-mode') {
            document.documentElement.classList.add('dark-mode');
            themeToggles.forEach(toggle => { if (toggle) toggle.textContent = '☀️'; });
        } else {
            document.documentElement.classList.remove('dark-mode');
            themeToggles.forEach(toggle => { if (toggle) toggle.textContent = '🌙'; });
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);

    themeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
                localStorage.setItem('theme', currentTheme);
                applyTheme(currentTheme);
            });
        }
    });


    // --- MÓDULO 2: FUNCIONALIDADE DE AUTENTICAÇÃO (Login, Cadastro) ---
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
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha um(a) ótimo(a) ${saudacao.split(' ')[1]}.`;
    }


    // --- MÓDULO 4: PAINEL DO GESTOR (Simulações) ---
    const formPublicarAviso = document.getElementById('form-publicar-aviso');
    if (formPublicarAviso) {
        formPublicarAviso.addEventListener('submit', (e) => {
            e.preventDefault();
            const conteudo = document.getElementById('aviso-conteudo').value;
            if (conteudo.trim() === '') {
                alert('Por favor, escreva um aviso antes de publicar.');
                return;
            }
            alert(`SIMULAÇÃO: Aviso publicado com sucesso!\n\nConteúdo: "${conteudo}"`);
            formPublicarAviso.reset();
        });
    }
    

    // --- MÓDULO 5: FUNCIONALIDADES GERAIS (Ex: Ver Senha) ---
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    });

});
