const Disciplina = require('../models/Disciplina');

class DisciplinaRepository {
    async create(data) {
        return await Disciplina.create(data);
    }

    async findAll() {
        return await Disciplina.findAll();
    }

    async findById(id) {
        return await Disciplina.findByPk(id);
    }

    async update(id, data) {
        const disciplina = await Disciplina.findByPk(id);
        if (disciplina) {
            return await disciplina.update(data);
        }
        return null;
    }

    async delete(id) {
        const disciplina = await Disciplina.findByPk(id);
        if (disciplina) {
            return await disciplina.destroy();
        }
        return null;
    }
}

module.exports = new DisciplinaRepository();
