// Variáveis globais
let usuarios = [];
let usuariosFiltrados = [];
let raParaDeletar = null;
let modoEdicao = false;

// Elementos DOM
const searchInput = document.getElementById('search-input');
const filterCargo = document.getElementById('filter-cargo');
const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
const usuariosTableBody = document.getElementById('usuarios-table-body');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const btnNovoUsuario = document.getElementById('btn-novo-usuario');
const btnSalvarUsuario = document.getElementById('btn-salvar-usuario');
const btnConfirmarDelete = document.getElementById('btn-confirmar-delete');
const userForm = document.getElementById('user-form');
const formError = document.getElementById('form-error');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    setupEventListeners();
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
    searchInput.addEventListener('input', filtrarUsuarios);
    filterCargo.addEventListener('change', filtrarUsuarios);
    btnLimparFiltros.addEventListener('click', limparFiltros);

    // Botões principais
    btnNovoUsuario.addEventListener('click', abrirModalNovo);
    btnSalvarUsuario.addEventListener('click', salvarUsuario);
    btnConfirmarDelete.addEventListener('click', confirmarDelete);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../login/login.html';
    });
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
            usuariosFiltrados = [...usuarios];
            renderizarTabela();
        } else {
            mostrarErro('Erro ao carregar usuários');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao conectar com o servidor');
    }
}

function renderizarTabela() {
    if (usuariosFiltrados.length === 0) {
        usuariosTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Nenhum usuário encontrado
                </td>
            </tr>
        `;
        return;
    }

    usuariosTableBody.innerHTML = usuariosFiltrados.map(usuario => {
        const cargoLabel = {
            'admin': '<span class="badge bg-danger">Administrador</span>',
            'professor': '<span class="badge bg-primary">Professor</span>',
            'aluno': '<span class="badge bg-success">Aluno</span>'
        };

        return `
            <tr>
                <td>${usuario.ra}</td>
                <td>${usuario.email}</td>
                <td>${cargoLabel[usuario.cargo] || usuario.cargo}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${usuario.ra})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirModalDelete(${usuario.ra}, '${usuario.email}')" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filtrarUsuarios() {
    const searchTerm = searchInput.value.toLowerCase();
    const cargoFiltro = filterCargo.value;

    usuariosFiltrados = usuarios.filter(usuario => {
        const matchSearch = 
            usuario.ra.toString().includes(searchTerm) ||
            usuario.email.toLowerCase().includes(searchTerm) ||
            usuario.cargo.toLowerCase().includes(searchTerm);

        const matchCargo = !cargoFiltro || usuario.cargo === cargoFiltro;

        return matchSearch && matchCargo;
    });

    renderizarTabela();
}

function limparFiltros() {
    searchInput.value = '';
    filterCargo.value = '';
    usuariosFiltrados = [...usuarios];
    renderizarTabela();
}

function abrirModalNovo() {
    modoEdicao = false;
    userForm.reset();
    document.getElementById('edit-ra').value = '';
    document.getElementById('userModalLabel').textContent = 'Novo Usuário';
    document.getElementById('senha-group').classList.remove('d-none');
    document.getElementById('user-senha').required = true;
    formError.classList.add('d-none');
}

function editarUsuario(ra) {
    modoEdicao = true;
    const usuario = usuarios.find(u => u.ra === ra);
    
    if (!usuario) return;

    document.getElementById('edit-ra').value = usuario.ra;
    document.getElementById('user-email').value = usuario.email;
    document.getElementById('user-cargo').value = usuario.cargo;
    document.getElementById('userModalLabel').textContent = 'Editar Usuário';
    document.getElementById('senha-group').classList.add('d-none');
    document.getElementById('user-senha').required = false;
    formError.classList.add('d-none');

    userModal.show();
}

async function salvarUsuario() {
    if (!userForm.checkValidity()) {
        userForm.reportValidity();
        return;
    }

    const token = localStorage.getItem('token');
    const email = document.getElementById('user-email').value;
    const cargo = document.getElementById('user-cargo').value;
    const senha = document.getElementById('user-senha').value;

    const userData = { email, cargo };
    if (!modoEdicao || senha) {
        userData.senha = senha;
    }

    try {
        let response;
        
        if (modoEdicao) {
            const ra = document.getElementById('edit-ra').value;
            response = await fetch(`http://localhost:3000/user?ra=${ra}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
        } else {
            response = await fetch('http://localhost:3000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
        }

        if (response.ok) {
            userModal.hide();
            await carregarUsuarios();
            mostrarSucesso(modoEdicao ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        } else {
            const error = await response.json();
            mostrarErroForm(error.message || 'Erro ao salvar usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarErroForm('Erro ao conectar com o servidor');
    }
}

function abrirModalDelete(ra, email) {
    raParaDeletar = ra;
    document.getElementById('delete-ra').textContent = ra;
    document.getElementById('delete-email').textContent = email;
    deleteModal.show();
}

async function confirmarDelete() {
    if (!raParaDeletar) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/user?ra=${raParaDeletar}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            deleteModal.hide();
            await carregarUsuarios();
            mostrarSucesso('Usuário excluído com sucesso!');
        } else {
            const error = await response.json();
            alert(error.message || 'Erro ao excluir usuário');
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
    usuariosTableBody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
                ${mensagem}
            </td>
        </tr>
    `;
}

function mostrarSucesso(mensagem) {
    // Criar toast de sucesso
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
