const Hapi = require('@hapi/hapi')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')
const HapiSwagger = require('hapi-swagger')
const HapiJWT = require('hapi-auth-jwt2')

const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const Postgres = require('./db/strategies/postgres/postgres')
const CategorySheme = require('./db/strategies/mongodb/schemas/categorySchema')
const UserSheme = require('./db/strategies/postgres/schemas/userSchema')
const CategoryRoute  = require('./routes/categoryRoutes')
const AuthRoute = require('./routes/authRoutes')

const JWT_SECRET = 'MY_SECRET_KEY'

const app = new Hapi.Server({
    port:5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    
    const connectionMongoDB = MongoDb.connect()
    const contextMongoDB = new Context(new MongoDb(connectionMongoDB, CategorySheme))

    const connectionPostgres = await Postgres.connect()
    const userModel = await Postgres.defineModel(connectionPostgres, UserSheme)
    const contextPostgres = new Context(new Postgres(connectionPostgres, userModel))

    const swaggerOptions = {
        info: {
            title: 'API Categorias - #CursoNodeBR',
            version: 'v1.0'
        },
        //lang:'pt' //Está dando erro
    }

    //Registrar os plugins
    await app.register([
        HapiJWT,
        Vision,
        Inert,
        {
             plugin: HapiSwagger,
             options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (data, request) => {
            const [result] = await contextPostgres.read({
                username: data.username.toLowerCase(),
                id: data.id
            })
            if (!result) {
                return {isValid: false}
            }
            return {
                isValid: true // caso nao valido false
            }
        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new CategoryRoute(contextMongoDB), CategoryRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)

    return app
}

module.exports = main()
