const express = require('express');
const app = express();

const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const { autentication, autenticationRole } = require('../middlewares/autentication');


let salt = bcrypt.genSaltSync(10);

app.get('/usuario', autentication, function(req, res) {

    let solicitados = req.query.solicitados || 5;
    solicitados = Number(solicitados);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({ estado: true }, 'nombre email role')
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

app.post('/usuario', [autentication, autenticationRole], function(req, res) {

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



            res.json({
                OK: true,
                usuarioDB
            })
        }
    })


})

app.put('/usuario/:poto', autentication, function(req, res) {

    let id = req.params.poto;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, UsuarioDB) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }



        res.json({
            OK: true,
            UsuarioDB
        })

    })


})

//METODO QUE SOLO CAMBIA EL ESTADO DEL USUARIO EN LA BASE DE DATOS
app.delete('/usuario/:id', [autentication, autenticationRole], function(req, res) {

    let id = req.params.id;
    let body = { estado: false };

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, UsuarioDB) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }



        res.json({
            OK: true,
            UsuarioDB
        })

    })
})


//METODO PARA BORRAR FISICAMENTE AL USUARIO DE LA BASE DE DATOS
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