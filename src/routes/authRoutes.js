const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi'); //Validações
const Boom = require('@hapi/boom') //Gerenciar e Formatar Erros
const Jwt = require('jsonwebtoken')

const PasswordHelper = require('../helpers/passwordHelper')

const failAction = (request, headers, error) => {
    throw error;
}

const USER = {
    username: 'usuario',
    password: 'senhausuario123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, dbContext) {
        super()
        this._secret = secret
        this._dbContext = dbContext
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })               
                }
            },
            handler: async (request) => {
                const {username, password} = request.payload

                const [user] = await this._dbContext.read({
                    username:username.toLowerCase()
                })

                if (!user) {
                    return Boom.unauthorized('User does not exist')
                }

                const match = await PasswordHelper.comparePassword(
                    password,
                    user.password
                )
                
                if (!match) {
                    return Boom.unauthorized('User or password invalid')
                }
                // if (username.toLowerCase() !== USER.username ||
                //     password !== USER.password) {
                //     return Boom.unauthorized()
                // }
                
                const token = Jwt.sign({
                    username: username,
                    id: user.id
                }, this._secret)
                
                return {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoutes
