const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

const {body, validationResult} = require('express-validator');

// Funciones del controlador

exports.proyectosHome = async(req,res) =>{

    const proyectos = await Proyecto.findAll(
        {
            where: {
                usuarioId: res.locals.usuario.id
            }
        }
    );

    res.render("index", {
        nombrePagina : 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async(req,res)=>{

    const proyectos = await Proyecto.findAll(
        {
            where: {
                usuarioId: res.locals.usuario.id
            }
        }
    );

    res.render('nuevoProyecto', {
        nombrePagina: "Nuevo Proyecto",
        proyectos
    });
}

exports.nuevoProyecto = async(req,res) =>{
    
    //Reglas de validación
    const rules = [
        body('nombre').not().isEmpty().trim().escape().withMessage('El nombre')
    ];

    //Hacer validación

    await Promise.all(rules.map(validation => validation.run(req)));

    //Obtener errores

    const erroress = validationResult(req);

    const { nombre } = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al Proyecto'});
    }

    if(errores.length > 0){
        const proyectos = await Proyecto.findAll(
            {
                where: {
                    usuarioId: res.locals.usuario.id
                }
            }
        );
        res.render('nuevoProyecto', {
            nombrePagina: "Nuevo Proyecto",
            proyectos,
            errores
        });
    }else{
        
        const usuarioId = res.locals.usuario.id;
        
        await Proyecto.create({nombre,usuarioId});
        res.redirect('/');

    }

}

exports.proyectoporURL = async(req,res, next) =>{

    const proyectosPromise = Proyecto.findAll(
        {
            where: {
                usuarioId: res.locals.usuario.id
            }
        }
    );

    const proyectoPromise = Proyecto.findOne({
        where: {
            url: req.params.url,
            usuarioId: res.locals.usuario.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    if(!proyecto) return next();

    const tareas = await Tarea.findAll(
        {
            where:{
                proyectoId: proyecto.id
            },
            include: [
                {model: Proyecto}
            ]
        }
    );

    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })

}

exports.formularioEditar = async(req,res)=>{

    const proyectosPromise = Proyecto.findAll(
        {
            where: {
                usuarioId: res.locals.usuario.id
            }
        }
    );

    const proyectoPromise = Proyecto.findOne({
        where: {
            url: req.params.url,
            usuarioId: res.locals.usuario.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });

}

exports.nuevoProyectoporID = async(req,res) =>{

    //PARA HACER UNA SOLA VALIDACIÓN
    let validacion = await body('nombre').not().isEmpty().trim().escape().withMessage({'texto': 'Agrega un nombre al Proyecto'}).run(req);
    const error = validationResult(req);

    const { nombre } = req.body;

    let errores = [];

    if(errores.length > 0){
        errores.push({'texto': 'Error al actualizar el nombre al Proyecto'});
        const proyectos = await Proyecto.findAll(
            {
                where: {
                    usuarioId: res.locals.usuario.id
                }
            }
        );
        
        res.render('nuevoProyecto', {
            nombrePagina: "Nuevo Proyecto",
            proyectos,
            errores
        });
    }else{

        await Proyecto.update(
            {nombre: nombre},
            {where: 
                {id: req.params.id}
            }
        );
        res.redirect('/');

    }
    

}

exports.eliminarProyecto = async(req,res, next) =>{

    const {urlProyecto} = req.query;

    const resultado = await Proyecto.destroy(
    
        {where: {
            url: urlProyecto
        }}
    
    );

    if(!resultado){
        return next();
    }

    res.status(200).send("Proyecto eliminado correctamente");

}