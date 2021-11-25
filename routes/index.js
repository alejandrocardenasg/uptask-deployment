const express = require('express');
const router = express.Router();

//Importar el controlador

const proyectosController = require('../controllers/proyectosController');
const TareasController = require('../controllers/tareasController');
const UsuariosController = require('../controllers/usuariosController');
const AuthController = require('../controllers/AuthController');

module.exports = function(){
    
    //PROYECTOS CONTROLLER
    router.get('/', 
        AuthController.usuarioAutenticado,
        proyectosController.proyectosHome
    );
    router.get('/nuevo-proyecto', 
        AuthController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    router.post('/nuevo-proyecto', 
        AuthController.usuarioAutenticado,
        proyectosController.nuevoProyecto
    );
    router.get('/proyectos/:url', 
        AuthController.usuarioAutenticado,
        proyectosController.proyectoporURL
    );
    router.get('/proyecto/editar/:url', 
        AuthController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id', 
        AuthController.usuarioAutenticado,
        proyectosController.nuevoProyectoporID
    );
    router.delete('/proyectos/:url', 
        AuthController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //TAREAS CONTROLLER
    router.post('/proyectos/:url', 
        AuthController.usuarioAutenticado,
        TareasController.agregarTarea
    );
    router.patch('/tareas/:id', 
        AuthController.usuarioAutenticado,
        TareasController.cambiarEstadoTarea
    )
    router.delete('/tareas/:id', 
        AuthController.usuarioAutenticado,
        TareasController.eliminarTarea
    )

    //LOGIN y REGISTRO

    router.get('/crear-cuenta', UsuariosController.formCrearcuenta);
    router.post('/crear-cuenta', UsuariosController.crearCuenta);
    router.get('/iniciar-sesion', UsuariosController.forminiciarSesion);
    
    //CONFIRMAR CUENTA

    router.get('/confirmar/:correo', UsuariosController.confirmarCuenta);

    //RESTABLECER CONTRASEÑA
    router.get('/reestablecer', UsuariosController.reestablecer);
    router.post('/reestablecer', AuthController.enviarToken);
    router.get('/reestablecer/:token', AuthController.resetPassword);
    router.post('/reestablecer/:token', AuthController.actualizarPassword);

    //Autenticar usuario
    router.post('/iniciar-sesion', AuthController.autenticarusuario);
    
    //Cerrar sesión

    router.get('/cerrar-sesion', 
        AuthController.usuarioAutenticado,
        AuthController.cerrarSesion
    );

    return router;
}