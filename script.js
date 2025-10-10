// Seleção dos formulários e links
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const resetPasswordForm = document.getElementById('reset-password-form');

const signupLink = document.getElementById('signup-link');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLoginLinks = document.querySelectorAll('#back-to-login, #back-to-login-2');

// Mostrar formulário de cadastro
signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'flex';
  resetPasswordForm.style.display = 'none';
});

// Mostrar formulário de redefinir senha
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'none';
  resetPasswordForm.style.display = 'flex';
});

// Voltar para login a partir dos outros formulários
backToLoginLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    resetPasswordForm.style.display = 'none';
  });
});

// Simulação do submit dos formulários
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Login realizado (simulação).');
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Cadastro realizado (simulação).');
});

resetPasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Link de redefinição enviado (simulação).');
});
