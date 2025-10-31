const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userRepository = require('../repositories/userRepository')

const JWT_SECRET = 'PenaltiFoiPIX'

class UserService {
    async register(userData) {
        const { cargo, email, senha } = userData

        const usuarioExistente = await userRepository.findByEmail(email)
        if (usuarioExistente) {
            throw new Error('E-mail já existente')
        }

        const senhaHash = await bcrypt.hash(senha, 10)
        const novoUsuario = await userRepository.create({
            cargo,
            email,
            senha: senhaHash
        })

        return { message: 'Usuario Cadastrado' }
    }

    async login(loginData) {
        // accept identifier, username or email
        const identifier = loginData.identifier || loginData.username || loginData.email || loginData.ra
        const { senha } = loginData

        if (!identifier || !senha) {
            throw new Error('Credenciais Invalidas')
        }

        // try to find by email or ra
        const usuario = await userRepository.findByEmailOrRa(identifier)
        if (!usuario) {
            throw new Error('Credenciais Invalidas')
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValida) {
            throw new Error('Credenciais Invalidas')
        }

        const token = jwt.sign(
            { ra: usuario.ra, email: usuario.email, cargo: usuario.cargo },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        return { token }
    }
}

module.exports = new UserService()