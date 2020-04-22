const ICrud = require('./interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
    constructor() {
        super()
        this.driver = null
        this._category = null
        this._connect()
    }

    _connect() {
        this._driver = new Sequelize(
            'docker-postgres',
            'meuusuario',
            'minhasenha', 
            {
                host: 'localhost',
                dialect: 'postgres',
                quateIdentifiers: false,
                operatorAliases: false
            }
        )
    }

    async isConnected() {
        try {
            await this._driver.authenticate()
            return true
        } catch (error) {
            console.error('fail', error)
            return false
        }
    }

    async defineCategoryModel() {
        this._category = driver.define('category', {
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
        {
            tableName: 'TB_CATEGORY',
            freezeTableName: false,
            timestamps: false
        })
    
        await Category.sync()
    }

    create(item) {
        console.log('Item salvo em PostgreSQL')
    }
}

module.exports = Postgres
