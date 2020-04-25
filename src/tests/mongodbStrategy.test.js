const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Mongodb())
const MOCK_CATEGORY_DEFAULT = {description: `Category Default - ${Date.now()}`}
const MOCK_CATEGORY_CREATE = {description: `New Category - ${Date.now()}`}
const MOCK_CATEGORY_UPDATE = {description: `My Category - ${Date.now()}`}

let MOCK_CATEGORY_UPDATE_ID = ''

describe ('MongoDB Tests', function () {
    this.beforeAll(async function() {
        await context.connect()
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
})

