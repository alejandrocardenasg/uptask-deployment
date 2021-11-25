import Swal from "sweetalert2";

export const actualizarAvance = () =>{

    //Seleccionar las tareas existentes

    const tareas = document.querySelectorAll("li.tarea");

    if(tareas.length){

        //Seleccionar las tareas completadas

        const tareasCompletas = document.querySelectorAll('i.completo');

        const avance = Math.round(100*tareasCompletas.length/tareas.length);

        //Mostrar el avance

        const porcentaje = document.querySelector('#porcentaje');

        porcentaje.style.width = `${avance}%`;

        if(avance === 100){
            Swal.fire(
                'Completaste el proyecto',
                'Felicidades, has terminado las tareas de este proyecto',
                'success'
            )
        }

    }

    



}