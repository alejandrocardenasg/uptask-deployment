const passport = require('passport');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const enviarEmail = require('../handlers/email');

const crypto = require('crypto');

exports.autenticarusuario =  passport.authenticate('local', {

    successRedirect: '/',

    failureRedirect: '/iniciar-sesion',

    failureFlash: true,
    
    badRequestMessage: 'Ambos campos son obligatorios'

});

exports.usuarioAutenticado = (req,res,next) =>{

    //Si el usuario esta autenticado, adelante

    if(req.isAuthenticated()){
        return next();
    }

    //else: redirigir al form
    return res.redirect('/iniciar-sesion');

}

exports.cerrarSesion = (req,res) =>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    });
}

exports.enviarToken = async(req,res) =>{

    const usuario = await Usuario.findOne({
        where:{
            email: req.body.email
        }
    });

    if(!usuario){

        req.flash('error', 'No existe esa cuenta');

        res.redirect('/reestablecer');
    }

    usuario.token =  crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; 

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //Enviar correo con el token

    await enviarEmail.enviar({
        usuario,
        subject: 'Recuperar contraseña',
        resetUrl: resetUrl,
        archivo: 'reestablecerpassword'
    });

    //
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.resetPassword = async(req,res)=>{

    const usuario = await Usuario.findOne({
        where:{
            token: req.params.token
        }
    });

    if(!usuario){

        req.flash('error', 'Token No válido');

        res.redirect('/reestablecer');

    }

    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña',
        correo: usuario.email
    })

} 

exports.actualizarPassword = async(req,res) =>{

    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now() // Fecha de la base de datos es mayor que la fecha actual
            }
        }
    });

    if(!usuario){
        req.flash('error','El token es inválido o ha expirado');
        res.redirect('/reestablecer');
    }

    const {password} = req.body;

    usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');

    res.redirect('/iniciar-sesion');

}