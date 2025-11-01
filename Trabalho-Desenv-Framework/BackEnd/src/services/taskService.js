const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async createTask(data) {
        return await taskRepository.createTask(data);
    }

    async getAllTasks() {
        return await taskRepository.getAllTasks();
    }

    async getTaskById(id) {
        return await taskRepository.getTaskById(id);
    }

    async updateTask(id, data) {
        return await taskRepository.updateTask(id, data);
    }

    async deleteTask(id) {
        return await taskRepository.deleteTask(id);
    }
}

module.exports = new TaskService();
