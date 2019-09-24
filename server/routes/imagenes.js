const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const { autenticationUrl } = require('../middlewares/autentication');

app.get('/imagen/:tipo/:img', autenticationUrl, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (!fs.existsSync(pathImagen)) {

        return res.status('404').json({
            OK: false,
            error: {
                message: 'Imagen no existe'
            }
        })
    }
    res.sendFile(pathImagen);




})



module.exports = app;