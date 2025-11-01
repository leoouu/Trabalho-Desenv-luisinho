const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const Disciplina = require('./Disciplina')

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull:false
    },
    disciplina_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Disciplina,
            key: 'id'
        }
    },
    tipo: {
        type: DataTypes.ENUM('atividade', 'prova'),
        allowNull: false,
    },
    abertura: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fechamento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nota_maxima: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
})

// Define the association
Task.belongsTo(Disciplina, { foreignKey: 'disciplina_id' })

module.exports = Task