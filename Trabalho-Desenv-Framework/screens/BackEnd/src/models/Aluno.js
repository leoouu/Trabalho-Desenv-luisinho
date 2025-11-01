const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const Usuario = require('./User')

const Aluno = sequelize.define('Aluno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull:false
    },
    semestre: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    curso: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nascimento: {
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
Aluno.belongsTo(Usuario, { 
    foreignKey: {
        name: 'ra',
        allowNull: true
    }
})

module.exports = Aluno