const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi'); //Validações
const Boom = require('@hapi/boom') //Gerenciar e Formatar Erros

const failAction = (request, headers, error) => {
    throw error;
}

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
                validate: {
                    failAction: failAction,
                    query: Joi.object({
                       s: Joi.number().integer().default(0),
                       l: Joi.number().integer().default(10),
                       d: Joi.string().min(3).max(100)
                    })
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
                validate: {
                    failAction,
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
                validate: {
                    failAction,
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
                validate: {
                    failAction,
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
