// =========================================================================
// SCRIPT FINAL E ROBUSTO v17.0 - PLATAFORMA PROFESSOR DOMENICO
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
            tabItems.forEach(item => item.classList.remove('active'));
            viewPanels.forEach(panel => { if(panel) panel.style.display = 'none'; });
            tab.classList.add('active');
            const targetViewId = tab.dataset.view;
            const targetView = document.getElementById(`view-${targetViewId}`);
            if(targetView) {
                targetView.style.display = 'block';
            }
        });
    });

    // --- MÓDULO 3: SIMULAÇÕES DO PAINEL DO GESTOR ---
    // Adicionar Aluno
    const addStudentBtn = document.getElementById('add-student-btn');
    if(addStudentBtn){
        addStudentBtn.addEventListener('click', () => {
            const studentEmail = prompt("Digite o e-mail do aluno para convidar (simulação):");
            if(studentEmail){
                alert(`SIMULAÇÃO: Convite enviado para ${studentEmail}.`);
            }
        });
    }

    // Remover Aluno
    const studentList = document.getElementById('student-list');
    if(studentList){
        studentList.addEventListener('click', (e) => {
            if(e.target.classList.contains('remove-person-btn')){
                if(confirm("Tem certeza que deseja remover este aluno? (Simulação)")){
                    e.target.closest('.person-row').remove();
                }
            }
        });
    }

    // Criar Atividade
    const createActivityBtn = document.getElementById('create-activity-btn');
    if(createActivityBtn){
        createActivityBtn.addEventListener('click', () => {
            alert("SIMULAÇÃO: Tela para criar uma nova atividade apareceria aqui.");
        });
    }

    // Publicar Aviso
    const formPublicarAviso = document.getElementById('form-publicar-aviso');
    if (formPublicarAviso) {
        formPublicarAviso.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('SIMULAÇÃO: Aviso publicado com sucesso!');
            formPublicarAviso.reset();
        });
    }

    // --- (Outros módulos de login, saudação, etc. continuam válidos) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'plataforma_aluno.html';
        });
    }
});
