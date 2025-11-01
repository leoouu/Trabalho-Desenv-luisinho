const express = require('express');
const router = express.Router();
const notaController = require('../controllers/notaController');
const authenticationToken = require('../middlewares/auth');
const { requireAdminOrProfessor } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Notas
 *   description: API para gerenciamento de notas.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Nota:
 *       type: object
 *       required:
 *         - nota
 *         - task_id
 *         - aluno_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único da nota.
 *         nota:
 *           type: number
 *           format: float
 *           description: O valor da nota.
 *         task_id:
 *           type: integer
 *           description: ID da tarefa associada.
 *         aluno_id:
 *           type: integer
 *           description: ID do aluno associado.
 *       example:
 *         id: 1
 *         nota: 8.5
 *         task_id: 1
 *         aluno_id: 1
 */

/**
 * @swagger
 * /nota:
 *   get:
 *     summary: Retorna notas. Se o usuário for um aluno, retorna apenas suas próprias notas.
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notas.
 *       401:
 *         description: Token inválido.
 */
router.get('/', authenticationToken, notaController.findAll);

/**
 * @swagger
 * /nota:
 *   post:
 *     summary: Cria uma nova nota (Admin/Professor).
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: number
 *                 format: float
 *               task_id:
 *                 type: integer
 *               aluno_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Nota criada com sucesso.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores e professores.
 */
router.post('/', authenticationToken, requireAdminOrProfessor, notaController.create);

/**
 * @swagger
 * /nota/{id}:
 *   get:
 *     summary: Retorna uma nota pelo ID (Admin/Professor).
 *     tags: [Notas]
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
 *         description: Detalhes da nota.
 *       404:
 *         description: Nota não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores e professores.
 */
router.get('/:id', authenticationToken, requireAdminOrProfessor, notaController.findById);

/**
 * @swagger
 * /nota/{id}:
 *   put:
 *     summary: Atualiza uma nota (Admin/Professor).
 *     tags: [Notas]
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
 *               nota:
 *                 type: number
 *                 format: float
 *               task_id:
 *                 type: integer
 *               aluno_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Nota atualizada com sucesso.
 *       404:
 *         description: Nota não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores e professores.
 */
router.put('/:id', authenticationToken, requireAdminOrProfessor, notaController.update);

/**
 * @swagger
 * /nota/{id}:
 *   delete:
 *     summary: Deleta uma nota (Admin/Professor).
 *     tags: [Notas]
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
 *         description: Nota deletada com sucesso.
 *       404:
 *         description: Nota não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores e professores.
 */
router.delete('/:id', authenticationToken, requireAdminOrProfessor, notaController.delete);

module.exports = router;

