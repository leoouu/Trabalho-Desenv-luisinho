// dados e render simples para a lista de professores
const defaultProfessores = [
  { nome: 'Ana Pereira', ra: '20230010', cpf: '111.222.333-44', telefone: '(11) 99999-0001' },
  { nome: 'Bruno Almeida', ra: '20230011', cpf: '222.333.444-55', telefone: '(11) 99999-0002' }
];

function getProfessores() {
  const raw = localStorage.getItem('professores');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('professores', JSON.stringify(defaultProfessores));
  return defaultProfessores;
}

function renderProfessores(filter = '') {
  const q = (filter || '').toLowerCase().trim();
  const profs = getProfessores();
  const filtered = profs.filter(p => {
    if (!q) return true;
    return p.nome.toLowerCase().includes(q) ||
           p.ra.toLowerCase().includes(q) ||
           p.cpf.toLowerCase().includes(q) ||
           p.telefone.toLowerCase().includes(q);
  });
  const tbody = document.getElementById('professoresBody');
  if (!tbody) return;
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum professor encontrado</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>${p.nome}</td>
      <td>${p.ra}</td>
      <td>${p.cpf}</td>
      <td>${p.telefone}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // Sempre renderiza a lista de professores (sem validação de role)
  renderProfessores();
  const input = document.getElementById('searchProfessor');
  if (input) input.addEventListener('input', e => renderProfessores((e.target).value || ''));
});
