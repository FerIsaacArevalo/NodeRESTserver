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


//CLIENTE ID DE GOOGLE ///////////////
process.env.CLIENT_ID = process.env.CLIENT_ID || '624549850960-us1hqumoee6tfg1bi773f32pk066je99.apps.googleusercontent.com'
    ////////////////////////////////////

//VARIABLES TOKENS 

process.env.TOKEN_VENDATE = process.env.TOKEN_VENDATE || '30d';

process.env.SEED = process.env.SEED || 'super-clave-secreta-desarrollo';



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