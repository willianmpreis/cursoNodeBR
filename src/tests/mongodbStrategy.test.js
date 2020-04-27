const assert = require('assert')
const MongoDb = require('../db/strategies/mongodb/mongodb')
const CategorySchema = require('../db/strategies/mongodb/schemas/categorySchema')
const Context = require('../db/strategies/base/contextStrategy')

let context = {}
const MOCK_CATEGORY_DEFAULT = {description: `Category Default - ${Date.now()}`}
const MOCK_CATEGORY_CREATE = {description: `New Category - ${Date.now()}`}
const MOCK_CATEGORY_UPDATE = {description: `My Category - ${Date.now()}`}
let MOCK_CATEGORY_UPDATE_ID = ''

describe('MongoDB Tests', function () {
    this.beforeAll(async function() {
        const connection = await MongoDb.connect()
        context = new Context(new MongoDb(connection, CategorySchema))
        await context.create(MOCK_CATEGORY_DEFAULT)
        const result = await context.create(MOCK_CATEGORY_UPDATE)
        MOCK_CATEGORY_UPDATE_ID =  result.id
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

    it ('Update Category', async () => {
        const result = await context.update(MOCK_CATEGORY_UPDATE_ID, {
            description: 'Updated Category'
        })

        assert.deepEqual(result.nModified, 1)
    })

    it ('Remove Category', async () => {
        const result = await context.delete(MOCK_CATEGORY_UPDATE_ID)

        assert.deepEqual(result.n, 1)
    })
})

