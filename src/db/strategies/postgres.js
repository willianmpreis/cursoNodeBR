const ICrud = require('./interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
    constructor() {
        super()
        this.driver = null
        this._category = null
    }

    async connect() {
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
        await this.defineCategoryModel()
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
        this._category = this._driver.define('category', {
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
    
        await this._category.sync()
    }

    async create(item) {
        const {dataValues} = await this._category.create(item)
        return dataValues
    }

    async read(item = {}) {
        return this._category.findAll({where: item, raw: true})
    }

    async update(id, item) {
        return this._category.update(item, {where: {id: id}})
    }

    async delete(id) {
        const query = id ? {id} : {}
        return this._category.destroy({where: query})
    }
}

module.exports = Postgres
