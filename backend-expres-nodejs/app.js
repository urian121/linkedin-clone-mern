const express = require('express')
const cors = require('cors')

const conectarDB = require('./conn/configBD')
const app = express()

app.use(cors())
app.use(express.json())

const apiRouter = require('./api/api')
app.use('/api', apiRouter)

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Servidor backend Node.js corriendo ✅'
    })
})

const PORT = process.env.PORT || 5000

conectarDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
})

module.exports = app
