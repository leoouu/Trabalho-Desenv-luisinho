const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');
const authenticationToken = require('../middlewares/auth');
const { requireAdmin, requireAdminOrProfessor } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Disciplinas
 *   description: API para gerenciamento de disciplinas.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Disciplina:
 *       type: object
 *       required:
 *         - nome
 *         - professor_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único da disciplina.
 *         nome:
 *           type: string
 *           description: Nome da disciplina.
 *         professor_id:
 *           type: integer
 *           description: ID do professor que leciona a disciplina.
 *       example:
 *         id: 1
 *         nome: "Desenvolvimento de Frameworks"
 *         professor_id: 1
 */

/**
 * @swagger
 * /disciplina:
 *   post:
 *     summary: Cria uma nova disciplina.
 *     tags: [Disciplinas]
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
 *               professor_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.post('/', authenticationToken, requireAdmin, disciplinaController.create);

/**
 * @swagger
 * /disciplina:
 *   get:
 *     summary: Retorna todas as disciplinas.
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de disciplinas.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.get('/', authenticationToken, requireAdminOrProfessor, disciplinaController.findAll);

/**
 * @swagger
 * /disciplina/{id}:
 *   get:
 *     summary: Retorna uma disciplina pelo ID.
 *     tags: [Disciplinas]
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
 *         description: Detalhes da disciplina.
 *       404:
 *         description: Disciplina não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.get('/:id', authenticationToken, requireAdminOrProfessor, disciplinaController.findById);

/**
 * @swagger
 * /disciplina/{id}:
 *   put:
 *     summary: Atualiza uma disciplina.
 *     tags: [Disciplinas]
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
 *               professor_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso.
 *       404:
 *         description: Disciplina não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.put('/:id', authenticationToken, requireAdmin, disciplinaController.update);

/**
 * @swagger
 * /disciplina/{id}:
 *   delete:
 *     summary: Deleta uma disciplina.
 *     tags: [Disciplinas]
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
 *         description: Disciplina deletada com sucesso.
 *       404:
 *         description: Disciplina não encontrada.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito.
 */
router.delete('/:id', authenticationToken, requireAdmin, disciplinaController.delete);

module.exports = router;

