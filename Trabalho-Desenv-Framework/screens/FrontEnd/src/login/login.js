document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  const existingToken = localStorage.getItem('token');
  if (existingToken) {
    console.log('[INFO] Usuário já logado. Redirecionando...');
    window.location.href = '../app/nav.html';
    return;
  }

  if (!form) {
    console.error('[ERRO] Formulário de login não encontrado!');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const identifier = usernameInput?.value.trim();
    const senha = passwordInput?.value;

    if (!identifier || !senha) {
      alert('Por favor, preencha usuário e senha.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = 'Entrando...';

    try {
      console.log('[INFO] Enviando login para API...');
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, senha })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn('[WARN] Falha no login:', data);
        throw new Error(data.message || data.error || 'Erro ao efetuar login');
      }

      if (!data.token) {
        throw new Error('Token JWT não recebido. Verifique o backend.');
      }

      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

      console.log('[OK] Login bem-sucedido! Redirecionando...');
      window.location.href = '../app/nav.html';

    } catch (err) {
      console.error('[ERRO LOGIN]', err);
      alert(err.message || 'Erro desconhecido ao tentar logar.');

    } finally {
      btn.disabled = false;
      btn.innerText = 'Entrar';
    }
  });
});
