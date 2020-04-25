const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Mongodb())
const MOCK_CATEGORY_DEFAULT = {description: `Category Default - ${Date.now()}`}
const MOCK_CATEGORY_CREATE = {description: 'New Category'}
const MOCK_CATEGORY_UPDATE = {description: 'My Category'}

describe ('MongoDB Tests', function () {
    this.beforeAll(async function() {
        await context.connect()
        await context.create(MOCK_CATEGORY_DEFAULT)
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

    it ('List Category', async () => {
        //Extrai apenas a chave description do primeiro objeto retornado
        const [{description}] = await context.read({description: MOCK_CATEGORY_DEFAULT.description})
        const result = {description}

        assert.deepEqual(result, MOCK_CATEGORY_DEFAULT)
    })
})

