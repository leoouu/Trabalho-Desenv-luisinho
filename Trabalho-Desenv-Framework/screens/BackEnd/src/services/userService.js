const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userRepository = require('../repositories/userRepository')
const Aluno = require('../models/Aluno')
const Professor = require('../models/Professor')

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

        // Buscar nome do usuário baseado no cargo
        let nome = null
        if (usuario.cargo === 'aluno') {
            const aluno = await Aluno.findOne({ where: { ra: usuario.ra } })
            nome = aluno ? aluno.nome : null
        } else if (usuario.cargo === 'professor') {
            const professor = await Professor.findOne({ where: { ra: usuario.ra } })
            nome = professor ? professor.nome : null
        } else if (usuario.cargo === 'admin') {
            nome = 'Administrador'
        }

        const token = jwt.sign(
            { ra: usuario.ra, email: usuario.email, cargo: usuario.cargo },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        return { 
            token,
            user: {
                ra: usuario.ra,
                email: usuario.email,
                cargo: usuario.cargo,
                nome: nome
            }
        }
    }

    async findAll() {
        return await userRepository.findAll()
    }

    async findByRa(ra) {
        const user = await userRepository.findByRa(ra)
        if (!user) {
            throw new Error('Usuário não encontrado')
        }
        return user
    }

    async updateByRa(ra, data) {
        // allow updating cargo, email, senha
        const updateData = { }
        if (data.cargo) updateData.cargo = data.cargo
        if (data.email) updateData.email = data.email
        if (data.senha) updateData.senha = await bcrypt.hash(data.senha, 10)

        const updated = await userRepository.updateByRa(ra, updateData)
        if (!updated) {
            throw new Error('Usuário não encontrado')
        }
        return updated
    }

    async deleteByRa(ra) {
        const deleted = await userRepository.deleteByRa(ra)
        if (!deleted) {
            throw new Error('Usuário não encontrado')
        }
        return { message: 'Usuário removido com sucesso' }
    }
}

module.exports = new UserService()