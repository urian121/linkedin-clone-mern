require('dotenv').config()
const mongoose = require('mongoose')

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}/linkedin?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`
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