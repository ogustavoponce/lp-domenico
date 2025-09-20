document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO DE CONTROLE DE TEMA (LIGHT/DARK) ---
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

    // --- MÓDULO DE SAUDAÇÃO DINÂMICA ---
    const greetingElement = document.getElementById('welcome-greeting');
    if (greetingElement) {
        // Em um sistema real, o nome viria do login. Usamos um valor fixo para o protótipo.
        const nomeDoUsuario = "Gustavo";
        const horaAtual = new Date().getHours();
        const saudacao = horaAtual < 12 ? "Bom dia" : horaAtual < 18 ? "Boa tarde" : "Boa noite";
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha um(a) ótimo(a) ${saudacao.split(' ')[1]}.`;
    }

    // --- MÓDULO DE CADASTRO AVANÇADO ---
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        const senhaInput = document.getElementById('senha');
        const confirmarSenhaInput = document.getElementById('confirmar-senha');
        const strengthIndicator = document.getElementById('password-strength');
        const profilePicInput = document.getElementById('profile-pic-input');
        const profilePicPreview = document.getElementById('profile-pic-preview');

        // Pré-visualização da foto de perfil
        profilePicInput?.addEventListener('change', () => {
            const file = profilePicInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });

        // Verificador de força da senha
        senhaInput?.addEventListener('input', () => {
            const value = senhaInput.value;
            let strength = 'Fraca';
            let color = 'var(--cor-perigo)';
            if (value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value)) {
                strength = 'Forte';
                color = 'var(--cor-sucesso)';
            } else if (value.length >= 6) {
                strength = 'Média';
                color = 'orange';
            }
            strengthIndicator.textContent = `Força da senha: ${strength}`;
            strengthIndicator.style.color = color;
        });

        // Validação final no envio
        cadastroForm.addEventListener('submit', (event) => {
            if (senhaInput.value !== confirmarSenhaInput.value) {
                alert("As senhas não coincidem. Por favor, verifique.");
                event.preventDefault();
            }
            // Ação de envio aqui (redirecionamento)
        });
    }

    // --- MÓDULO DE VISUALIZAÇÃO DE SENHA ---
    document.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.closest('.password-wrapper').querySelector('input');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    });

    // --- MÓDULO DE SIMULAÇÃO DO PAINEL DO GESTOR ---
    const deleteUserButtons = document.querySelectorAll('.delete-user-btn');
    deleteUserButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (confirm('Tem certeza que deseja apagar este usuário?')) {
                // Simula a remoção: apaga a linha da tabela na tela
                e.target.closest('tr').remove();
                alert('Usuário removido com sucesso (simulação).');
            }
        });
    });
});