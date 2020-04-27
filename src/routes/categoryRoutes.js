const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi'); //Validações
const Boom = require('@hapi/boom') //Gerenciar e Formatar Erros

const failAction = (request, headers, error) => {
    throw error;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.contextDb = db
    }

    list() {
        return {
            path: '/categories',
            method: 'GET',
            options: {
                tags: ['api'],
                description: 'Deve listar categorias',
                notes: 'Pode paginar resultados e filtrar por descrição',
                validate: {
                    failAction: failAction,
                    query: Joi.object({
                       s: Joi.number().integer().default(0),
                       l: Joi.number().integer().default(10),
                       d: Joi.string().min(3).max(100)
                    }),
                    headers
                }
            },
            handler: (request, head) => {
                try {
                    const {s, l, d} = request.query

                    let query = d ? {
                        description: {$regex: `.*${d}*.`}
                    } : {}

                    return this.contextDb.read(query, parseInt(s), parseInt(l))
                } catch (error) {
                    console.log(error)
                    return Boom.internal()
                }
                
            }
        }
    }

    create() {
        return {
            path: '/categories',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar categorias',
                notes: 'Deve cadastrar categoria por descrição',
                validate: {
                    failAction,
                    headers,
                    payload: Joi.object({
                       description: Joi.string().required().min(3).max(100)
                    })                    
                }
            },
            handler: async (request) => {
                try {
                    const {description} = request.payload
                    const result = await this.contextDb.create({description})
                    return result;
                } catch (error) {
                    console.error(error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/categories/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar uma categoria por ID',
                notes: 'Pode atualizar descrição da categoria por ID',
                validate: {
                    failAction,
                    headers,
                    payload: Joi.object({
                       description: Joi.string().min(3).max(100)
                    }),
                    params: Joi.object({
                        id: Joi.string().required()
                    })               
                }
            },
            handler: async (request) => {
                try {                    
                    const {id} = request.params
                    const {description} = request.payload                    
                    const result = await this.contextDb.update(id, {description})
                    return result;
                } catch (error) {
                    console.error(error)
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/categories/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve remover uma categoria por ID',
                notes: 'O ID deve ser válido',
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })               
                }
            },
            handler: async (request) => {
                try {                    
                    const {id} = request.params                    
                    const result = await this.contextDb.delete(id)
                    return result;
                } catch (error) {
                    console.error(error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes
