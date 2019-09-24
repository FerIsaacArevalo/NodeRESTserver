const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.put('/upload/:tipo/:id', function(req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                OK: false,
                error: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    let tipoValido = ['usuario', 'producto'];
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (tipoValido.indexOf(tipo) == -1) {
        return res.status(400)
            .json({
                OK: false,
                error: {
                    message: 'El tipo debe ser: ' + tipoValido.join(', '),
                    tipoEntregado: tipo
                }
            });
    }


    //archivo es el nombre que yo le doy a la variable por la cual se enviará el documento a subir
    let archivo = req.files.archivo;

    //Validar la extension del archivo

    let extensionesValidas = ['jpg', 'gif', 'jpeg', 'png'];

    let archivoCortado = archivo.name.split('.');
    let extensionArchivo = archivoCortado[archivoCortado.length - 1];


    if (extensionesValidas.indexOf(extensionArchivo) == -1) {

        return res.status(500).json({
            OK: false,
            message: 'Extension del archivo no valida, extensiones permitidas: ' + extensionesValidas.join(', '),
            extRecibida: extensionArchivo
        });

    }

    switch (tipo) {
        case 'usuario':
            actualizarUsuario(id, res, extensionArchivo, tipo, archivo);
            break;

        case 'producto':
            actualizarProducto(id, res, extensionArchivo, tipo, archivo);
            break;
    }
});

//Busca si existe el producto en la base de datos y envia información a los otros metodos descritos abajo
let actualizarProducto = (id, res, extensionArchivo, carpetaUpload, archivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: `Producto con id ${id} no encontrado en DB`
                }
            });
        }

        let nomArchivo = `${productoDB.id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

        subirImagen(res, archivo, nomArchivo, carpetaUpload);
        borrarImagen(productoDB.img, 'producto');
        actualizar(id, Producto, nomArchivo, res);
    })
}

//Busca si existe el usuario en la base de datos y envia información a los otros metodos descritos abajo
let actualizarUsuario = (id, res, extensionArchivo, carpetaUpload, archivo) => {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                OK: false,
                error: {
                    message: `Usuario con id ${id} no encontrado en DB`
                }
            });
        }

        //Crear un nombre de archivo: *se le agrega un valor raro para que el navegador web no lo tome del cache (son los milisegundos)*

        let nomArchivo = `${usuarioDB.id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
        subirImagen(res, archivo, nomArchivo, carpetaUpload);
        borrarImagen(usuarioDB.img, 'usuario');
        actualizar(id, Usuario, nomArchivo, res);
    })
}

//Actualizar en nombre de la imagen en la BD de usuario y producto, 
//se reutiliza la funcion para producto y usuario todo depende del tipo que llegue: Tipo = 'usuario' || 'producto'
let actualizar = (id, Tipo, nomArchivo, res) => {

    Tipo.findByIdAndUpdate(id, { img: nomArchivo }, (err, resp) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                err
            });
        }

        res.json({
            OK: true,
            message: 'Archivo subido',
            id: resp.id
        });

    })

}

//Subir la imagen al servidor
let subirImagen = (res, archivo, nomArchivo, carpetaUpload) => {
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${carpetaUpload}/${nomArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err
            });
        }

    })
}

//Borrar la imagen anterior del mismo usuario para cargarle otra nueva
let borrarImagen = (nombreImagen, tipo) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}
module.exports = app;