const API_URL = 'http://localhost:3000';
let notasData = [];
let alunosData = [];
let tarefasData = [];
let currentUser = null;
let isAdmin = false;
let isProfessor = false;
let isAluno = false;

// Configurar navegação e verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    setupNavigation();
    carregarNotas();
    if (isAdmin || isProfessor) {
        carregarAlunos();
        carregarTarefas();
    }
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
    isProfessor = currentUser.cargo === 'professor';
    isAluno = currentUser.cargo === 'aluno';

    // Exibir nome do usuário
    document.getElementById('user-name').textContent = currentUser.nome || currentUser.email;

    // Configurar permissões
    configurarPermissoes();
}

function configurarPermissoes() {
    const btnNovaNota = document.getElementById('btn-nova-nota');
    const acoesHeader = document.getElementById('acoes-header');
    const alunoHeader = document.getElementById('aluno-header');

    if (isAluno) {
        // Aluno: apenas visualização, sem criar/editar/deletar
        btnNovaNota.classList.add('d-none');
        acoesHeader.classList.add('d-none');
        // Ocultar coluna de aluno (já que só vê suas próprias notas)
        alunoHeader.classList.add('d-none');
    } else {
        // Admin e Professor: CRUD completo
        btnNovaNota.classList.remove('d-none');
    }
}

