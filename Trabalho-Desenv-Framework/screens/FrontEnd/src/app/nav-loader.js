// nav-loader.js - carrega nav.html e conecta links a páginas em screens/
(async function(){
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;
  try {
    const res = await fetch('./nav.html');
    const html = await res.text();
    placeholder.innerHTML = html;

    // encontra base do projeto antes de /screens/
    const p = location.pathname.replace(/\\/g, '/');
    const idx = p.indexOf('/screens/');
    const base = idx >= 0 ? p.slice(0, idx) : p.slice(0, p.lastIndexOf('/'));

    // conecta links com data-page
    Array.from(placeholder.querySelectorAll('[data-page]')).forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const target = el.getAttribute('data-page') || '';
        const url = base + '/screens/' + target;
        location.href = url;
      });
    });

    // conecta ações simples
    const sair = placeholder.querySelector('[data-action="sair"]');
    if (sair) sair.addEventListener('click', (e) => { e.preventDefault(); sessionStorage.clear(); location.href = base + '/screens/login/login.html'; });

    // ativa a nav-link cujo data-page corresponde ao arquivo atual
    const current = p.substring(p.lastIndexOf('/')+1);
    Array.from(placeholder.querySelectorAll('[data-page]')).forEach(function(el) {
      const dp = el.getAttribute('data-page') || '';
      if (dp.endsWith(current)) el.classList.add('active');
    });

  } catch (err) {
    console.error('Erro carregando nav:', err);
  }
})();
