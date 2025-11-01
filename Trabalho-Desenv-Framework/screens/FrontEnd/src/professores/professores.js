// Variáveis globais
let professores = [];
let professoresFiltrados = [];
let usuarios = [];
let idParaDeletar = null;
let modoEdicao = false;

// Elementos DOM
const searchInput = document.getElementById('search-input');
const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
const professoresTableBody = document.getElementById('professores-table-body');
const professorModal = new bootstrap.Modal(document.getElementById('professorModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const btnNovoProfessor = document.getElementById('btn-novo-professor');
const btnSalvarProfessor = document.getElementById('btn-salvar-professor');
const btnConfirmarDelete = document.getElementById('btn-confirmar-delete');
const professorForm = document.getElementById('professor-form');
const formError = document.getElementById('form-error');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    setupEventListeners();
    carregarProfessores();
    carregarUsuarios();
    carregarUsuarioLogado();
});

function verificarAutenticacao() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user || user.cargo !== 'admin') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = '../home/home.html';
    }
}

function carregarUsuarioLogado() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.nome) {
        const firstName = user.nome.split(' ')[0];
        document.getElementById('user-name').textContent = firstName;
    }
}

function setupEventListeners() {
    // Pesquisa e filtros
    searchInput.addEventListener('input', filtrarProfessores);
    btnLimparFiltros.addEventListener('click', limparFiltros);

    // Botões principais
    btnNovoProfessor.addEventListener('click', abrirModalNovo);
    btnSalvarProfessor.addEventListener('click', salvarProfessor);
    btnConfirmarDelete.addEventListener('click', confirmarDelete);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../login/login.html';
    });
}

async function carregarProfessores() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:3000/professor', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            professores = await response.json();
            professoresFiltrados = [...professores];
            renderizarTabela();
        } else {
            mostrarErro('Erro ao carregar professores');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao conectar com o servidor');
    }
}

async function carregarUsuarios() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            usuarios = await response.json();
            popularSelectUsuarios();
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

function popularSelectUsuarios() {
    const select = document.getElementById('professor-ra');
    
    // Limpar opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Sem usuário vinculado</option>';
    
    // Filtrar apenas usuários com cargo 'professor'
    const usuariosProfessores = usuarios.filter(u => u.cargo === 'professor');
    
    // Adicionar usuários
    usuariosProfessores.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.ra;
        option.textContent = `${usuario.ra} - ${usuario.email}`;
        select.appendChild(option);
    });
}

function renderizarTabela() {
    if (professoresFiltrados.length === 0) {
        professoresTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Nenhum professor encontrado
                </td>
            </tr>
        `;
        return;
    }

    professoresTableBody.innerHTML = professoresFiltrados.map(professor => {
        return `
            <tr>
                <td>${professor.id}</td>
                <td>${professor.nome}</td>
                <td>${professor.cpf}</td>
                <td>${professor.telefone}</td>
                <td>${professor.ra}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-1" onclick="editarProfessor(${professor.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirModalDelete(${professor.id}, '${professor.nome}')" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filtrarProfessores() {
    const searchTerm = searchInput.value.toLowerCase();

    professoresFiltrados = professores.filter(professor => {
        return professor.id.toString().includes(searchTerm) ||
               professor.nome.toLowerCase().includes(searchTerm) ||
               professor.cpf.toLowerCase().includes(searchTerm) ||
               professor.telefone.toLowerCase().includes(searchTerm) ||
               professor.ra.toString().includes(searchTerm);
    });

    renderizarTabela();
}

function limparFiltros() {
    searchInput.value = '';
    professoresFiltrados = [...professores];
    renderizarTabela();
}

function abrirModalNovo() {
    modoEdicao = false;
    professorForm.reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('professorModalLabel').textContent = 'Novo Professor';
    formError.classList.add('d-none');
}

function editarProfessor(id) {
    modoEdicao = true;
    const professor = professores.find(p => p.id === id);
    
    if (!professor) return;

    document.getElementById('edit-id').value = professor.id;
    document.getElementById('professor-nome').value = professor.nome;
    document.getElementById('professor-cpf').value = professor.cpf;
    document.getElementById('professor-telefone').value = professor.telefone;
    document.getElementById('professor-ra').value = professor.ra;
    document.getElementById('professorModalLabel').textContent = 'Editar Professor';
    formError.classList.add('d-none');

    professorModal.show();
}

async function salvarProfessor() {
    if (!professorForm.checkValidity()) {
        professorForm.reportValidity();
        return;
    }

    const token = localStorage.getItem('token');
    const nome = document.getElementById('professor-nome').value;
    const cpf = document.getElementById('professor-cpf').value;
    const telefone = document.getElementById('professor-telefone').value;
    const raInput = document.getElementById('professor-ra').value;
    const ra = raInput ? parseInt(raInput) : null;

    const professorData = { nome, cpf, telefone };
    if (ra !== null) {
        professorData.ra = ra;
    }

    try {
        let response;
        
        if (modoEdicao) {
            const id = document.getElementById('edit-id').value;
            response = await fetch(`http://localhost:3000/professor/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(professorData)
            });
        } else {
            response = await fetch('http://localhost:3000/professor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(professorData)
            });
        }

        if (response.ok) {
            professorModal.hide();
            await carregarProfessores();
            mostrarSucesso(modoEdicao ? 'Professor atualizado com sucesso!' : 'Professor criado com sucesso!');
        } else {
            const error = await response.json();
            mostrarErroForm(error.message || 'Erro ao salvar professor');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarErroForm('Erro ao conectar com o servidor');
    }
}

function abrirModalDelete(id, nome) {
    idParaDeletar = id;
    document.getElementById('delete-id').textContent = id;
    document.getElementById('delete-nome').textContent = nome;
    deleteModal.show();
}

async function confirmarDelete() {
    if (!idParaDeletar) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/professor/${idParaDeletar}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            deleteModal.hide();
            await carregarProfessores();
            mostrarSucesso('Professor excluído com sucesso!');
        } else {
            const error = await response.json();
            alert(error.message || 'Erro ao excluir professor');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

function mostrarErroForm(mensagem) {
    formError.textContent = mensagem;
    formError.classList.remove('d-none');
}

function mostrarErro(mensagem) {
    professoresTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
                ${mensagem}
            </td>
        </tr>
    `;
}

function mostrarSucesso(mensagem) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '11';
    toastContainer.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header bg-success text-white">
                <i class="bi bi-check-circle me-2"></i>
                <strong class="me-auto">Sucesso</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${mensagem}
            </div>
        </div>
    `;
    document.body.appendChild(toastContainer);

    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}
