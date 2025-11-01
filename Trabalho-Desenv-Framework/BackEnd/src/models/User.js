const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Usuario = sequelize.define('Usuario', {
    ra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cargo: {
        type: DataTypes.ENUM('admin', 'professor', 'aluno'),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Usuario