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
        const nomeDoUsuario = "Gustavo";
        const horaAtual = new Date().getHours();
        let saudacao = horaAtual < 12 ? "Bom dia" : horaAtual < 18 ? "Boa tarde" : "Boa noite";
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha um(a) ótimo(a) ${saudacao.split(' ')[1]}.`;
    }

    // --- SIMULAÇÃO DO PAINEL DO GESTOR ---
    const formPublicarAviso = document.getElementById('form-publicar-aviso');
    if (formPublicarAviso) {
        formPublicarAviso.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('aviso-titulo').value;
            const conteudo = document.getElementById('aviso-conteudo').value;
            const adminFeed = document.getElementById('admin-feed');

            // Cria o novo card de aviso
            const novoAviso = document.createElement('div');
            novoAviso.classList.add('card', 'feed-item');
            novoAviso.innerHTML = `
                <h4>${titulo || 'Novo Aviso'}</h4>
                <p>${conteudo}</p>
                <small>Publicado agora</small>
            `;
            
            // Adiciona o novo aviso no topo do feed
            adminFeed.prepend(novoAviso);
            
            alert(`SIMULAÇÃO: Aviso publicado com sucesso!`);
            formPublicarAviso.reset();
        });
    }

    // Apagar Usuário
    const handleDeleteUser = (event) => {
        if (confirm('Tem certeza que deseja apagar este usuário? (Simulação)')) {
            event.target.closest('tr').remove();
        }
    };
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', handleDeleteUser);
    });

});