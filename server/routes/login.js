const express = require('express');
const app = express();

const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');


//Libreria de Google 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    let us = await verify(token);

    console.log(token);

    Usuario.findOne({ email: us.email }, (err, UsuarioDB) => {


        if (err) {
            return res.status(500).json({
                OK: false,
                err
            })
        }

        if (UsuarioDB) {
            //Si el usuarioDB existe y ademas su valor de google es true significa que se esta logueando
            if (UsuarioDB.google) {
                //Se le asignara un nuevo token de los internos
                let token = jwt.sign({
                    usuario: UsuarioDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_VENDATE });

                res.json({
                    OK: true,
                    usuario: UsuarioDB,
                    token
                })
            } else {
                return res.status(401).json({
                    OK: false,
                    error: {
                        message: 'Ingrese con su usuario normal (sin google)'
                    }
                })
            }
        } else {
            //Como el usuario no existe entonces hay que crear un usuario en la base de datos
            let usuario = new Usuario({
                nombre: us.nombre,
                email: us.email,
                img: us.img,
                password: ':)',
                google: us.google
            });

            usuario.save((err, usuDB) => {

                if (err) {
                    res.status(400).json({
                        OK: false,
                        err
                    })
                } else {
                    res.json({
                        OK: true,
                        usuDB
                    })
                }
            })

        }
    })



});


module.exports = app;