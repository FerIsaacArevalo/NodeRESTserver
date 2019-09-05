const express = require('express');
const app = express();

const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

let salt = bcrypt.genSaltSync(10);

app.get('/', function(req, res) {
    res.json('La aplicacion esta corriendo')
})

app.get('/usuario', function(req, res) {

    let solicitados = req.query.solicitados || 5;
    solicitados = Number(solicitados);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(solicitados)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                })
            }

            Usuario.countDocuments({ estado: true }, (err, total) => {

                res.json({
                    OK: true,
                    Total_Usuarios: total,
                    Total_Mostrados: usuarios.length,
                    usuarios
                })

            });
        })
})

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                OK: false,
                err
            })
        } else {

            let salida = _.omit(usuarioDB.toObject(), 'password');


            res.json({
                Usuario: salida
            })
        }
    })


})

app.put('/usuario/:poto', function(req, res) {

    let id = req.params.poto;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, UsuarioDB) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }


        let user = _.omit(UsuarioDB.toObject(), "password");
        res.json({
            OK: true,
            Usuario: user
        })

    })


})

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = { estado: false };

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, UsuarioDB) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }


        let user = _.omit(UsuarioDB.toObject(), "password");
        res.json({
            OK: true,
            Usuario: user
        })

    })
})



// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//         if (err) {
//             return res.status(400).json({
//                 OK: false,
//                 err
//             })
//         };

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 OK: false,
//                 err: {
//                     message: 'Usuario no se encuentra en la base de datos'
//                 }
//             })
//         };

//         //let NombreUsuarioBorrado = usuarioBorrado.toObject();
//         //NombreUsuarioBorrado = _.pick(NombreUsuarioBorrado, 'nombre');
//         res.json({
//             OK: true,
//             //Usuario_borrado: NombreUsuarioBorrado
//             usuarioBorrado
//         })
//     })
// })

module.exports = app;