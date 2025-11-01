const Task = require('../models/task');
const Disciplina = require('../models/Disciplina');

class TaskRepository {
    async createTask(data) {
        return await Task.create(data);
    }

    async getAllTasks() {
        return await Task.findAll({
            include: [{
                model: Disciplina,
                attributes: ['id', 'nome']
            }]
        });
    }

    async getTaskById(id) {
        return await Task.findByPk(id, {
            include: [{
                model: Disciplina,
                attributes: ['id', 'nome']
            }]
        });
    }

    async updateTask(id, data) {
        const task = await Task.findByPk(id);
        if (task) {
            return await task.update(data);
        }
        return null;
    }

    async deleteTask(id) {
        const task = await Task.findByPk(id);
        if (task) {
            return await task.destroy();
        }
        return null;
    }
}

module.exports = new TaskRepository();
