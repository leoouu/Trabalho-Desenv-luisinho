const express = require('express');
const alunoController = require('../controllers/alunoController');
const authenticationToken = require('../middlewares/auth');
const { requireAdmin, requireAdminOrProfessor } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: API para gerenciamento de alunos.
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Aluno:
 *          type: object
 *          required:
 *              - nome
 *              - semestre
 *              - ativo
 *              - curso
 *              - cpf
 *              - nascimento
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Identificador único do aluno.
 *              nome:
 *                  type: string
 *                  description: Nome do aluno.
 *              semestre:
 *                  type: integer
 *                  description: Semestre atual do aluno.
 *              ativo:
 *                  type: boolean
 *                  description: Indica se o aluno está ativo.
 *              curso:
 *                  type: string
 *                  description: Curso em que o aluno está matriculado.
 *              cpf:
 *                  type: string
 *                  description: CPF do aluno.
 *              nascimento:
 *                  type: string
 *                  description: Data de nascimento do aluno.
 *              ra:
 *                  type: integer
 *                  description: RA do aluno, chave estrangeira para usuário (opcional).
 *          example:
 *              id: 1
 *              nome: "Fulano de Tal"
 *              semestre: 3
 *              ativo: true
 *              curso: "Engenharia de Software"
 *              cpf: "123.456.789-00"
 *              nascimento: "2000-01-01"
 *              ra: 12345
 */

/**
 * @swagger
 * /aluno:
 *  get:
 *      summary: Retorna todos os alunos (Admin/Professor)
 *      tags: [Alunos]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: Lista de alunos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Aluno'
 *          403:
 *              description: Acesso restrito a administradores e professores
 */
router.get('/', authenticationToken, requireAdminOrProfessor, alunoController.getAll.bind(alunoController));

/**
 * @swagger
 * /aluno:
 *  post:
 *      summary: Cadastra um novo aluno
 *      tags: [Alunos]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nome:
 *                              type: string
 *                          semestre:
 *                              type: integer
 *                          ativo:
 *                              type: boolean
 *                          curso:
 *                              type: string
 *                          cpf:
 *                              type: string
 *                          nascimento:
 *                              type: string
 *                          ra:
 *                              type: integer
 *      responses:
 *          201:
 *              description: Aluno cadastrado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Aluno'
 */
router.post('/', authenticationToken, requireAdmin,alunoController.create.bind(alunoController));

/**
 * @swagger
 * /aluno/{id}:
 *  put:
 *      summary: Atualiza um aluno existente
 *      tags: [Alunos]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nome:
 *                              type: string
 *                          semestre:
 *                              type: integer
 *                          ativo:
 *                              type: boolean
 *                          curso:
 *                              type: string
 *                          cpf:
 *                              type: string
 *                          nascimento:
 *                              type: string
 *                          ra:
 *                              type: integer
 *      responses:
 *          200:
 *              description: Aluno atualizado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Aluno'
 */
router.put('/:id', authenticationToken, requireAdmin,alunoController.update.bind(alunoController));

/**
 * @swagger
 * /aluno/{id}:
 *  delete:
 *      summary: Remove um aluno
 *      tags: [Alunos]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Aluno removido com sucesso
 */
router.delete('/:id', authenticationToken, requireAdmin, alunoController.delete.bind(alunoController));

module.exports = router;
