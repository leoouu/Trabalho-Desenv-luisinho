// alunos.ts
interface Aluno { nome: string; ra: string; semestre: string; prova: string; nota: string | number }

const defaultAlunos: Aluno[] = [
  { nome: 'João Silva', ra: '20231001', semestre: '1º Semestre', prova: 'Matemática', nota: 8.5 },
  { nome: 'Maria Souza', ra: '20231002', semestre: '2º Semestre', prova: 'História', nota: 9.0 },
  { nome: 'Carlos Lima', ra: '20231003', semestre: '1º Semestre', prova: 'Português', nota: 7.0 }
];

function getAlunos(): Aluno[] {
  const raw = localStorage.getItem('alunos');
  if (raw) return JSON.parse(raw) as Aluno[];
  localStorage.setItem('alunos', JSON.stringify(defaultAlunos));
  return defaultAlunos;
}

function renderAlunos(filter = '') {
  const q = filter.toLowerCase().trim();
  const alunos = getAlunos();
  const filtered = alunos.filter(a => {
    if (!q) return true;
    return a.nome.toLowerCase().includes(q) || a.ra.toLowerCase().includes(q);
  });
  const tbody = document.getElementById('alunosBody') as HTMLTableSectionElement;
  if (!tbody) return;
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum aluno encontrado</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(a => `<tr><td>${a.nome}</td><td>${a.ra}</td><td>${a.semestre}</td><td>${a.prova}</td><td>${a.nota}</td></tr>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const user = sessionStorage.getItem('user') || 'Luiz';
  const userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.textContent = `Olá, ${user}`;

  renderAlunos();
  const input = document.getElementById('searchAluno') as HTMLInputElement;
  if (input) input.addEventListener('input', (e) => renderAlunos((e.target as HTMLInputElement).value));

  const sair = document.getElementById('sair');
  if (sair) sair.addEventListener('click', () => { sessionStorage.clear(); window.location.href = '../login/login.html'; });
});
