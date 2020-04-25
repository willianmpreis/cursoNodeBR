const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const CategorySheme = require('./db/strategies/mongodb/schemas/categorySchema')
const CategoryRoute  = require('./routes/categoryRoutes')


const app = new Hapi.Server({
    port:5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, CategorySheme))

    app.route([
        ...mapRoutes(new CategoryRoute(context), CategoryRoute.methods())                
    ])

    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)

    return app
}

module.exports = main()