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

        if (state === STATUS[1]) return state

        if (state !== STATUS[2]) return state
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._driver.readState]
    }

    async connect() {
        await Mongoose.connect('mongodb://usuario:minhasenha@localhost:27017/docker-mongo', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).catch(error => console.log('Falha na conexão!', error))
       
        
        const connection = Mongoose.connection
        this._driver = connection
        connection.once('open', () => console.log('database rodando!!!')) //Executa uma unica vez

        // Mongoose.connection.on('error', err => {
        //     logError(err);
        //   });

        this.defineModelCategory()
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

    create(item) {
        return this._category.create(item)
    }

    /**
     * @param {*} item 
     * @param {*} skip  //Ignorar os 'skip' primeiros resultados
     * @param {*} limit //Limite por página
     */
    read(item, skip=0, limit=10) {
        return this._category.find(item).skip(skip).limit(limit)
    }

    update(id, item) {
        return this._category.updateOne({_id: id}, {$set: item})
    }
}

module.exports = MongoDB
