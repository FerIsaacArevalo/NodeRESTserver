//Nota Previa: <process.env.port> y <process.env.node_env> no existen de manera local 
//             cuando la aplicacion es subida a heroku, este crea esas variables en el environment.

//////////////////////////////////7
// PUERTO
process.env.PORT = process.env.PORT || 3000;
//////////////////////////////////
//CONOCER EL ENVIRONMENT ///////////////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
    ////////////////////////////////////

//CADENA DE CONEXIÓN ////////////////

let urlConnect;
if (process.env.NODE_ENV === 'dev') {
    urlConnect = 'mongodb://localhost:27017/cafe';
} else {
    urlConnect = 'mongodb+srv://FernandoAdmin:N13WO4XWtE6EDmIY@cluster0-u2fzf.mongodb.net/cafe';
}
//////////////////////////////////////

//EXPORTAR LA CADENA DE CONEXIÓN

process.env.URL_CONNECT = urlConnect;
////////////////////////////////