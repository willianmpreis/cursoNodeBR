const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Postgres())
const MOCK_CATEGORY_CREATE = {description: 'My Category'}

describe('Postgres Strategy', function () {
    this.timeout(Infinity)

    this.beforeAll(async function() {
        await context.connect()
    })
    
    it('PostgreSQL Connection', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    
    it('Create Category', async function() {
        const result = await context.create(MOCK_CATEGORY_CREATE)
        delete result.id
        assert.deepEqual(result, MOCK_CATEGORY_CREATE)
    })

    it ('List Category', async function() {
        const [result] = await context.read({ description: MOCK_CATEGORY_CREATE.description})
        delete result.id
        assert.deepEqual(result, MOCK_CATEGORY_CREATE)
    })
})
