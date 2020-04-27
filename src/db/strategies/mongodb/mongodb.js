const Mongoose = require('mongoose')

const ICrud = require('./../interfaces/interfaceCrud');

const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando'
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]

        if (state === STATUS[1]) return state

        if (state !== STATUS[2]) return state
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readState]
    }

    static async connect() {
        
        Mongoose.connect('mongodb://usuario:minhasenha@localhost:27017/docker-mongo', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).catch(error => console.log('Falha na conexão!', error))
       
        
        const connection = await Mongoose.connection
        connection.once('open', () => console.log('database rodando!!!')) //Executa uma unica vez

        // Mongoose.connection.on('error', err => {
        //     logError(err);
        //   });

        return connection
    }

    create(item) {
        return this._schema.create(item)
    }

    /**
     * @param {*} item 
     * @param {*} skip  //Ignorar os 'skip' primeiros resultados
     * @param {*} limit //Limite por página
     */
    read(item, skip=0, limit=10) {
        return this._schema.find(item).skip(skip).limit(limit)
    }

    update(id, item) {
        return this._schema.updateOne({_id: id}, {$set: item})
    }

    delete(id) {
        return this._schema.deleteOne({_id: id})
    }
}

module.exports = MongoDB
