const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticationToken = require('../middlewares/auth');
const { requireAdminOrProfessor } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API para gerenciamento de tarefas.
 */

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Cria uma nova tarefa.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               disciplina_id:
 *                 type: integer
 *               tipo:
 *                 type: string
 *                 enum: [atividade, prova]
 *               abertura:
 *                 type: string
 *                 format: date-time
 *               fechamento:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.post('/', authenticationToken, requireAdminOrProfessor, taskController.createTask);

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Retorna todas as tarefas.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.get('/', authenticationToken, requireAdminOrProfessor, taskController.getAllTasks);

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Retorna uma tarefa pelo ID.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da tarefa.
 *       404:
 *         description: Tarefa não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.get('/:id', authenticationToken, requireAdminOrProfessor, taskController.getTaskById);

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Atualiza uma tarefa.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               disciplina_id:
 *                 type: integer
 *               tipo:
 *                 type: string
 *                 enum: [atividade, prova]
 *               abertura:
 *                 type: string
 *                 format: date-time
 *               fechamento:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso.
 *       404:
 *         description: Tarefa não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.put('/:id', authenticationToken, requireAdminOrProfessor, taskController.updateTask);

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Deleta uma tarefa.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarefa deletada com sucesso.
 *       404:
 *         description: Tarefa não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.delete('/:id', authenticationToken, requireAdminOrProfessor, taskController.deleteTask);

module.exports = router;

