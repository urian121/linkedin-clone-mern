const express = require('express')
const cors = require('cors')

const conectarDB = require('./conn/configBD')
const app = express()

app.use(cors())
app.use(express.json())

/* Middleware: garantiza que Mongo esté conectado antes de cualquier request.
   Necesario en serverless: Vercel reusa el contenedor pero la conexión puede
   haberse cerrado entre invocaciones. */
app.use(async (req, res, next) => {
    try {
        await conectarDB()
        next()
    } catch (err) {
        console.error('No se pudo conectar a MongoDB:', err.message)
        res.status(503).json({ error: 'Base de datos no disponible' })
    }
})

const apiRouter = require('./api/api')
app.use('/api', apiRouter)

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Servidor backend Node.js corriendo ✅'
    })
})

/* En local levantamos un puerto; en Vercel solo exportamos la app
   (el runtime serverless la invoca como handler). */
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
}

module.exports = app
