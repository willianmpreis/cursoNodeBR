const BaseRoute = require('./base/baseRoute')
const {join} = require('path')

class UtilRoutes extends BaseRoute {
    coverage() {
        return {
            path: '/coverage/{param*}',
            method: 'GET',
            config: {
                auth:false,
                tags: ['api'],
                description: 'Coverage Report',
                notes: 'Coverage Report',
            },
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage'),
                    redirectToSlash: true,
                    index: true
                }
            }

        }
    }
}

module.exports = UtilRoutes
