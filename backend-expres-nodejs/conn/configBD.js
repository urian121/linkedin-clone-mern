require('dotenv').config()
const mongoose = require('mongoose')

const DB_URI = `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@ac-1qdpfyw-shard-00-00.lfz16za.mongodb.net:27017,ac-1qdpfyw-shard-00-01.lfz16za.mongodb.net:27017,ac-1qdpfyw-shard-00-02.lfz16za.mongodb.net:27017/linkedin?ssl=true&replicaSet=atlas-13wo4k-shard-0&authSource=admin&appName=${process.env.DB_APP_NAME}`

const conectarDB = async () => {
    try {

        await mongoose.connect(DB_URI)

        console.log('✅ Conexión correcta a MongoDB')

    } catch (error) {

        console.log('❌ Error MongoDB')
        console.log(error)

        process.exit(1)

    }
}

module.exports = conectarDB