const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.routes')
const bodyParser = require('body-parser')
const {config} = require('dotenv')
config()

//Usamos express para los middlewares
const app = express();
app.use(bodyParser.json()) //Parsaeador de bodies

//Aca conectaremos la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/users',userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`)
})