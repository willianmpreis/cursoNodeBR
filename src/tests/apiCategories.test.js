const assert = require('assert')
const api = require('./../api')
let app = {}
const MOCK_CATEGORY_CREATE = {description: `Category-API-${Date.now()}`}

describe.only('Category API testing suite', function() {
    
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

    it('List Category with limit /categories?l=5', async () => {
        const LIMIT = 5
        const result = await app.inject({
            method: 'GET',
            url: `/categories?l=${LIMIT}`
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(data))
        assert.ok(data.length <= LIMIT)
    })

    it('List Category with limit /categories?l=AAAE', async () => {
        const LIMIT = 'WIL'
        const result = await app.inject({
            method: 'GET',
            url: `/categories?l=${LIMIT}`
        })

        const statusCode = result.statusCode
        const errorResult = {
          "statusCode": 400,
          "error": "Bad Request",
          "message": "\"l\" must be a number",
          validation: {
            keys: [
              'l'
            ],
            source: 'query'
          }
        }

        assert.deepEqual(statusCode, 400)
        assert.deepEqual(errorResult, JSON.parse(result.payload))
    })

    it('Create Category - POST /category', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/categories',
            payload: MOCK_CATEGORY_CREATE
        })

        const statusCode = result.statusCode
        //const {description} = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        //assert.deepEqual(description, MOCK_CATEGORY_CREATE.description)
    })
})
