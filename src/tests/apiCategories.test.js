const assert = require('assert')
const api = require('./../api')

let app = {}
const MOCK_CATEGORY_DEFAULT = {description: `Category-API-Default-${Date.now()}`}
const MOCK_CATEGORY_CREATE = {description: `Category-API-${Date.now()}`}
let MOCK_CATEGORY_DEFAULT_ID = ''

describe.only('Category API testing suite', function() {
    
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/categories',
            payload: MOCK_CATEGORY_DEFAULT
        })
        const data = JSON.parse(result.payload)
        MOCK_CATEGORY_DEFAULT_ID = data._id
    })

    it('List Category', async () => {
        
        const result = await app.inject({
            method: 'GET',
            url: '/categories'
        })
        
        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(data))
    })

    it('List Category with limit', async () => {
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

    it('List Category - Limit error', async () => {
        const LIMIT = 'NOT'
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

    it('Create Category', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/categories',
            payload: MOCK_CATEGORY_CREATE
        })

        const statusCode = result.statusCode
        const {description} = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(description, MOCK_CATEGORY_CREATE.description)
    })

    it('Update Category', async () => {
        const _id = MOCK_CATEGORY_DEFAULT_ID
        const expected = {description: `Category-API-Updated-${Date.now()}`}

        const result = await app.inject({
            method: 'PATCH',
            url: `/categories/${_id}`,
            payload: expected
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload);

        assert.ok(statusCode === 200)
        assert.ok(data.nModified >=1)
    })

    it('Not Update Category', async () => {
        const _id = '5aa4aaaa19306ca8d45eb627'
        const expected = {description: `Category-API-Updated-${Date.now()}`}

        const result = await app.inject({
            method: 'PATCH',
            url: `/categories/${_id}`,
            payload: expected
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload);

        assert.ok(statusCode === 200)
        assert.ok(data.nModified == 0)
    })
})
