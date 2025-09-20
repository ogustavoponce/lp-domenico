document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO DE CONTROLE DE TEMA (LIGHT/DARK) ---
    const themeToggles = document.querySelectorAll('#theme-toggle');
    const applyTheme = (theme) => {
        if (theme === 'dark-mode') {
            document.documentElement.classList.add('dark-mode');
            themeToggles.forEach(toggle => { if(toggle) toggle.textContent = '☀️'; });
        } else {
            document.documentElement.classList.remove('dark-mode');
            themeToggles.forEach(toggle => { if(toggle) toggle.textContent = '🌙'; });
        }
    };
    // Aplica o tema salvo ao carregar a página
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);

    // Adiciona o evento de clique a todos os botões de tema
    themeToggles.forEach(toggle => {
        if(toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
                localStorage.setItem('theme', currentTheme);
                applyTheme(currentTheme);
            });
        }
    });

    // --- MÓDULO DE SAUDAÇÃO DINÂMICA (Painel do Aluno) ---
    const greetingElement = document.getElementById('welcome-greeting');
    if (greetingElement) {
        const nomeDoUsuario = "Gustavo"; // Em um sistema real, este nome viria do login.
        const horaAtual = new Date().getHours();
        let saudacao = horaAtual < 12 ? "Bom dia" : horaAtual < 18 ? "Boa tarde" : "Boa noite";
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha um(a) ótimo(a) ${saudacao.split(' ')[1]}.`;
    }

    // --- MÓDULO DE SIMULAÇÃO DE ANEXOS (Painel do Gestor) ---
    const handleAttachment = (inputId, spanId) => {
        const fileInput = document.getElementById(inputId);
        const fileNameSpan = document.getElementById(spanId);
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                fileNameSpan.textContent = fileInput.files.length > 0 ? `Anexo: ${fileInput.files[0].name}` : '';
            });
        }
    };
    handleAttachment('aviso-anexo', 'attachment-name');

    // --- SIMULAÇÃO DE PUBLICAÇÃO DE AVISO (Painel do Gestor) ---
    const formPublicarAviso = document.getElementById('form-publicar-aviso');
    if (formPublicarAviso) {
        formPublicarAviso.addEventListener('submit', (e) => {
            e.preventDefault();
            const conteudo = document.getElementById('aviso-conteudo').value;
            const anexo = document.getElementById('attachment-name').textContent;
            const adminFeed = document.getElementById('admin-feed');

            if (conteudo.trim() === '') return; // Não publica se estiver vazio

            // Cria o novo card de aviso
            const novoAviso = document.createElement('div');
            novoAviso.classList.add('card', 'feed-item');
            novoAviso.innerHTML = `
                <h4>Novo Aviso (Simulação)</h4>
                <p>${conteudo}</p>
                <small>Publicado agora</small>
                ${anexo ? `<p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--cor-primaria);">${anexo}</p>` : ''}
            `;
            
            // Adiciona o novo aviso no topo do feed
            adminFeed.prepend(novoAviso);
            
            alert(`SIMULAÇÃO: Aviso publicado com sucesso!`);
            formPublicarAviso.reset();
            document.getElementById('attachment-name').textContent = '';
        });
    }

});
