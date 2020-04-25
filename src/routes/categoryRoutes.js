const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.contextDb = db
    }

    list() {
        return {
            path: '/categories',
            method: 'GET',
            handler: (request, head) => {
                return this.contextDb.read()
            }
        }
    }
}

module.exports = HeroRoutes
