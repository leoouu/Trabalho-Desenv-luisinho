const express = require('express')
const userController = require('../controllers/userController')
const authenticationToken = require('../middlewares/auth')
const { requireAdmin } = require('../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cargo
 *               - email
 *               - senha
 *             properties:
 *               cargo:
 *                 type: string
 *                 enum: [admin, professor, aluno]
 *                 description: Cargo do usuário (admin, professor ou aluno)
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Usuário já existe
 */
router.post('/', authenticationToken, requireAdmin, userController.register.bind(userController))

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Realiza login do usuário (por email ou RA)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - senha
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email ou RA do usuário
 *               ra:
 *                 type: string
 *                 description: (opcional) alias para identifier
 *               email:
 *                 type: string
 *                 format: email
 *                 description: (opcional) alias para identifier
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token para autenticação
 *                 user:
 *                   type: object
 *                   properties:
 *                     ra:
 *                       type: integer
 *                       description: RA do usuário
 *                     email:
 *                       type: string
 *                       description: Email do usuário
 *                     cargo:
 *                       type: string
 *                       enum: [admin, professor, aluno]
 *                       description: Cargo do usuário
 *                     nome:
 *                       type: string
 *                       description: Nome do usuário (buscado da tabela Aluno/Professor ou 'Administrador' para admin)
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', userController.login.bind(userController))

/**
 * @swagger
 * /user/by-ra:
 *   get:
 *     summary: Retorna um usuário por RA
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ra
 *         required: true
 *         schema:
 *           type: string
 *         description: RA do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ra:
 *                   type: string
 *                 email:
 *                   type: string
 *                 cargo:
 *                   type: string
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
router.get('/by-ra', authenticationToken, userController.getByRa.bind(userController))

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todos os usuários (admin)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ra:
 *                     type: string
 *                   email:
 *                     type: string
 *                   cargo:
 *                     type: string
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
router.get('/', authenticationToken, requireAdmin, userController.getAll.bind(userController))

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Atualiza um usuário por RA (admin)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ra
 *         required: true
 *         schema:
 *           type: string
 *         description: RA do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cargo:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
router.put('/', authenticationToken, requireAdmin, userController.updateByRa.bind(userController))

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Remove um usuário por RA (admin)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ra
 *         required: true
 *         schema:
 *           type: string
 *         description: RA do usuário a ser removido
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
router.delete('/', authenticationToken, requireAdmin, userController.deleteByRa.bind(userController))

module.exports = router
