const express = require('express');
const app = express();

const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');





app.post('/login', (req, res) => {


    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        //Error generado por una excepción a traves de algun problema de base de datos
        if (err) {
            return res.status(500).json({
                OK: false,
                err
            })
        }

        //No hay error pero no hay match de emails y retorna un usuario null
        if (!usuarioDB) {
            return res.status(400).json({
                OK: false,
                Error: {
                    message: 'Usuario o contraseña no encontrado'
                }
            })
        }

        //Encontro un UsuarioDB pero ahora se valida la contraseña que esta encriptada
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                OK: false,
                Error: {
                    message: 'Usuario o contraseña no encontrado'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_VENDATE });

        res.json({
            OK: true,
            usuarioDB,
            token
        })
    })

})




module.exports = app;