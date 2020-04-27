const assert = require('assert')
const api = require('./../api')

const Context = require('./../db/strategies/base/contextStrategy')
const PostGres = require('./../db/strategies/postgres/postgres')
const UserScheme = require('./../db/strategies/postgres/schemas/userSchema')

let app = {}
const USER = {
    username: 'usuario',
    password: 'senhausuario123'
}
const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$jV/9c1mMYYwFruVfacP8Ous/Ny0RyFJ01mpNt26R3wRZWUn1cvPse'
}

describe('Auth test suite', function() {
    this.beforeAll(async() => {
        app = await api

        const connectionPostgres = await PostGres.connect()
        const model = await PostGres.defineModel(connectionPostgres, UserScheme)
        const postgres = new Context(new PostGres(connectionPostgres, model))
        await postgres.update(null, USER_DB, true)
    })

    it('Get Token', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })

    it('Must return unauthorized', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'naocadastrado',
                password: '123456'
            }
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)
        
        assert.deepEqual(statusCode, 401)
        assert.deepEqual(data.error, 'Unauthorized')
    })
})
