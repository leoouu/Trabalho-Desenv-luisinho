const Professor = require('../models/Professor');

class ProfessorRepository {
    async create(data) {
        return await Professor.create(data);
    }

    async findAll() {
        return await Professor.findAll();
    }

    async findById(id) {
        return await Professor.findByPk(id);
    }

    async update(id, data) {
        const professor = await Professor.findByPk(id);
        if (professor) {
            return await professor.update(data);
        }
        return null;
    }

    async delete(id) {
        const professor = await Professor.findByPk(id);
        if (professor) {
            return await professor.destroy();
        }
        return null;
    }
}

module.exports = new ProfessorRepository();
