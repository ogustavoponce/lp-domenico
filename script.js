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
    // Publicar Aviso
    const formPublicarAviso = document.getElementById('form-publicar-aviso');
    if (formPublicarAviso) {
        formPublicarAviso.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('aviso-titulo').value;
            const conteudo = document.getElementById('aviso-conteudo').value;
            alert(`SIMULAÇÃO:\nAviso "${titulo}" publicado com sucesso!\nConteúdo: "${conteudo}"`);
            formPublicarAviso.reset();
        });
    }

    // Adicionar Usuário
    const formAddUsuario = document.getElementById('form-add-usuario');
    if (formAddUsuario) {
        formAddUsuario.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomeNovoUsuario = document.getElementById('novo-usuario-nome').value;
            if (nomeNovoUsuario.trim() === '') return;

            const userTable = document.getElementById('lista-usuarios');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${nomeNovoUsuario}</td>
                <td><button class="btn-danger delete-user-btn">Apagar</button></td>
            `;
            userTable.appendChild(newRow);
            alert(`SIMULAÇÃO:\nUsuário "${nomeNovoUsuario}" adicionado com sucesso!`);
            formAddUsuario.reset();
            
            // Adiciona o evento de apagar para o novo botão
            newRow.querySelector('.delete-user-btn').addEventListener('click', (event) => {
                 handleDeleteUser(event);
            });
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