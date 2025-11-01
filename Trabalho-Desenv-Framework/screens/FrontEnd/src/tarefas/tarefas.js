const API_URL = 'http://localhost:3000';
let tarefasData = [];
let disciplinasData = [];
let currentUser = null;
let isAdmin = false;

// Configurar navegação e verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    setupNavigation();
    carregarTarefas();
    carregarDisciplinas();
    setupEventListeners();
});

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        window.location.href = '../login/login.html';
        return;
    }

    currentUser = JSON.parse(user);
    isAdmin = currentUser.cargo === 'admin';
    const isProfessor = currentUser.cargo === 'professor';

    // Verificar se tem permissão
    if (!isAdmin && !isProfessor) {
        alert('Acesso negado. Apenas administradores e professores podem acessar esta página.');
        window.location.href = '../home/home.html';
        return;
    }

    // Exibir nome do usuário
    document.getElementById('user-name').textContent = currentUser.nome || currentUser.email;
}

function setupNavigation() {
    const navLinks = document.getElementById('dynamic-nav-links');
    
    const links = {
        admin: [
            { href: '../usuarios/usuarios.html', icon: 'bi-people', text: 'Usuários' },
            { href: '../professores/professores.html', icon: 'bi-person-badge', text: 'Professores' },
            { href: '../alunos/alunos.html', icon: 'bi-mortarboard', text: 'Alunos' },
            { href: '../disciplinas/disciplinas.html', icon: 'bi-book', text: 'Disciplinas' },
            { href: '../tarefas/tarefas.html', icon: 'bi-list-task', text: 'Tarefas', active: true },
            { href: '../notas/notas.html', icon: 'bi-graph-up', text: 'Notas' }
        ],
        professor: [
            { href: '../disciplinas/disciplinas.html', icon: 'bi-book', text: 'Disciplinas' },
            { href: '../tarefas/tarefas.html', icon: 'bi-list-task', text: 'Tarefas', active: true },
            { href: '../notas/notas.html', icon: 'bi-graph-up', text: 'Notas' }
        ]
    };

    const userLinks = links[currentUser.cargo] || [];
    navLinks.innerHTML = userLinks.map(link => `
        <li class="nav-item">
            <a class="nav-link ${link.active ? 'active' : ''}" href="${link.href}">
                <i class="${link.icon} me-1"></i>${link.text}
            </a>
        </li>
    `).join('');

    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../login/login.html';
    });
}

function setupEventListeners() {
    // Pesquisa e filtros
    document.getElementById('search-input').addEventListener('input', filtrarTarefas);
    document.getElementById('filter-tipo').addEventListener('change', filtrarTarefas);
    document.getElementById('btn-limpar-filtros').addEventListener('click', limparFiltros);

    // Salvar tarefa
    document.getElementById('btn-salvar-tarefa').addEventListener('click', salvarTarefa);
    
    // Limpar formulário ao abrir modal
    document.getElementById('tarefaModal').addEventListener('show.bs.modal', () => {
        document.getElementById('form-error').classList.add('d-none');
    });

    // Resetar formulário ao fechar modal
    document.getElementById('tarefaModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('tarefa-form').reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('tarefaModalLabel').textContent = 'Nova Tarefa';
    });
}

async function carregarTarefas() {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('tarefas-table-body');

    try {
        const response = await fetch(`${API_URL}/task`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }

        tarefasData = await response.json();
        renderizarTabela(tarefasData);
    } catch (error) {
        console.error('Erro:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    Erro ao carregar tarefas. Tente novamente.
                </td>
            </tr>
        `;
    }
}

async function carregarDisciplinas() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/disciplina`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar disciplinas');
        }

        disciplinasData = await response.json();
        popularSelectDisciplinas();
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
    }
}

function popularSelectDisciplinas() {
    const select = document.getElementById('tarefa-disciplina-id');
    
    // Limpar opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Selecione uma disciplina...</option>';
    
    // Adicionar disciplinas
    disciplinasData.forEach(disciplina => {
        const option = document.createElement('option');
        option.value = disciplina.id;
        option.textContent = disciplina.nome;
        select.appendChild(option);
    });
}

