const Nota = require('../models/Nota');

class NotaRepository {
    async create(data) {
        return await Nota.create(data);
    }

    async findAll() {
        return await Nota.findAll();
    }

    async findAllByAlunoId(alunoId) {
        return await Nota.findAll({ where: { aluno_id: alunoId } });
    }

    async findById(id) {
        return await Nota.findByPk(id);
    }

    async update(id, data) {
        const nota = await Nota.findByPk(id);
        if (nota) {
            return await nota.update(data);
        }
        return null;
    }

    async delete(id) {
        const nota = await Nota.findByPk(id);
        if (nota) {
            await nota.destroy();
            return true;
        }
        return false;
    }
}

module.exports = new NotaRepository();
