//Nota Previa: <process.env.port> y <process.env.node_env> no existen de manera local 
//             cuando la aplicacion es subida a heroku, este crea esas variables en el environment.

//Nota2: <proces.env.STRING_CONNECT> fue creada por nosotros como una varible de producción de heroku (tutorial Git.txt)

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
    urlConnect = process.env.STRING_CONNECT;
}
//////////////////////////////////////

//EXPORTAR LA CADENA DE CONEXIÓN

process.env.URL_CONNECT = urlConnect;
////////////////////////////////