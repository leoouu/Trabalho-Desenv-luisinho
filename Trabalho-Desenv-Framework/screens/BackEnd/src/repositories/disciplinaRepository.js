const Disciplina = require('../models/Disciplina');
const Professor = require('../models/Professor');

class DisciplinaRepository {
    async create(data) {
        return await Disciplina.create(data);
    }

    async findAll() {
        return await Disciplina.findAll({
            include: [{
                model: Professor,
                attributes: ['id', 'nome']
            }]
        });
    }

    async findById(id) {
        return await Disciplina.findByPk(id, {
            include: [{
                model: Professor,
                attributes: ['id', 'nome']
            }]
        });
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
