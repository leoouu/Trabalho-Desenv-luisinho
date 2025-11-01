const disciplinaService = require('../services/disciplinaService');

class DisciplinaController {
    async create(req, res) {
        try {
            const disciplina = await disciplinaService.create(req.body);
            res.status(201).json(disciplina);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const disciplinas = await disciplinaService.findAll();
            res.status(200).json(disciplinas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async findById(req, res) {
        try {
            const disciplina = await disciplinaService.findById(req.params.id);
            if (disciplina) {
                res.status(200).json(disciplina);
            } else {
                res.status(404).json({ message: 'Disciplina not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const disciplina = await disciplinaService.update(req.params.id, req.body);
            if (disciplina) {
                res.status(200).json(disciplina);
            } else {
                res.status(404).json({ message: 'Disciplina not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await disciplinaService.delete(req.params.id);
            if (result) {
                res.status(204).send({ message: 'Disciplina deletada com sucesso' });
            } else {
                res.status(404).json({ message: 'Disciplina not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new DisciplinaController();
