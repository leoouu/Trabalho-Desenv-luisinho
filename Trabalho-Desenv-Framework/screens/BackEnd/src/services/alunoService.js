const alunoRepository = require('../repositories/alunoRepository')

class AlunoService {
    async findAll() {
        return await alunoRepository.findAll()
    }

    async findById(id) {
        const aluno = await alunoRepository.findById(id)
        if (!aluno) {
            throw new Error('Cara tem certeza que é esse id?')
        }
        return aluno
    }

    async create(alunoData) {
        const { nome } = alunoData
        
        if (!nome) {
            throw new Error('Nome é obrigatório')
        }

        return await alunoRepository.create(alunoData)
    }

    async update(id, alunoData) {
        const aluno = await alunoRepository.update(id, alunoData)
        if (!aluno) {
            throw new Error('Cara tem certeza que é esse id?')
        }
        return aluno
    }

    async delete(id) {
        const deleted = await alunoRepository.delete(id)
        if (!deleted) {
            throw new Error('Cara tem certeza que é esse id?')
        }
        return { message: 'Aluno removido com sucesso' }
    }
}

module.exports = new AlunoService()