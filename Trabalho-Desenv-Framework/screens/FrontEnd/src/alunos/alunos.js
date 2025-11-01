// Variáveis globais
let alunos = [];
let alunosFiltrados = [];
let usuarios = [];
let idParaDeletar = null;
let modoEdicao = false;

// Elementos DOM
const searchInput = document.getElementById('search-input');
const filterAtivo = document.getElementById('filter-ativo');
const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
const alunosTableBody = document.getElementById('alunos-table-body');
const alunoModal = new bootstrap.Modal(document.getElementById('alunoModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const btnNovoAluno = document.getElementById('btn-novo-aluno');
const btnSalvarAluno = document.getElementById('btn-salvar-aluno');
const btnConfirmarDelete = document.getElementById('btn-confirmar-delete');
const alunoForm = document.getElementById('aluno-form');
const formError = document.getElementById('form-error');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    setupEventListeners();
    carregarAlunos();
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
    searchInput.addEventListener('input', filtrarAlunos);
    filterAtivo.addEventListener('change', filtrarAlunos);
    btnLimparFiltros.addEventListener('click', limparFiltros);

    // Botões principais
    btnNovoAluno.addEventListener('click', abrirModalNovo);
    btnSalvarAluno.addEventListener('click', salvarAluno);
    btnConfirmarDelete.addEventListener('click', confirmarDelete);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../login/login.html';
    });
}

async function carregarAlunos() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:3000/aluno', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alunos = await response.json();
            alunosFiltrados = [...alunos];
            renderizarTabela();
        } else {
            mostrarErro('Erro ao carregar alunos');
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
    const select = document.getElementById('aluno-ra');
    
    // Limpar opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Sem usuário vinculado</option>';
    
    // Filtrar apenas usuários com cargo 'aluno'
    const usuariosAlunos = usuarios.filter(u => u.cargo === 'aluno');
    
    // Adicionar usuários
    usuariosAlunos.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.ra;
        option.textContent = `${usuario.ra} - ${usuario.email}`;
        select.appendChild(option);
    });
}

function renderizarTabela() {
    if (alunosFiltrados.length === 0) {
        alunosTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Nenhum aluno encontrado
                </td>
            </tr>
        `;
        return;
    }

    alunosTableBody.innerHTML = alunosFiltrados.map(aluno => {
        const statusBadge = aluno.ativo 
            ? '<span class="badge bg-success">Ativo</span>' 
            : '<span class="badge bg-secondary">Inativo</span>';

        return `
            <tr>
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.curso}</td>
                <td>${aluno.semestre}º</td>
                <td>${statusBadge}</td>
                <td>${aluno.ra || '-'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-1" onclick="editarAluno(${aluno.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirModalDelete(${aluno.id}, '${aluno.nome}')" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filtrarAlunos() {
    const searchTerm = searchInput.value.toLowerCase();
    const ativoFiltro = filterAtivo.value;

    alunosFiltrados = alunos.filter(aluno => {
        const matchSearch = 
            aluno.id.toString().includes(searchTerm) ||
            aluno.nome.toLowerCase().includes(searchTerm) ||
            aluno.cpf.toLowerCase().includes(searchTerm) ||
            aluno.curso.toLowerCase().includes(searchTerm) ||
            (aluno.ra && aluno.ra.toString().includes(searchTerm));

        const matchAtivo = !ativoFiltro || aluno.ativo.toString() === ativoFiltro;

        return matchSearch && matchAtivo;
    });

    renderizarTabela();
}

function limparFiltros() {
    searchInput.value = '';
    filterAtivo.value = '';
    alunosFiltrados = [...alunos];
    renderizarTabela();
}

function abrirModalNovo() {
    modoEdicao = false;
    alunoForm.reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('alunoModalLabel').textContent = 'Novo Aluno';
    formError.classList.add('d-none');
}

function editarAluno(id) {
    modoEdicao = true;
    const aluno = alunos.find(a => a.id === id);
    
    if (!aluno) return;

    document.getElementById('edit-id').value = aluno.id;
    document.getElementById('aluno-nome').value = aluno.nome;
    document.getElementById('aluno-cpf').value = aluno.cpf;
    document.getElementById('aluno-nascimento').value = aluno.nascimento;
    document.getElementById('aluno-curso').value = aluno.curso;
    document.getElementById('aluno-semestre').value = aluno.semestre;
    document.getElementById('aluno-ativo').value = aluno.ativo.toString();
    document.getElementById('aluno-ra').value = aluno.ra || '';
    document.getElementById('alunoModalLabel').textContent = 'Editar Aluno';
    formError.classList.add('d-none');

    alunoModal.show();
}

async function salvarAluno() {
    if (!alunoForm.checkValidity()) {
        alunoForm.reportValidity();
        return;
    }

    const token = localStorage.getItem('token');
    const nome = document.getElementById('aluno-nome').value;
    const cpf = document.getElementById('aluno-cpf').value;
    const nascimento = document.getElementById('aluno-nascimento').value;
    const curso = document.getElementById('aluno-curso').value;
    const semestre = parseInt(document.getElementById('aluno-semestre').value);
    const ativo = document.getElementById('aluno-ativo').value === 'true';
    const raInput = document.getElementById('aluno-ra').value;
    const ra = raInput ? parseInt(raInput) : null;

    const alunoData = { nome, cpf, nascimento, curso, semestre, ativo };
    if (ra !== null) {
        alunoData.ra = ra;
    }

    try {
        let response;
        
        if (modoEdicao) {
            const id = document.getElementById('edit-id').value;
            response = await fetch(`http://localhost:3000/aluno/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(alunoData)
            });
        } else {
            response = await fetch('http://localhost:3000/aluno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(alunoData)
            });
        }

        if (response.ok) {
            alunoModal.hide();
            await carregarAlunos();
            mostrarSucesso(modoEdicao ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!');
        } else {
            const error = await response.json();
            mostrarErroForm(error.message || 'Erro ao salvar aluno');
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
        const response = await fetch(`http://localhost:3000/aluno/${idParaDeletar}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            deleteModal.hide();
            await carregarAlunos();
            mostrarSucesso('Aluno excluído com sucesso!');
        } else {
            const error = await response.json();
            alert(error.message || 'Erro ao excluir aluno');
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
    alunosTableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center text-danger">
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
