const professorService = require('../services/professorService');

class ProfessorController {
    async create(req, res) {
        try {
            const professor = await professorService.create(req.body);
            res.status(201).json(professor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const professors = await professorService.findAll();
            res.status(200).json(professors);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async findById(req, res) {
        try {
            const professor = await professorService.findById(req.params.id);
            if (professor) {
                res.status(200).json(professor);
            } else {
                res.status(404).json({ message: 'Professor not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const professor = await professorService.update(req.params.id, req.body);
            if (professor) {
                res.status(200).json(professor);
            } else {
                res.status(404).json({ message: 'Professor not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await professorService.delete(req.params.id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Professor not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ProfessorController();
