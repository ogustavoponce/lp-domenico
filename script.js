// Aguarda o carregamento completo da página para rodar o código
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SAUDAÇÃO DINÂMICA ---

    // Em um sistema real, o nome do usuário viria do login.
    // Como estamos simulando, colocamos um nome fixo aqui.
    const nomeDoUsuario = "Gustavo";

    // Pega o elemento H1 onde a saudação será exibida
    const greetingElement = document.getElementById('welcome-greeting');

    // Pega a hora atual do dia (de 0 a 23)
    const horaAtual = new Date().getHours();

    // Decide qual saudação usar com base na hora
    let saudacao;
    if (horaAtual >= 5 && horaAtual < 12) {
        saudacao = "Bom dia";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacao = "Boa tarde";
    } else {
        saudacao = "Boa noite";
    }

    // Monta a frase final e a insere no H1 da página
    greetingElement.textContent = `Olá, ${nomeDoUsuario}! Tenha uma ótima ${saudacao.split(' ')[1]}.`;


    // --- 2. OUTRAS INTERAÇÕES (se houver no futuro) ---
    // Este espaço pode ser usado para outras funcionalidades dinâmicas.

});