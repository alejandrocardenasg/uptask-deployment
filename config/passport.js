const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('../models/Usuario');

//Local Strategy -- Login con credenciales propias

passport.use(
    new LocalStrategy(
        //Por default passport espera un usuario y password

        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done) =>{
            try {
                const usuario = await Usuario.findOne(
                    {
                        where: {
                            email: email,
                            activo: 1
                        }
                    }
                )
                //Usuario existe pero password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'La contraseña es incorrecta'
                    })
                }
                return done(null, usuario)

            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })

            }
        }

    )
)

//Serializar el usuario

passport.serializeUser((usuario, callback)=>{
    callback(null,  usuario);
})

//Deserializar el usuario

passport.deserializeUser((usuario, callback)=>{
    callback(null,  usuario);
})

module.exports = passport;