const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const authenticationToken = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: API para gerenciamento de professores.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - telefone
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único do professor.
 *         nome:
 *           type: string
 *           description: Nome do professor.
 *         cpf:
 *           type: string
 *           description: CPF do professor.
 *         telefone:
 *           type: string
 *           description: Telefone do professor.
 *         ra:
 *           type: integer
 *           description: RA do professor, chave estrangeira para usuário (opcional).
 *       example:
 *         id: 1
 *         nome: "Dr. João da Silva"
 *         cpf: "111.222.333-44"
 *         telefone: "11999998888"
 *         ra: 54321
 */

/**
 * @swagger
 * /professor:
 *   post:
 *     summary: Cria um novo professor.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               ra:
 *                 type: integer
 *                 description: RA do usuário associado (opcional)
 *     responses:
 *       201:
 *         description: Professor criado com sucesso.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.post('/', authenticationToken, requireAdmin, professorController.create);

/**
 * @swagger
 * /professor:
 *   get:
 *     summary: Retorna todos os professores.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de professores.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.get('/', authenticationToken, requireAdmin, professorController.findAll);

/**
 * @swagger
 * /professor/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID.
 *     tags: [Professores]
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
 *         description: Detalhes do professor.
 *       404:
 *         description: Professor não encontrado.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.get('/:id', authenticationToken, requireAdmin, professorController.findById);

/**
 * @swagger
 * /professor/{id}:
 *   put:
 *     summary: Atualiza um professor.
 *     tags: [Professores]
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
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               ra:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso.
 *       404:
 *         description: Professor não encontrado.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.put('/:id', authenticationToken, requireAdmin, professorController.update);

/**
 * @swagger
 * /professor/{id}:
 *   delete:
 *     summary: Deleta um professor.
 *     tags: [Professores]
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
 *         description: Professor deletado com sucesso.
 *       404:
 *         description: Professor não encontrado.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.delete('/:id', authenticationToken, requireAdmin, professorController.delete);

module.exports = router;

