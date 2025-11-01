const Nota = require('../models/Nota');
const Aluno = require('../models/Aluno');
const Task = require('../models/task');

class NotaRepository {
    async create(data) {
        return await Nota.create(data);
    }

    async findAll() {
        return await Nota.findAll({
            include: [
                {
                    model: Aluno,
                    attributes: ['id', 'nome', 'curso']
                },
                {
                    model: Task,
                    attributes: ['id', 'nome', 'tipo', 'nota_maxima']
                }
            ]
        });
    }

    async findAllByAlunoId(alunoId) {
        return await Nota.findAll({ 
            where: { aluno_id: alunoId },
            include: [
                {
                    model: Aluno,
                    attributes: ['id', 'nome', 'curso']
                },
                {
                    model: Task,
                    attributes: ['id', 'nome', 'tipo', 'nota_maxima']
                }
            ]
        });
    }

    async findById(id) {
        return await Nota.findByPk(id, {
            include: [
                {
                    model: Aluno,
                    attributes: ['id', 'nome', 'curso']
                },
                {
                    model: Task,
                    attributes: ['id', 'nome', 'tipo', 'nota_maxima']
                }
            ]
        });
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
