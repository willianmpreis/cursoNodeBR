const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._db = schema;
    }

    static async connect() {
        const sequelize = new Sequelize(process.env.POSTGRES_URL, {
            operatorAliases: false,
            logging: false,
            quateIdentifiers: false,
            //ssl: process.env.SSL_DB,
            //dialectOptions: {
            //    ssl: process.env.SSL_DB
            //}
        })
        return sequelize
    }

    async isConnected() {
        try {
            await this._connection.authenticate()
            return true
        } catch (error) {
            console.error('fail', error)
            return false
        }
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name,
            schema.schema,
            schema.options
        )
        await model.sync()
        return model
    }

    async create(item) {
        const {dataValues} = await this._db.create(item)
        return dataValues
    }

    async read(item = {}) {
        return this._db.findAll({where: item, raw: true})
    }

    async update(id, item, upsert=false) {
        const functionUpdate = upsert ? 'upsert' : 'update'
        return this._db[functionUpdate](item, {where: {id: id}})
    }

    async delete(id) {
        const query = id ? {id} : {}
        return this._db.destroy({where: query})
    }
}

module.exports = Postgres
