// login.ts
// Nota: compile com tsc para gerar login.js se quiser rodar em navegadores que não suportam TS.

const form = document.getElementById('loginForm') as HTMLFormElement | null;
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value.trim();
    // Simples demo: grava usuário na sessionStorage e redireciona para alunos
    sessionStorage.setItem('user', username || 'Usuário');
    window.location.href = '../screens/alunos/alunos.html';
  });
}
