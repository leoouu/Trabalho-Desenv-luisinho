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

    async create(usuario) {
        return await Usuario.create(usuario)
    }
}

module.exports = new UserRepository()