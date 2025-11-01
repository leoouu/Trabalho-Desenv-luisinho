const { Op } = require('sequelize')

const Usuario = require('../models/User')

class UserRepository {
    async findByEmail(email) {
        return await Usuario.findOne({ where: {email}})   
    }

    async findByEmailOrRa(identifier) {
        // allow identifier to be email or ra
        return await Usuario.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { ra: identifier }
                ]
            }
        })
    }

    async findAll() {
        return await Usuario.findAll()
    }

    async findByRa(ra) {
        return await Usuario.findOne({ where: { ra } })
    }

    async updateByRa(ra, data) {
        const [affected] = await Usuario.update(data, { where: { ra } })
        if (affected === 0) return null
        return await Usuario.findOne({ where: { ra } })
    }

    async deleteByRa(ra) {
        return await Usuario.destroy({ where: { ra } })
    }

    async create(usuario) {
        return await Usuario.create(usuario)
    }
}

module.exports = new UserRepository()