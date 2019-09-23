const express = require('express');
const app = express();

const Producto = require('../models/producto');
const { autentication, autenticationRole } = require('../middlewares/autentication');

const _ = require('underscore');



//Buscar por un termino en particular

app.get('/producto/buscar/:termino', (req, res) => {


    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');

    Producto.find({ descripcion: regExp })
        .populate('categoria', 'descripcion usuario')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    OK: false,
                    err
                })
            }

            if (!producto) {
                return res.status(400).json({
                    OK: false,
                    err
                })
            }

            res.json({
                OK: true,
                producto
            })

        })
})



app.get('/producto', (req, res) => {


    let solicitados = req.query.solicitados || 5;
    solicitados = Number(solicitados);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(solicitados)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                })
            }

            Producto.countDocuments({ disponible: true }, (err, total) => {

                res.json({
                    OK: true,
                    Total_Productos: total,
                    Total_Mostrados: productos.length,
                    productos
                })

            });
        })

})



app.get('/producto/:id', (req, res) => {


    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion usuario')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    OK: false,
                    err
                })
            }

            if (!producto) {
                return res.status(400).json({
                    OK: false,
                    err
                })
            }

            res.json({
                OK: true,
                producto
            })

        })
})


app.post('/producto', autentication, (req, res) => {


    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                OK: false,
                err
            })
        }

        res.json({
            OK: true,
            productoDB
        })
    });

})

app.put('/producto/:id', (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precio', 'descripcion', 'categoria']);

    if (body.precio) {
        body.precioUni = body.precio;
    }

    Producto.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err
            })
        }
        res.json({
            OK: true,
            productoDB
        })

    })

})


app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findOneAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    OK: false,
                    err
                })
            }
            res.json({
                OK: true,
                productoDB
            })

        })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')


})

module.exports = app;