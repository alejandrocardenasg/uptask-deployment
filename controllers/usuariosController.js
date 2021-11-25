const Usuario = require('../models/Usuario');
const enviarEmail = require('../handlers/email');

exports.formCrearcuenta = (req,res) =>{

    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    });


}

exports.crearCuenta = async(req,res) =>{
    
    const {email, password} = req.body;

    try{

        await Usuario.create({
            email: email,
            password: password
        });

        //Crear una URL de confirmar

        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;


        //Crear el objeto de usuario

        const usuario = {
            email: email
        }

        // Enviar Email

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu Cuenta de UpTask',
            confirmarUrl: confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    }catch(error){
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            nombrePagina: 'Crear Cuenta en Uptask',
            mensajes: req.flash(),
            email: email,
            password: password
        });

    }



}

exports.forminiciarSesion = async(req,res) =>{
    const {error} = res.locals.mensajes;
    res.render("iniciarSesion", {
        nombrePagina: 'Iniciar sesión en Uptask',
        error: error
    });

}

exports.reestablecer = (req,res)=>{
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer contraseña'
    });
}

exports.confirmarCuenta = async(req,res) =>{


    const {correo} = req.params.correo;

    const usuario = await Usuario.findOne({
        where:{
            email: req.params.correo
        }
    });

    if(!usuario){

        req.flash('error', 'No se ha registrado ningun usuario con este correo');
        res.redirect('/crear-cuenta');

    }

    usuario.activo = 1;

    usuario.save();

    req.flash('correcto','Cuenta activada correctamente');

    res.redirect('/iniciar-sesion');

}