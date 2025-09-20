// =========================================================================
// SCRIPT FINAL E ROBUSTO v14.0 - PLATAFORMA PROFESSOR DOMENICO
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

    // --- MÓDULO 2: NAVEGAÇÃO POR ABAS (DENTRO DA TURMA) ---
    const tabItems = document.querySelectorAll('.tab-item');
    const viewPanels = document.querySelectorAll('.view-panel');

    tabItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove a classe 'active' de todas as abas e painéis
            tabItems.forEach(item => item.classList.remove('active'));
            viewPanels.forEach(panel => {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });

            // Adiciona a classe 'active' à aba clicada
            tab.classList.add('active');

            // Mostra o painel de conteúdo correspondente
            const targetViewId = tab.dataset.view;
            const targetView = document.getElementById(`view-${targetViewId}`);
            if(targetView) {
                targetView.style.display = 'block';
                targetView.classList.add('active');
            }
        });
    });


    // --- MÓDULO 3: SIMULAÇÃO DE PUBLICAÇÃO DE AVISO ---
    const formPublicarAviso = document.getElementById('form-publicar-aviso');
    if (formPublicarAviso) {
        formPublicarAviso.addEventListener('submit', (e) => {
            e.preventDefault();
            const conteudo = document.getElementById('aviso-conteudo').value;
            if (conteudo.trim() === '') return;
            alert(`SIMULAÇÃO: Aviso publicado com sucesso!\nConteúdo: "${conteudo}"`);
            formPublicarAviso.reset();
        });
    }

    // --- (Outros módulos de login, cadastro, etc. continuam válidos e não precisam estar neste arquivo,
    // pois cada página carrega o que precisa) ---

});