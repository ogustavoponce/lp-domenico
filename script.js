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
        const nomeDoUsuario = "Gustavo"; // Em um sistema real, este nome viria do login.
        const horaAtual = new Date().getHours();
        let saudacao = horaAtual < 12 ? "Bom dia" : horaAtual < 18 ? "Boa tarde" : "Boa noite";
        greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha um(a) ótimo(a) ${saudacao.split(' ')[1]}.`;
    }

    // --- MÓDULO DE NAVEGAÇÃO DO PAINEL DO GESTOR ---
    const adminNav = document.getElementById('admin-nav');
    if (adminNav) {
        const navItems = adminNav.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.view-content');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const targetViewId = item.dataset.view;
                views.forEach(view => view.style.display = 'none');
                const targetView = document.getElementById(`view-${targetViewId}`);
                if (targetView) {
                    targetView.style.display = 'block';
                }
            });
        });
    }

    // --- MÓDULO DE SIMULAÇÃO DE ANEXOS ---
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
    
    // --- SIMULAÇÕES DO PAINEL DO GESTOR ---
    const formPublicarAviso = document.getElementById('form-publicar-aviso');
    if (formPublicarAviso) {
        formPublicarAviso.addEventListener('submit', (e) => {
            e.preventDefault();
            const turma = document.getElementById('class-selector').value;
            const conteudo = document.getElementById('aviso-conteudo').value;
            const anexo = document.getElementById('attachment-name').textContent;
            
            // Simulação: Adiciona o aviso no feed da tela
            const adminFeed = document.getElementById('admin-feed');
            const novoAviso = document.createElement('div');
            novoAviso.classList.add('card', 'feed-item');
            novoAviso.innerHTML = `
                <h4>Novo Aviso (Simulação)</h4>
                <p>${conteudo}</p>
                <small>Publicado agora para: ${turma}</small>
                ${anexo ? `<p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--cor-primaria);">${anexo}</p>` : ''}
            `;
            adminFeed.prepend(novoAviso);
            
            alert(`SIMULAÇÃO: Aviso publicado com sucesso para a turma "${turma}"!`);
            formPublicarAviso.reset();
            document.getElementById('attachment-name').textContent = '';
        });
    }

    const formCadastrarAluno = document.getElementById('form-add-aluno');
    if (formCadastrarAluno) {
        formCadastrarAluno.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('aluno-nome').value;
            alert(`SIMULAÇÃO: Aluno "${nome}" cadastrado com sucesso!`);
            formCadastrarAluno.reset();
        });
    }

});