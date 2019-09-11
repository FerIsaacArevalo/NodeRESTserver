const config = require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
///----------------------------------------
//UTILIZACIÓN DEL NPM BODY PARSER 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    ///----------------------------------------

app.use(require('./routes/index'));

mongoose.connect(process.env.URL_CONNECT, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
    (err, res) => {

        if (err) throw err;


        console.log("Base de datos online");
    });


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: ${process.env.PORT}`);
});