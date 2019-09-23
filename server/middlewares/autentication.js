const jwt = require('jsonwebtoken');

let autentication = (req, res, next) => {

    let token = req.headers.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {


        if (err) {
            return res.status(401).json({
                OK: false,
                err
            })
        };

        req.usuario = decoded.usuario;

        next();


    });

}


let autenticationRole = (req, res, next) => {

    let token = req.headers.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {


        if (decoded.usuario.role === 'USER_ROLE') {
            return res.status(401).json({
                OK: false,
                error: {
                    message: 'Usuario sin privilegios para realizar la acción'
                }
            })
        };
        next();
        //req.usuario = decoded.usuario;



    });

}

module.exports = {
    autentication,
    autenticationRole
}