// criarProva.ts
interface Prova { aluno: string; prova: string; semestre: string; nota: string }

function getProvas(): Prova[] {
  const raw = localStorage.getItem('provas');
  return raw ? JSON.parse(raw) as Prova[] : [];
}

function saveProvas(p: Prova[]) { localStorage.setItem('provas', JSON.stringify(p)); }

document.addEventListener('DOMContentLoaded', () => {
  const enviarTodos = document.getElementById('enviarTodos') as HTMLInputElement;
  const campoAluno = document.getElementById('campoAluno') as HTMLElement;
  if (enviarTodos) {
    enviarTodos.addEventListener('change', () => {
      campoAluno.style.display = enviarTodos.checked ? 'none' : 'block';
    });
  }

  const form = document.getElementById('formProva') as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = (document.getElementById('nomeProva') as HTMLInputElement).value.trim();
      const turma = (document.getElementById('turma') as HTMLInputElement).value.trim();
      const enviar = (document.getElementById('enviarTodos') as HTMLInputElement).checked;
      const nomeAluno = ((document.getElementById('nomeAluno') as HTMLInputElement)?.value || '').trim();
      if (!enviar && !nomeAluno) { alert('Preencha o nome do aluno quando não enviar para todos.'); return; }
      const provas = getProvas();
      if (enviar) provas.unshift({ aluno: 'Todos', prova: nome, semestre: turma, nota: '-' });
      else provas.unshift({ aluno: nomeAluno, prova: nome, semestre: turma, nota: '-' });
      saveProvas(provas);
      alert(`Prova "${nome}" criada com sucesso!`);
      window.location.href = '../avaliacoes/avaliacoes.html';
    });
  }
});
