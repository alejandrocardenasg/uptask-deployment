const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyecto = require('./Proyecto');
const bcrypt = require('bcrypt');

const Usuario = db.define('usuarios', {

    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        },
        validate: {
            isEmail: {
                msg: 'Agrega un Correo Válido'
            },
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            }
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: Sequelize.STRING(100),
    expiracion: Sequelize.DATE
},
{
    hooks:{
        beforeCreate(usuario){

            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));

        }
    }
});

//Métodos personalizados

Usuario.prototype.verificarPassword = function(password){

    return bcrypt.compareSync(password, this.password);

}

/* Usuario.hasMany(Proyecto, {
    foreignKey: {allowNull:false}
}); */
 

module.exports = Usuario;