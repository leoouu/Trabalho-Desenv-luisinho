const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const Aluno = require('./Aluno')
const Task = require('./task')

const Nota = sequelize.define('Nota', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nota: {
        type: DataTypes.FLOAT,
        allowNull:false,
        validate: {
            async isNotaNotGreaterThanNotaMaxima(value) {
                if (value === null || this.task_id === null) {
                    return;
                }
                const task = await Task.findByPk(this.task_id);
                if (task && value > task.nota_maxima) {
                    throw new Error('A nota não pode ser maior que a nota máxima da atividade.');
                }
            }
        }
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Task,
            key: 'id'
        }
    },
    aluno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Aluno,
            key: 'id'
        }
    }
})

// Define the association
Nota.belongsTo(Aluno, { foreignKey: 'aluno_id' })
Nota.belongsTo(Task, { foreignKey: 'task_id' })

module.exports = Nota