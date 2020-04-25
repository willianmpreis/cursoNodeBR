const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi');

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
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    query: Joi.object({
                       s: Joi.number().integer().default(0),
                       l: Joi.number().integer().default(10),
                       d: Joi.string().min(3).max(100).default('')
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
                    return 'Erro no servidor'
                }
                
            }
        }
    }
}

module.exports = HeroRoutes
