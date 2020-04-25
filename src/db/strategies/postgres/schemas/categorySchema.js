const Sequelize = require('sequelize');

const CategorySchema = {
    name: 'category',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            require: true,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: Sequelize.STRING,
            require: true
        }
    },
    options: {
        tableName: 'TB_CATEGORY',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = CategorySchema