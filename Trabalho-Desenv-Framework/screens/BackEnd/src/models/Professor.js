const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const Usuario = require('./User')

const Professor = sequelize.define('Professor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull:false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ra: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'ra'
        }
    }
})

// Define the association
Professor.belongsTo(Usuario, { 
    foreignKey: {
        name: 'ra',
        allowNull: true
    }
})

module.exports = Professor