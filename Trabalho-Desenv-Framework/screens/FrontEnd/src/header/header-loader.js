// header-loader.js - carrega header.html e insere no header-placeholder
(async function(){
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  let res;
  try {
    res = await fetch('../header/header.html');
    if (!res.ok) res = await fetch('../../header/header.html');
    if (!res.ok) res = await fetch('../../../header/header.html');

    const html = await res.text();
    placeholder.innerHTML = html;
  } catch (err) {
    console.error('Erro carregando header:', err);
  }
})();
