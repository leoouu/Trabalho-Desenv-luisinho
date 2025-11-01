const userService = require('../services/userService')

class UserController {
    async register(req, res) {
        try {
            const result = await userService.register(req.body)
            res.status(201).json(result)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    async login(req, res) {
        try {
            const result = await userService.login(req.body)
            res.json(result)
        } catch (error) {
            res.status(401).json({ message: error.message })
        }
    }

    async getAll(req, res) {
        try {
            const users = await userService.findAll()
            res.json(users)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async getByRa(req, res) {
        try {
            const user = await userService.findByRa(req.query.ra)
            res.json(user)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    async updateByRa(req, res) {
        try {
            const updated = await userService.updateByRa(req.query.ra, req.body)
            res.json(updated)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    async deleteByRa(req, res) {
        try {
            const result = await userService.deleteByRa(req.query.ra)
            res.json(result)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
}

module.exports = new UserController()