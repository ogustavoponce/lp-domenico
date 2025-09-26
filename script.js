document.addEventListener('DOMContentLoaded', () => {

    // LÓGICA DE TEMA (CLARO/ESCURO)
    const themeToggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    if (currentTheme) {
        applyTheme(currentTheme);
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        });
    }

    // LÓGICA DE LOGIN
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (email.toLowerCase() === 'domenico@prof.com') {
                window.location.href = 'admin_turmas.html';
            } else {
                window.location.href = 'plataforma_aluno.html';
            }
        });
    }
    
    // LÓGICA DE CADASTRO
    const cadastroForm = document.getElementById('cadastro-form');
    if(cadastroForm){
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Cadastro simulado com sucesso! Redirecionando para o login.');
            window.location.href = 'login.html';
        });
    }


    // LÓGICA DAS ABAS (PAINEL DO GESTOR)
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tab);

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // LÓGICA DOS MODAIS (PAINEL DO GESTOR)
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const overlay = document.querySelector('.modal-overlay');

    const openModal = (modal) => {
        if (modal == null) return;
        modal.classList.add('visible');
    };

    const closeModal = (modal) => {
        if (modal == null) return;
        modal.classList.remove('visible');
    };

    if (overlay) {
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = document.querySelector(button.dataset.modalTarget);
                openModal(modal);
            });
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal-overlay');
                closeModal(modal);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    }
    
    // LÓGICA DE SIMULAÇÃO DE AÇÕES (MODAL)
    const criarAvisoForm = document.getElementById('criar-aviso-form');
    if(criarAvisoForm) {
        criarAvisoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Aviso publicado no mural com sucesso!');
            const modal = criarAvisoForm.closest('.modal-overlay');
            closeModal(modal);
            criarAvisoForm.reset();
        });
    }
});