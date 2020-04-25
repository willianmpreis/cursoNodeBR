const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const Context = require('./../db/strategies/base/contextStrategy')
const CategorySchema = require('./../db/strategies/postgres/schemas/categorySchema')

const MOCK_CATEGORY_CREATE = {description: 'New Category'}
const MOCK_CATEGORY_UPDATE = {description: 'My Category'}

let context = {}

describe('Postgres Strategy', function () {
    this.timeout(Infinity)

    this.beforeAll(async function() {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, CategorySchema)
        context = new Context(new Postgres(connection, model))
        await context.delete()
        await context.create(MOCK_CATEGORY_UPDATE)
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

    it('Update Category', async function() {
        const [updateItem] = await context.read({description: MOCK_CATEGORY_UPDATE.description})
        const newItem = {
            ...MOCK_CATEGORY_UPDATE,
            description: 'Updated Category'
        } //rest/spread : usado para mergiar ou separar objetos
        
        const [result] = await context.update(updateItem.id, newItem)
        const [updatedItem] = await context.read({id: updateItem.id})
        
        assert.deepEqual(result, 1)
        assert.deepEqual(updatedItem.description, newItem.description)
    })

    it('Remove with id', async function() {
        const [item] = await context.read({description: MOCK_CATEGORY_CREATE.description})
        const result = await context.delete(item.id)

        assert.deepEqual(result, true)
    })
})
