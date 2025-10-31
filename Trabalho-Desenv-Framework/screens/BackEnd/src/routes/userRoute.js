const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Autenticação]
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
router.post('/', userController.register.bind(userController))

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
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', userController.login.bind(userController))

module.exports = router