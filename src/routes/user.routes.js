const express = require('express')
const router = express.Router()
const User = require('../models/user.model')

// MIDDLEWARE

const getUser = async(req, res, next) => {
    let user;
    const {id} = req.params

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
      return res.status(404).json({
        message: 'El ID del usuario no es valido'
      })  
    }

    try {
        user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                message: 'El usuario no fue encontrado'
            })
        }
    }catch(error){
        return res.status(500).json({
            message: error.message
        })
    }

    res.user = user;
    next()
}

// Obtener todo los usuarios [GET ALL]

router.get('/', async(req, res) => {
    try {
        const users = await User.find();
        console.log('GET ALL', users)
        if(users.length === 0){
          return  res.status(204).json([])
        }
        res.json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Crear un libro (recurso) [POST]

router.post('/', async(req, res) => {

    const { document, name, phone, email, pwdUser, date} = req?.body

    if(!document || !name || !phone || !email || !pwdUser || !date){
        return res.status(400).json({
            message: 'Los campos documento, nombre, telefono, correo, y fecha son obligatorios'
        })
    }

    const user = new User({
        document,
        name,
        phone,
        email,
        pwdUser,
        date
    })

    try {
       const newUser = await user.save()
       console.log(newUser)
       res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// Obtener usuario por id [GET:ID]

router.get('/:id', getUser, async (req, res) =>{
    res.json(res.user)
})

// Actualizar usuario por id [GET:ID]

router.put('/:id', getUser, async (req, res) =>{
    try {
        const user = res.user
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.email = req.body.email || user.email;
        user.pwdUser = req.body.pwdUser || user.pwdUser;
        user.date = req.body.date || user.date;

        const updateUser = await user.save()
        res.json(updateUser)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getUser, async (req, res) =>{

    if(!req.body.name && !req.body.phone && !req.body.email && !req.body.pwdUser && !req.body.date){
        res.status(400).json({
            message: 'Al menos uno de los campos debe ser enviado.'
        })
    }
    try {
        const user = res.user
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.email = req.body.email || user.email;
        user.pwdUser = req.body.pwdUser || user.pwdUser;
        user.date = req.body.date || user.date;

        const updateUser = await user.save()
        res.json(updateUser)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getUser, async (req, res) =>{
    try {
        const user = res.user
        await user.deleteOne({
            _id: user._id
        });
        res.json({
            message: `El usuario ${user.name} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router