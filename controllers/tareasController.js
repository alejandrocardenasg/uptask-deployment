const { uglifyJsMinify } = require('terser-webpack-plugin');
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

exports.agregarTarea = async(req,res, next)=>{

    const proyecto = await Proyecto.findOne(
        {
            where: {
            url: req.params.url 
            }
        }
    );

    const {tarea} = req.body;

    const estado = 0;

    const proyectoId = proyecto.id;

    const resultado = await Tarea.create({
        tarea,
        estado,
        proyectoId
    });

    if(!resultado){
        return next();
    }

    res.redirect(`/proyectos/${req.params.url}`);

}

exports.cambiarEstadoTarea = async(req,res,next) =>{

    const { id } = req.params;
    
    const tarea = await Tarea.findOne({
        where: {id: id}
    });

    //Cambiar estado

    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado');

}

exports.eliminarTarea = async(req,res, next) =>{

    const { id } = req.params;

    //ELIMINAR LA TAREA

    const resultado = await Tarea.destroy(

        {
            where: {id: id}
        }

    )

    if(!resultado) return next();

    res.status(200).send("Tarea eliminada correctamente");

}