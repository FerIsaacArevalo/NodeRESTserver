const config = require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
///----------------------------------------
//UTILIZACIÓN DEL NPM BODY PARSER 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    ///----------------------------------------
app.get('/', function(req, res) {
    res.json('Hello World')
})

app.get('/usuario', function(req, res) {
    res.json('GetUsuario')
})

app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            OK: false,
            mensaje: "Falta el parametro nombre"
        })
    } else {
        res.json({
            persona: body
        })
    }
})

app.put('/usuario/:poto', function(req, res) {

    let id = req.params.poto;
    res.json({
        id
    })
})

app.delete('/usuario', function(req, res) {
    res.json(`hola a todos`)
})




app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: ${process.env.PORT}`);
});