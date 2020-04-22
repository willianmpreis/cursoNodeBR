const Mongoose = require('mongoose')

const ICrud = require('./interfaces/interfaceCrud');

const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando'
}

class MongoDB extends ICrud {
    constructor() {
        super()
        this._category = null
        this._driver = null
    }

    async isConnected() {
        const state = STATUS[this._driver.readyState]

        if (state === 'Conectado') return state

        if (state !== 'Conectando') return state
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._driver.readState]
    }

    async connect() {
        await Mongoose.connect('mongodb://usuario:minhasenha@localhost:27017/docker-mongo', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).catch(error => console.log('Falha na conexão!', error))
       
        
        const connection = Mongoose.connection
        connection.once('open', () => console.log('database rodando!!!')) //Executa uma unica vez

        // Mongoose.connection.on('error', err => {
        //     logError(err);
        //   });

        this._driver = connection
    }

    defineModelCategory()
    {
        const categoryScheme = Mongoose.Schema({
            description: {
                type: String,
                require: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        })

        this._category = Mongoose.model('category', categoryScheme)
    }

    async create(item) {
        const resultCadastrar = await model.create(item)
    
        console.log('resultCadastrar', resultCadastrar)
    }
}

module.exports = MongoDB
