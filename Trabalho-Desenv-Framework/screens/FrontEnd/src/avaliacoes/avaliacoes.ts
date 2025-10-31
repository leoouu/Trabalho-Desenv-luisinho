// avaliacoes.ts
interface Prova { aluno: string; prova: string; semestre: string; nota: string }

const defaultProvas: Prova[] = [
  { aluno: 'João Silva', prova: 'Prova de Matemática', semestre: '1º Semestre', nota: '8.5' },
  { aluno: 'Maria Souza', prova: 'Prova de História', semestre: '2º Semestre', nota: '9.0' },
  { aluno: 'Carlos Lima', prova: 'Prova de Português', semestre: '1º Semestre', nota: '7.0' }
];

function getProvas(): Prova[] {
  const raw = localStorage.getItem('provas');
  if (raw) return JSON.parse(raw) as Prova[];
  localStorage.setItem('provas', JSON.stringify(defaultProvas));
  return defaultProvas;
}

function saveProvas(p: Prova[]) { localStorage.setItem('provas', JSON.stringify(p)); }

function renderAvaliacoes(filter = '') {
  const q = filter.toLowerCase().trim();
  const provas = getProvas();
  const filtered = provas.filter(p => {
    if (!q) return true;
    return (p.aluno && p.aluno.toLowerCase().includes(q)) || (p.prova && p.prova.toLowerCase().includes(q));
  });
  const tbody = document.getElementById('provasBody') as HTMLElement;
  if (!tbody) return;
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma avaliação encontrada</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>${p.aluno}</td>
      <td>${p.prova}</td>
      <td>${p.semestre}</td>
      <td>${p.nota}</td>
      <td class="text-center"><i class="bi bi-pencil-square action-icon" data-aluno="${p.aluno}" data-prova="${p.prova}"></i></td>
    </tr>
  `).join('');
  // attach events
  Array.from(document.querySelectorAll('.action-icon')).forEach(el => {
    el.addEventListener('click', () => {
      const aluno = (el as HTMLElement).getAttribute('data-aluno') || '';
      const prova = (el as HTMLElement).getAttribute('data-prova') || '';
      const novaNota = prompt(`Lançar nota para ${aluno} - ${prova}`, '');
      if (novaNota !== null) {
        const idx = provas.findIndex(x => x.aluno === aluno && x.prova === prova);
        if (idx >= 0) {
          provas[idx].nota = novaNota;
          saveProvas(provas);
          renderAvaliacoes(q);
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAvaliacoes();
  const input = document.getElementById('searchExam') as HTMLInputElement;
  if (input) input.addEventListener('input', (e) => renderAvaliacoes((e.target as HTMLInputElement).value));
});