function renderizarTabela(tarefas) {
    const tableBody = document.getElementById('tarefas-table-body');

    if (tarefas.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    <i class="bi bi-inbox me-2"></i>
                    Nenhuma tarefa encontrada
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = tarefas.map(tarefa => {
        const disciplinaNome = tarefa.Disciplina ? tarefa.Disciplina.nome : `ID: ${tarefa.disciplina_id}`;
        const tipoBadge = tarefa.tipo === 'prova' ? 'bg-danger' : 'bg-primary';
        const tipoTexto = tarefa.tipo.charAt(0).toUpperCase() + tarefa.tipo.slice(1);

        // Formatar datas
        const abertura = formatarDataHora(tarefa.abertura);
        const fechamento = formatarDataHora(tarefa.fechamento);

        return `
            <tr>
                <td>${tarefa.id}</td>
                <td>${tarefa.nome}</td>
                <td>${disciplinaNome}</td>
                <td><span class="badge ${tipoBadge}">${tipoTexto}</span></td>
                <td>${abertura}</td>
                <td>${fechamento}</td>
                <td>${tarefa.nota_maxima}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editarTarefa(${tarefa.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="confirmarDelete(${tarefa.id}, '${tarefa.nome}')" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function formatarDataHora(dataString) {
    try {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } catch (error) {
        return dataString;
    }
}

function filtrarTarefas() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const tipoFilter = document.getElementById('filter-tipo').value;

    const filtered = tarefasData.filter(tarefa => {
        const id = tarefa.id.toString();
        const nome = tarefa.nome.toLowerCase();
        const disciplinaNome = tarefa.Disciplina ? tarefa.Disciplina.nome.toLowerCase() : '';
        
        const matchSearch = id.includes(searchTerm) || 
                          nome.includes(searchTerm) || 
                          disciplinaNome.includes(searchTerm);
        
        const matchTipo = !tipoFilter || tarefa.tipo === tipoFilter;

        return matchSearch && matchTipo;
    });

    renderizarTabela(filtered);
}

function limparFiltros() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-tipo').value = '';
    renderizarTabela(tarefasData);
}

function editarTarefa(id) {
    const tarefa = tarefasData.find(t => t.id === id);
    if (!tarefa) return;

    document.getElementById('tarefaModalLabel').textContent = 'Editar Tarefa';
    document.getElementById('edit-id').value = tarefa.id;
    document.getElementById('tarefa-nome').value = tarefa.nome;
    document.getElementById('tarefa-tipo').value = tarefa.tipo;
    document.getElementById('tarefa-disciplina-id').value = tarefa.disciplina_id;
    document.getElementById('tarefa-nota-maxima').value = tarefa.nota_maxima;
    
    // Converter datas para formato datetime-local
    document.getElementById('tarefa-abertura').value = converterParaDatetimeLocal(tarefa.abertura);
    document.getElementById('tarefa-fechamento').value = converterParaDatetimeLocal(tarefa.fechamento);

    const modal = new bootstrap.Modal(document.getElementById('tarefaModal'));
    modal.show();
}

function converterParaDatetimeLocal(dataString) {
    try {
        const data = new Date(dataString);
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    } catch (error) {
        return '';
    }
}

async function salvarTarefa() {
    const formError = document.getElementById('form-error');
    formError.classList.add('d-none');

    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('tarefa-nome').value.trim();
    const tipo = document.getElementById('tarefa-tipo').value;
    const disciplinaId = document.getElementById('tarefa-disciplina-id').value;
    const abertura = document.getElementById('tarefa-abertura').value;
    const fechamento = document.getElementById('tarefa-fechamento').value;
    const notaMaxima = document.getElementById('tarefa-nota-maxima').value;

    if (!nome || !tipo || !disciplinaId || !abertura || !fechamento || !notaMaxima) {
        formError.textContent = 'Todos os campos são obrigatórios';
        formError.classList.remove('d-none');
        return;
    }

    // Validar datas
    const dataAbertura = new Date(abertura);
    const dataFechamento = new Date(fechamento);
    if (dataFechamento <= dataAbertura) {
        formError.textContent = 'A data de fechamento deve ser posterior à data de abertura';
        formError.classList.remove('d-none');
        return;
    }

    const token = localStorage.getItem('token');
    const payload = {
        nome,
        tipo,
        disciplina_id: parseInt(disciplinaId),
        abertura: new Date(abertura).toISOString(),
        fechamento: new Date(fechamento).toISOString(),
        nota_maxima: parseFloat(notaMaxima)
    };

    try {
        const isEdit = id !== '';
        const url = isEdit ? `${API_URL}/task/${id}` : `${API_URL}/task`;
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao salvar tarefa');
        }

        // Fechar modal e limpar formulário
        const modal = bootstrap.Modal.getInstance(document.getElementById('tarefaModal'));
        modal.hide();
        document.getElementById('tarefa-form').reset();
        document.getElementById('edit-id').value = '';

        // Recarregar tabela
        await carregarTarefas();

    } catch (error) {
        console.error('Erro:', error);
        formError.textContent = error.message;
        formError.classList.remove('d-none');
    }
}

function confirmarDelete(id, nome) {
    document.getElementById('delete-id').textContent = id;
    document.getElementById('delete-nome').textContent = nome;

    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();

    // Configurar botão de confirmar
    document.getElementById('btn-confirmar-delete').onclick = () => deletarTarefa(id);
}

async function deletarTarefa(id) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/task/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir tarefa');
        }

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        // Recarregar tabela
        await carregarTarefas();

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir tarefa. Tente novamente.');
    }
}