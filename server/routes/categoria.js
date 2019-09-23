const express = require('express');
const app = express();

const Categoria = require('../models/categoria');
const { autentication, autenticationRole } = require('../middlewares/autentication');



//mostrar una categoria por su Id
app.get('/categoria/:id', (req, res) => {

    var id = req.params.id;

    Categoria.findById(id)
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                })
            }

            res.json({
                OK: true,
                categorias
            })

        })

});


//Mostrar todas las categorias
app.get('/categoria', (req, res) => {


    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                })
            }

            res.json({
                OK: true,
                Total: categorias.length,
                categorias
            })

        })


});

//Crear una nueva categoría
app.post('/categoria', autentication, (req, res) => {
    //El Id del usuario se encuentra en el token descifrado como : req.usuario.id; 
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            res.status(400).json({
                OK: false,
                err
            })
        } else {

            res.json({
                OK: true,
                categoria: categoriaDB
            })
        }
    })
});
//Actualizar la descripcion de la categoria
app.put('/categoria/:id', autentication, (req, res) => {

    var id = req.params.id;
    if (req.body.descripcion.length === 0) {
        res.status(400).json({
            OK: false,
            error: {
                message: "Debe enviar una descripción con algún dato"
            }
        })
    } else {
        Categoria.findByIdAndUpdate(id, { descripcion: req.body.descripcion }, { new: true }, (err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    OK: false,
                    err
                })
            }
            res.json({
                OK: true,
                categoriaDB
            })
        })
    }


});

//Borrar una categoria por su Id
//Solo la puede borrar un administrador
app.delete('/categoria/:id', [autentication, autenticationRole], (req, res) => {

    var id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }

        res.json({
            OK: true,
            categoriaBorrada
        })
    })


});


module.exports = app;