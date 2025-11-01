const API_URL = 'http://localhost:3000';
let disciplinasData = [];
let professoresData = [];
let currentUser = null;
let isAdmin = false;

// Configurar navegação e verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    setupNavigation();
    carregarDisciplinas();
    if (isAdmin) {
        carregarProfessores();
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

    // Exibir nome do usuário
    document.getElementById('user-name').textContent = currentUser.nome || currentUser.email;

    // Mostrar/ocultar elementos baseados no cargo
    configurarPermissoes();
}

function configurarPermissoes() {
    const btnNovaDisciplina = document.getElementById('btn-nova-disciplina');
    const acoesHeader = document.getElementById('acoes-header');

    if (isAdmin) {
        btnNovaDisciplina.classList.remove('d-none');
    } else {
        // Professor: ocultar botão de nova disciplina e coluna de ações
        btnNovaDisciplina.classList.add('d-none');
        acoesHeader.classList.add('d-none');
    }
}

function setupNavigation() {
    const navLinks = document.getElementById('dynamic-nav-links');
    
    const links = {
        admin: [
            { href: '../usuarios/usuarios.html', icon: 'bi-people', text: 'Usuários' },
            { href: '../professores/professores.html', icon: 'bi-person-badge', text: 'Professores' },
            { href: '../alunos/alunos.html', icon: 'bi-person', text: 'Alunos' },
            { href: '../disciplinas/disciplinas.html', icon: 'bi-book', text: 'Disciplinas', active: true },
            { href: '../tarefas/tarefas.html', icon: 'bi-list-task', text: 'Tarefas' },
            { href: '../notas/notas.html', icon: 'bi-graph-up', text: 'Notas' }
        ],
        professor: [
            { href: '../disciplinas/disciplinas.html', icon: 'bi-book', text: 'Disciplinas', active: true },
            { href: '../tarefas/tarefas.html', icon: 'bi-list-task', text: 'Tarefas' },
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
    // Pesquisa
    document.getElementById('search-input').addEventListener('input', filtrarDisciplinas);
    document.getElementById('btn-limpar-filtros').addEventListener('click', limparFiltros);

    // Salvar disciplina (apenas admin)
    if (isAdmin) {
        document.getElementById('btn-salvar-disciplina').addEventListener('click', salvarDisciplina);
        
        // Limpar formulário ao abrir modal
        document.getElementById('disciplinaModal').addEventListener('show.bs.modal', () => {
            document.getElementById('form-error').classList.add('d-none');
        });
    }
}

async function carregarDisciplinas() {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('disciplinas-table-body');

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
        renderizarTabela(disciplinasData);
    } catch (error) {
        console.error('Erro:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    Erro ao carregar disciplinas. Tente novamente.
                </td>
            </tr>
        `;
    }
}

async function carregarProfessores() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/professor`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar professores');
        }

        professoresData = await response.json();
        popularSelectProfessores();
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
    }
}

function popularSelectProfessores() {
    const select = document.getElementById('disciplina-professor-id');
    
    // Limpar opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Selecione um professor...</option>';
    
    // Adicionar professores
    professoresData.forEach(professor => {
        const option = document.createElement('option');
        option.value = professor.id;
        option.textContent = professor.nome;
        select.appendChild(option);
    });
}

function renderizarTabela(disciplinas) {
    const tableBody = document.getElementById('disciplinas-table-body');

    if (disciplinas.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="bi bi-inbox me-2"></i>
                    Nenhuma disciplina encontrada
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = disciplinas.map(disciplina => {
        const acoesColumn = isAdmin ? `
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editarDisciplina(${disciplina.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmarDelete(${disciplina.id}, '${disciplina.nome}')" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        ` : '';

        const professorNome = disciplina.Professor ? disciplina.Professor.nome : `ID: ${disciplina.professor_id}`;

        return `
            <tr>
                <td>${disciplina.id}</td>
                <td>${disciplina.nome}</td>
                <td>${professorNome}</td>
                ${acoesColumn}
            </tr>
        `;
    }).join('');
}

function filtrarDisciplinas() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    const filtered = disciplinasData.filter(disciplina => {
        const id = disciplina.id.toString();
        const nome = disciplina.nome.toLowerCase();
        const professorId = disciplina.professor_id.toString();
        const professorNome = disciplina.Professor ? disciplina.Professor.nome.toLowerCase() : '';

        return id.includes(searchTerm) || 
               nome.includes(searchTerm) || 
               professorId.includes(searchTerm) ||
               professorNome.includes(searchTerm);
    });

    renderizarTabela(filtered);
}

function limparFiltros() {
    document.getElementById('search-input').value = '';
    renderizarTabela(disciplinasData);
}

function editarDisciplina(id) {
    if (!isAdmin) return;

    const disciplina = disciplinasData.find(d => d.id === id);
    if (!disciplina) return;

    document.getElementById('disciplinaModalLabel').textContent = 'Editar Disciplina';
    document.getElementById('edit-id').value = disciplina.id;
    document.getElementById('disciplina-nome').value = disciplina.nome;
    document.getElementById('disciplina-professor-id').value = disciplina.professor_id;

    const modal = new bootstrap.Modal(document.getElementById('disciplinaModal'));
    modal.show();
}

async function salvarDisciplina() {
    if (!isAdmin) return;

    const formError = document.getElementById('form-error');
    formError.classList.add('d-none');

    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('disciplina-nome').value.trim();
    const professorId = document.getElementById('disciplina-professor-id').value.trim();

    if (!nome || !professorId) {
        formError.textContent = 'Nome e ID do Professor são obrigatórios';
        formError.classList.remove('d-none');
        return;
    }

    const token = localStorage.getItem('token');
    const payload = {
        nome,
        professor_id: parseInt(professorId)
    };

    try {
        const isEdit = id !== '';
        const url = isEdit ? `${API_URL}/disciplina/${id}` : `${API_URL}/disciplina`;
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
            throw new Error(errorData.message || 'Erro ao salvar disciplina');
        }

        // Fechar modal e limpar formulário
        const modal = bootstrap.Modal.getInstance(document.getElementById('disciplinaModal'));
        modal.hide();
        document.getElementById('disciplina-form').reset();
        document.getElementById('edit-id').value = '';

        // Recarregar tabela
        await carregarDisciplinas();

    } catch (error) {
        console.error('Erro:', error);
        formError.textContent = error.message;
        formError.classList.remove('d-none');
    }
}

function confirmarDelete(id, nome) {
    if (!isAdmin) return;

    document.getElementById('delete-id').textContent = id;
    document.getElementById('delete-nome').textContent = nome;

    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();

    // Configurar botão de confirmar
    document.getElementById('btn-confirmar-delete').onclick = () => deletarDisciplina(id);
}

async function deletarDisciplina(id) {
    if (!isAdmin) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/disciplina/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir disciplina');
        }

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();

        // Recarregar tabela
        await carregarDisciplinas();

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir disciplina. Tente novamente.');
    }
}