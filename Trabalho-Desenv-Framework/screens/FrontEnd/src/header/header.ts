// Funções para navegação e perfil do header

export function navigate(page: string) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  if (page === 'alunos') {
    // renderAlunos(); // Implemente conforme necessário
    document.querySelector('[onclick*="alunos"]')?.classList.add('active');
  } else if (page === 'avaliacoes') {
    // renderAvaliacoes(); // Implemente conforme necessário
    document.querySelector('[onclick*="avaliacoes"]')?.classList.add('active');
  } else if (page === 'novaProva') {
    // renderNovaProva(); // Implemente conforme necessário
  }
}

export function meusDados() {
  // Implemente ação de mostrar dados do usuário
}

export function sair() {
  // Implemente ação de logout
}
