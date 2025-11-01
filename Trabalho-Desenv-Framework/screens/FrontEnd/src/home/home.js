document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // Redirecionar para login se não autenticado
    if (!token || !user) {
        window.location.href = '../login/login.html';
        return;
    }

    // Configurar informações do usuário no header
    setupUserInfo(user);

    // Configurar menu de navegação baseado no cargo
    setupNavigation(user.cargo);

    // Configurar logout
    setupLogout();
});

function setupUserInfo(user) {
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');
    const welcomeName = document.getElementById('welcome-name');

    // Extrair primeiro nome
    const firstName = user.nome ? user.nome.split(' ')[0] : 'Usuário';
    
    userName.textContent = firstName;
    welcomeName.textContent = firstName;
    
    // Traduzir cargo para português
    const roleTranslation = {
        'admin': 'Administrador',
        'professor': 'Professor',
        'aluno': 'Aluno'
    };
    
    userRole.textContent = roleTranslation[user.cargo] || user.cargo;
}

function setupNavigation(cargo) {
    const navLinks = document.getElementById('dynamic-nav-links');
    let menuItems = [];

    switch (cargo) {
        case 'admin':
            menuItems = [
                { icon: 'bi-people', text: 'Usuários', href: '../usuarios/usuarios.html' },
                { icon: 'bi-person-badge', text: 'Professores', href: '../professores/professores.html' },
                { icon: 'bi-person', text: 'Alunos', href: '../alunos/alunos.html' },
                { icon: 'bi-book', text: 'Disciplinas', href: '../disciplinas/disciplinas.html' },
                { icon: 'bi-list-task', text: 'Tarefas', href: '../tarefas/tarefas.html' },
                { icon: 'bi-graph-up', text: 'Notas', href: '../notas/notas.html' }
            ];
            break;

        case 'professor':
            menuItems = [
                { icon: 'bi-book', text: 'Disciplinas', href: '../disciplinas/disciplinas.html' },
                { icon: 'bi-list-task', text: 'Tarefas', href: '../tarefas/tarefas.html' },
                { icon: 'bi-graph-up', text: 'Notas', href: '../notas/notas.html' }
            ];
            break;

        case 'aluno':
            menuItems = [
                { icon: 'bi-graph-up', text: 'Minhas Notas', href: '../notas/notas.html' }
            ];
            break;

        default:
            menuItems = [
            ];
    }

    // Renderizar menu
    menuItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = item.href;
        a.innerHTML = `<i class="${item.icon} me-1"></i>${item.text}`;
        
        // Destacar página atual
        if (window.location.href.includes(item.href) && item.href !== '#') {
            a.classList.add('active');
        }
        
        li.appendChild(a);
        navLinks.appendChild(li);
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Limpar dados do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirecionar para login
        window.location.href = '../login/login.html';
    });
}
