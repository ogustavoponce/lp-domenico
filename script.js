document.addEventListener('DOMContentLoaded', () => {

    // --- 1. VERIFICAÇÃO DE CONFIRMAÇÃO DE SENHA ---
    const cadastroForm = document.getElementById('cadastro-form');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (event) => {
            const senha = document.getElementById('senha');
            const confirmarSenha = document.getElementById('confirmar-senha');

            // Compara o valor dos dois campos
            if (senha.value !== confirmarSenha.value) {
                // Se forem diferentes...
                alert("As senhas não coincidem. Por favor, digite novamente.");
                event.preventDefault(); // Impede o envio do formulário
            }
            // Se forem iguais, o formulário é enviado normalmente para o index.html
        });
    }


    // --- 2. FUNCIONALIDADE DE "VER/OCULTAR" SENHA ---
    const toggleButtons = document.querySelectorAll('.password-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega o campo de senha que está junto com o ícone
            const passwordInput = button.previousElementSibling;
            
            // Verifica o tipo atual do campo (password ou text)
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            
            // Altera o tipo do campo
            passwordInput.setAttribute('type', type);
            
            // (Opcional) Altera o ícone para indicar o estado
            button.textContent = type === 'password' ? '👁️' : '🙈';
        });
    });

});