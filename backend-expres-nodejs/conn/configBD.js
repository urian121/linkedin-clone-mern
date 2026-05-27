require('dotenv').config()
const mongoose = require('mongoose')

const DB_URI = `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@ac-1qdpfyw-shard-00-00.lfz16za.mongodb.net:27017,ac-1qdpfyw-shard-00-01.lfz16za.mongodb.net:27017,ac-1qdpfyw-shard-00-02.lfz16za.mongodb.net:27017/linkedin?ssl=true&replicaSet=atlas-13wo4k-shard-0&authSource=admin&appName=${process.env.DB_APP_NAME}`

/* En serverless (Vercel) cada invocación reusa el contenedor mientras está caliente.
   Cacheamos la promesa de conexión para no abrir un socket nuevo en cada request. */
let cached = global.__mongoose
if (!cached) cached = global.__mongoose = { conn: null, promise: null }

const conectarDB = async () => {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(DB_URI, { serverSelectionTimeoutMS: 8000 })
            .then((m) => {
                console.log('✅ Conexión correcta a MongoDB')
                return m
            })
            .catch((error) => {
                cached.promise = null
                console.error('❌ Error MongoDB:', error.message)
                throw error
            })
    }

    cached.conn = await cached.promise
    return cached.conn
}

module.exports = conectarDB
