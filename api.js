const {config} = require('dotenv')
const {join} = require('path')
const {ok} = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "Invalid .env")

const configPah = join(__dirname, './config/', `.env.${env}`)
config({
    path: configPah
})

const Hapi = require('@hapi/hapi')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')
const HapiSwagger = require('hapi-swagger')
const HapiJWT = require('hapi-auth-jwt2')

const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDb = require('./src/db/strategies/mongodb/mongodb')
const Postgres = require('./src/db/strategies/postgres/postgres')
const CategorySheme = require('./src/db/strategies/mongodb/schemas/categorySchema')
const UserSheme = require('./src/db/strategies/postgres/schemas/userSchema')
const CategoryRoute  = require('./src/routes/categoryRoutes')
const AuthRoute = require('./src/routes/authRoutes')

const JWT_SECRET = process.env.JWT_KEY

const app = new Hapi.Server({
    port:process.env.PORT_HAPI
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
