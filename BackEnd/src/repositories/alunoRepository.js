const Aluno = require('../models/Aluno');

class AlunoRepository {
    async findAll() {
        return await Aluno.findAll();
    }

    async findById(id) {
        return await Aluno.findByPk(id);
    }

    async create(aluno) {
        return await Aluno.create(aluno);
    }

    async update(id, alunoData) {
        const aluno = await Aluno.findByPk(id);
        if (aluno) {
            return await aluno.update(alunoData);
        }
        return null;
    }

    async delete(id) {
        const aluno = await Aluno.findByPk(id);
        if (aluno) {
            aluno.ativo = false;
            await aluno.save();
            return true;
        }
        return false;
    }
}

module.exports = new AlunoRepository();
