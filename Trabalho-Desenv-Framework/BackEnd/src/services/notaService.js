const notaRepository = require('../repositories/notaRepository');
const Aluno = require('../models/Aluno');

class NotaService {
    async create(data) {
        return await notaRepository.create(data);
    }

    async findAll(user) {
        if (user.cargo === 'aluno') {
            const aluno = await Aluno.findOne({ where: { ra: user.ra } });
            if (!aluno) {
                return []; // Or throw an error
            }
            return await notaRepository.findAllByAlunoId(aluno.id);
        }
        return await notaRepository.findAll();
    }

    async findById(id) {
        return await notaRepository.findById(id);
    }

    async update(id, data) {
        return await notaRepository.update(id, data);
    }

    async delete(id) {
        return await notaRepository.delete(id);
    }
}

module.exports = new NotaService();
