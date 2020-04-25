const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Mongodb())
const MOCK_CATEGORY_CREATE = {description: 'New Category'}
const MOCK_CATEGORY_UPDATE = {description: 'My Category'}

describe ('MongoDB Tests', function () {
    this.beforeAll(async function() {
        await context.connect()
    })
    
    it('Check conection', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })

    it('Create Category', async function() {
        const {description} = await context.create(MOCK_CATEGORY_CREATE)
        
        assert.deepEqual({description}, MOCK_CATEGORY_CREATE)
    })
})

