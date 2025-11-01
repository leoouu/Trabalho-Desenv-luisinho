const notaService = require('../services/notaService');

class NotaController {
    async create(req, res) {
        try {
            const nota = await notaService.create(req.body);
            res.status(201).json(nota);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async findAll(req, res) {
        try {
            // The user object is attached to the request by the auth middleware
            const notas = await notaService.findAll(req.user);
            res.status(200).json(notas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async findById(req, res) {
        try {
            const nota = await notaService.findById(req.params.id);
            if (nota) {
                res.status(200).json(nota);
            } else {
                res.status(404).json({ message: 'Nota not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const nota = await notaService.update(req.params.id, req.body);
            if (nota) {
                res.status(200).json(nota);
            } else {
                res.status(404).json({ message: 'Nota not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await notaService.delete(req.params.id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Nota not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new NotaController();
