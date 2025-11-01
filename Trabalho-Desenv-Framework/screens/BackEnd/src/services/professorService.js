const professorRepository = require('../repositories/professorRepository');

class ProfessorService {
    async create(data) {
        return await professorRepository.create(data);
    }

    async findAll() {
        return await professorRepository.findAll();
    }

    async findById(id) {
        return await professorRepository.findById(id);
    }

    async update(id, data) {
        return await professorRepository.update(id, data);
    }

    async delete(id) {
        return await professorRepository.delete(id);
    }
}

module.exports = new ProfessorService();
