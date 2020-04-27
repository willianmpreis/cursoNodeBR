const assert = require('assert')
const api = require('./../api')

let app = {}

describe('Auth test suite', function() {
    this.beforeAll(async() => {
        app = await api
    })

    it('Get Token', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'usuario',
                password: 'senhausuario123'
            }
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        console.log(data)

        assert.deepEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })

})