function setupNavigation() {
    const navLinks = document.getElementById('dynamic-nav-links');
    
    const links = {
        admin: [
            { href: '../usuarios/usuarios.html', icon: 'bi-people', text: 'Usuários' },
            { href: '../professores/professores.html', icon: 'bi-person-badge', text: 'Professores' },
            { href: '../alunos/alunos.html', icon: 'bi-mortarboard', text: 'Alunos' },
            { href: '../disciplinas/disciplinas.html', icon: 'bi-book', text: 'Disciplinas' },
            { href: '../tarefas/tarefas.html', icon: 'bi-list-task', text: 'Tarefas' },
            { href: '../notas/notas.html', icon: 'bi-graph-up', text: 'Notas', active: true }
        ],
        professor: [
            { href: '../disciplinas/disciplinas.html', icon: 'bi-book', text: 'Disciplinas' },
            { href: '../tarefas/tarefas.html', icon: 'bi-list-task', text: 'Tarefas' },
            { href: '../notas/notas.html', icon: 'bi-graph-up', text: 'Notas', active: true }
        ],
        aluno: [
            { href: '../notas/notas.html', icon: 'bi-graph-up', text: 'Minhas Notas', active: true }
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
    document.getElementById('search-input').addEventListener('input', filtrarNotas);
    document.getElementById('filter-tipo').addEventListener('change', filtrarNotas);
    document.getElementById('btn-limpar-filtros').addEventListener('click', limparFiltros);

    if (isAdmin || isProfessor) {
        // Salvar nota
        document.getElementById('btn-salvar-nota').addEventListener('click', salvarNota);
        
        // Limpar formulário ao abrir modal
        document.getElementById('notaModal').addEventListener('show.bs.modal', () => {
            document.getElementById('form-error').classList.add('d-none');
        });

        // Resetar formulário ao fechar modal
        document.getElementById('notaModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('nota-form').reset();
            document.getElementById('edit-id').value = '';
            document.getElementById('notaModalLabel').textContent = 'Nova Nota';
            document.getElementById('nota-maxima-info').textContent = '';
        });

        // Atualizar info de nota máxima ao selecionar tarefa
        document.getElementById('nota-task-id').addEventListener('change', atualizarNotaMaxima);
    }
}

async function carregarNotas() {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('notas-table-body');

    try {
        const response = await fetch(`${API_URL}/nota`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar notas');
        }

        notasData = await response.json();
        renderizarTabela(notasData);
    } catch (error) {
        console.error('Erro:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    Erro ao carregar notas. Tente novamente.
                </td>
            </tr>
        `;
    }
}

async function carregarAlunos() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/aluno`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar alunos');
        }

        alunosData = await response.json();
        popularSelectAlunos();
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
    }
}

function popularSelectAlunos() {
    const select = document.getElementById('nota-aluno-id');
    
    // Limpar opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Selecione um aluno...</option>';
    
    // Adicionar alunos
    alunosData.forEach(aluno => {
        const option = document.createElement('option');
        option.value = aluno.id;
        option.textContent = `${aluno.nome} - ${aluno.curso}`;
        select.appendChild(option);
    });
}

async function carregarTarefas() {
    const token = localStorage.getItem('token');

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
        popularSelectTarefas();
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

function popularSelectTarefas() {
    const select = document.getElementById('nota-task-id');
    
    // Limpar opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Selecione uma tarefa...</option>';
    
    // Adicionar tarefas
    tarefasData.forEach(tarefa => {
        const option = document.createElement('option');
        option.value = tarefa.id;
        option.dataset.notaMaxima = tarefa.nota_maxima;
        const tipo = tarefa.tipo.charAt(0).toUpperCase() + tarefa.tipo.slice(1);
        option.textContent = `${tarefa.nome} (${tipo}) - Máx: ${tarefa.nota_maxima}`;
        select.appendChild(option);
    });
}

function atualizarNotaMaxima() {
    const select = document.getElementById('nota-task-id');
    const selectedOption = select.options[select.selectedIndex];
    const infoDiv = document.getElementById('nota-maxima-info');
    
    if (selectedOption.value) {
        const notaMaxima = selectedOption.dataset.notaMaxima;
        infoDiv.textContent = `Nota máxima desta tarefa: ${notaMaxima}`;
        document.getElementById('nota-valor').setAttribute('max', notaMaxima);
    } else {
        infoDiv.textContent = '';
        document.getElementById('nota-valor').removeAttribute('max');
    }
}

function renderizarTabela(notas) {
    const tableBody = document.getElementById('notas-table-body');

    if (notas.length === 0) {
        const colspan = isAluno ? '7' : '8';
        tableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}" class="text-center text-muted">
                    <i class="bi bi-inbox me-2"></i>
                    Nenhuma nota encontrada
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = notas.map(nota => {
        const alunoNome = nota.Aluno ? nota.Aluno.nome : `ID: ${nota.aluno_id}`;
        const tarefaNome = nota.Task ? nota.Task.nome : `ID: ${nota.task_id}`;
        const tarefaTipo = nota.Task ? nota.Task.tipo : '';
        const notaMaxima = nota.Task ? nota.Task.nota_maxima : 0;
        
        const tipoBadge = tarefaTipo === 'prova' ? 'bg-danger' : 'bg-primary';
        const tipoTexto = tarefaTipo ? tarefaTipo.charAt(0).toUpperCase() + tarefaTipo.slice(1) : 'N/A';

        // Calcular desempenho
        const percentual = notaMaxima > 0 ? (nota.nota / notaMaxima * 100).toFixed(1) : 0;
        let desempenhoClass = 'text-danger';
        let desempenhoIcon = 'bi-x-circle';
        
        if (percentual >= 70) {
            desempenhoClass = 'text-success';
            desempenhoIcon = 'bi-check-circle';
        } else if (percentual >= 50) {
            desempenhoClass = 'text-warning';
            desempenhoIcon = 'bi-exclamation-circle';
        }

        // Coluna de aluno (oculta para alunos)
        const alunoColumn = !isAluno ? `<td>${alunoNome}</td>` : '';

        // Coluna de ações (oculta para alunos)
        const acoesColumn = !isAluno ? `
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editarNota(${nota.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmarDelete(${nota.id})" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        ` : '';

        return `
            <tr>
                <td>${nota.id}</td>
                ${alunoColumn}
                <td>${tarefaNome}</td>
                <td><span class="badge ${tipoBadge}">${tipoTexto}</span></td>
                <td><strong>${nota.nota}</strong></td>
                <td>${notaMaxima}</td>
                <td>
                    <i class="${desempenhoIcon} ${desempenhoClass} me-1"></i>
                    <span class="${desempenhoClass}">${percentual}%</span>
                </td>
                ${acoesColumn}
            </tr>
        `;
    }).join('');
}

function filtrarNotas() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const tipoFilter = document.getElementById('filter-tipo').value;

    const filtered = notasData.filter(nota => {
        const id = nota.id.toString();
        const alunoNome = nota.Aluno ? nota.Aluno.nome.toLowerCase() : '';
        const tarefaNome = nota.Task ? nota.Task.nome.toLowerCase() : '';
        const tarefaTipo = nota.Task ? nota.Task.tipo : '';
        
        const matchSearch = id.includes(searchTerm) || 
                          alunoNome.includes(searchTerm) || 
                          tarefaNome.includes(searchTerm);
        
        const matchTipo = !tipoFilter || tarefaTipo === tipoFilter;

        return matchSearch && matchTipo;
    });

    renderizarTabela(filtered);
}

function limparFiltros() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-tipo').value = '';
    renderizarTabela(notasData);
}

