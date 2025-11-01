const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const Professor = require('./Professor')
    
const Disciplina = sequelize.define('Disciplina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull:false
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Professor,
            key: 'id'
        }
    }
})

// Define the association
Disciplina.belongsTo(Professor, { foreignKey: 'professor_id' })

module.exports = Disciplina