const express = require('express');
const app = express();


app.use(require('./login'));

app.use(require('./usuario'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));


//Pagina por defecto
app.get('/', function(req, res) {
    res.json('La aplicacion esta corriendo')
})

module.exports = app;