function editarNota(id) {
    const nota = notasData.find(n => n.id === id);
    if (!nota) return;

    document.getElementById('notaModalLabel').textContent = 'Editar Nota';
    document.getElementById('edit-id').value = nota.id;
    document.getElementById('nota-aluno-id').value = nota.aluno_id;
    document.getElementById('nota-task-id').value = nota.task_id;
    document.getElementById('nota-valor').value = nota.nota;
    
    atualizarNotaMaxima();

    const modal = new bootstrap.Modal(document.getElementById('notaModal'));
    modal.show();
}

async function salvarNota() {
    const formError = document.getElementById('form-error');
    formError.classList.add('d-none');

    const id = document.getElementById('edit-id').value;
    const alunoId = document.getElementById('nota-aluno-id').value;
    const taskId = document.getElementById('nota-task-id').value;
    const notaValor = document.getElementById('nota-valor').value;

    if (!alunoId || !taskId || !notaValor) {
        formError.textContent = 'Todos os campos são obrigatórios';
        formError.classList.remove('d-none');
        return;
    }

    // Validar nota máxima
    const selectedTask = tarefasData.find(t => t.id == taskId);
    if (selectedTask && parseFloat(notaValor) > selectedTask.nota_maxima) {
        formError.textContent = `A nota não pode ser maior que a nota máxima (${selectedTask.nota_maxima})`;
        formError.classList.remove('d-none');
        return;
    }

    const token = localStorage.getItem('token');
    const payload = {
        aluno_id: parseInt(alunoId),
        task_id: parseInt(taskId),
        nota: parseFloat(notaValor)
    };

    try {
        const isEdit = id !== '';
        const url = isEdit ? `${API_URL}/nota/${id}` : `${API_URL}/nota`;
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
            throw new Error(errorData.message || 'Erro ao salvar nota');
        }

        // Fechar modal e limpar formulário
        const modal = bootstrap.Modal.getInstance(document.getElementById('notaModal'));
        modal.hide();
        document.getElementById('nota-form').reset();
        document.getElementById('edit-id').value = '';

        // Recarregar tabela
        await carregarNotas();

    } catch (error) {
        console.error('Erro:', error);
        formError.textContent = error.message;
        formError.classList.remove('d-none');
    }
}

function confirmarDelete(id) {
    document.getElementById('delete-id').textContent = id;

    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();

    // Configurar botão de confirmar
    document.getElementById('btn-confirmar-delete').onclick = () => deletarNota(id);
}

async function deletarNota(id) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/nota/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir nota');
        }

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        // Recarregar tabela
        await carregarNotas();

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir nota. Tente novamente.');
    }
}