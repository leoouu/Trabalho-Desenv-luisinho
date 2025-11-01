const disciplinaRepository = require('../repositories/disciplinaRepository');

class DisciplinaService {
    async create(data) {
        return await disciplinaRepository.create(data);
    }

    async findAll() {
        return await disciplinaRepository.findAll();
    }

    async findById(id) {
        return await disciplinaRepository.findById(id);
    }

    async update(id, data) {
        return await disciplinaRepository.update(id, data);
    }

    async delete(id) {
        return await disciplinaRepository.delete(id);
    }
}

module.exports = new DisciplinaService();
