// Elementos da modal
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.querySelector('a[href="#login"]');
const registerLink = document.getElementById('registerLink');
const loginLink = document.getElementById('loginLink');
const closeButtons = document.querySelectorAll('.close');

// Formulários
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Função para abrir modal
function openModal(modal) {
    modal.style.display = 'block';
}

// Função para fechar modal
function closeModal(modal) {
    modal.style.display = 'none';
    // Limpa mensagens de erro
    const errorMessages = modal.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
    // Limpa formulários
    modal.querySelector('form').reset();
}

// Event listeners para abrir modais
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });
}

if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });
}

if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });
}

// Event listeners para fechar modais
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
    if (e.target === registerModal) closeModal(registerModal);
});

// Função para mostrar mensagem de erro
function showError(form, message) {
    let errorElement = form.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        form.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Cadastro de usuário
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = registerForm.querySelector('#registerEmail').value;
    const password = registerForm.querySelector('#registerPassword').value;
    const confirmPassword = registerForm.querySelector('#confirmPassword').value;
    
    // Validações
    if (password !== confirmPassword) {
        showError(registerForm, 'As senhas não coincidem!');
        return;
    }
    
    if (password.length < 6) {
        showError(registerForm, 'A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    // Verifica se usuário já existe
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);
    
    if (userExists) {
        showError(registerForm, 'Este e-mail já está cadastrado!');
        return;
    }
    
    // Adiciona novo usuário
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', email);
    
    // Fecha modal e recarrega a página
    closeModal(registerModal);
    window.location.reload();
});

// Login de usuário
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = loginForm.querySelector('#loginEmail').value;
    const password = loginForm.querySelector('#loginPassword').value;
    
    // Verifica credenciais
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        showError(loginForm, 'E-mail ou senha incorretos!');
        return;
    }
    
    // Armazena usuário logado
    localStorage.setItem('loggedInUser', email);
    
    // Fecha modal e recarrega a página
    closeModal(loginModal);
    window.location.reload();
});

// Verifica se usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loginBtn = document.querySelector('a[href="#login"]');
    
    if (loggedInUser && loginBtn) {
        loginBtn.textContent = 'Minha Conta';
        loginBtn.href = '#';
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja sair da sua conta?')) {
                localStorage.removeItem('loggedInUser');
                window.location.reload();
            }
        });
    }
});