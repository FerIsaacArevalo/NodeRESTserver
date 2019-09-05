const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let validarRoles = {
    values: [
        'ADMIN_ROLE',
        'USER_ROLE'
    ],
    message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validarRoles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });





module.exports = mongoose.model('Usuario', usuarioSchema);