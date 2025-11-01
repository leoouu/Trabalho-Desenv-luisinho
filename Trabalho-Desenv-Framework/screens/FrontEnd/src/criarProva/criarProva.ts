// criarProva.ts
import { TipoAtividade } from '../enums/tipoAtividade.enum';

type TipoAtividadeType = TipoAtividade.Prova | TipoAtividade.Atividade;

function populateTipoSelect() {
  const sel = document.getElementById('tipoAtividade') as HTMLSelectElement | null;
  if (!sel) return;
  sel.innerHTML = Object.values(TipoAtividade).map(v => `<option value="${v}">${v.charAt(0).toUpperCase() + v.slice(1)}</option>`).join('');
}

interface Atividade { nome: string; disciplina: string; tipo: TipoAtividadeType; abertura?: string; fechamento?: string }

function getAtividades(): Atividade[] {
  const raw = localStorage.getItem('atividades');
  return raw ? JSON.parse(raw) as Atividade[] : [];
}

function saveAtividades(p: Atividade[]) { localStorage.setItem('atividades', JSON.stringify(p)); }

document.addEventListener('DOMContentLoaded', () => {
  populateTipoSelect();
  const form = document.getElementById('formProva') as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = (document.getElementById('nomeAtividade') as HTMLInputElement).value.trim();
      const disciplina = (document.getElementById('disciplina') as HTMLInputElement).value.trim();
      const tipo = (document.getElementById('tipoAtividade') as HTMLSelectElement).value as TipoAtividadeType;
      const abertura = (document.getElementById('abertura') as HTMLInputElement).value || undefined;
      const fechamento = (document.getElementById('fechamento') as HTMLInputElement).value || undefined;

      if (!nome || !disciplina) { alert('Preencha todos os campos obrigatórios.'); return; }

      const atividades = getAtividades();
      atividades.unshift({ nome, disciplina, tipo, abertura, fechamento });
      saveAtividades(atividades);
      alert(`Atividade "${nome}" criada com sucesso!`);
      window.location.href = '../avaliacoes/avaliacoes.html';
    });
  }
});
