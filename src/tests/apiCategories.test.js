const assert = require('assert')
const api = require('./../api')
let app = {}

describe('Category API testing suite', function() {
    
    this.beforeAll(async () => {
        app = await api
    })

    it('List Category /categories', async () => {
        
        const result = await app.inject({
            method: 'GET',
            url: '/categories'
        })
        
        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(data))
    })
})
