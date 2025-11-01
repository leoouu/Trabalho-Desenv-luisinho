document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const togglePasswordIcon = document.getElementById('toggle-password-icon');

    // Toggle mostrar/ocultar senha
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Alternar ícone
        if (type === 'text') {
            togglePasswordIcon.classList.remove('bi-eye');
            togglePasswordIcon.classList.add('bi-eye-slash');
        } else {
            togglePasswordIcon.classList.remove('bi-eye-slash');
            togglePasswordIcon.classList.add('bi-eye');
        }
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.classList.add('d-none');

        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: identifier,
                    senha: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirecionar para a home
                window.location.href = '../home/home.html';
            } else {
                const errorData = await response.json();
                errorText.textContent = errorData.message || 'Falha no login. Verifique suas credenciais.';
                errorMessage.classList.remove('d-none');
            }
        } catch (error) {
            errorText.textContent = 'Ocorreu um erro. Tente novamente mais tarde.';
            errorMessage.classList.remove('d-none');
            console.error('Login error:', error);
        }
    });
});