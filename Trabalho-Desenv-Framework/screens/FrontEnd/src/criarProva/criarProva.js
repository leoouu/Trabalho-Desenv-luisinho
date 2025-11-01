import { TipoAtividade } from '../enums/tipoAtividade.enum.js';

function populateTipoSelect() {
  const sel = document.getElementById('tipoAtividade');
  if (!sel) return;
  const values = Object.values(TipoAtividade);
  sel.innerHTML = values.map(v => `<option value="${v}">${v}</option>`).join('');
}

function getAtividades() {
  const raw = localStorage.getItem('atividades');
  return raw ? JSON.parse(raw) : [];
}

function saveAtividades(p) { localStorage.setItem('atividades', JSON.stringify(p)); }

document.addEventListener('DOMContentLoaded', () => {
  populateTipoSelect();
  const form = document.getElementById('formProva');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = (document.getElementById('nomeAtividade')).value.trim();
      const disciplina = (document.getElementById('disciplina')).value.trim();
      const tipo = (document.getElementById('tipoAtividade')).value;
      const abertura = (document.getElementById('abertura')).value || undefined;
      const fechamento = (document.getElementById('fechamento')).value || undefined;

      if (!nome || !disciplina) { alert('Preencha todos os campos obrigatórios.'); return; }

      const atividades = getAtividades();
      atividades.unshift({ nome, disciplina, tipo, abertura, fechamento });
      saveAtividades(atividades);
      alert(`Atividade "${nome}" criada com sucesso!`);
      window.location.href = '../avaliacoes/avaliacoes.html';
    });
  }
});
