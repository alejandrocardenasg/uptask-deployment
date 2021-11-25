import axios from 'axios';
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', (e)=>{

        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            console.log(idTarea);

            //request para cambiar estado de tarea

            const url = `${location.origin}/tareas/${idTarea}`;
            console.log(url);

            axios.patch(url, {idTarea})
                .then(function(res){
                    if(res.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
                .catch(function(e){
                    console.log(e);
                })

        }

        if(e.target.classList.contains('fa-trash')){
            
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                    title: 'Deseas borrar esta tarea',
                    text: "Una tarea eliminada no se puede recuperar",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, Borrar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    //Enviar petición para eliminar tarea

                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, { params: {idTarea }})
                        .then(function(res){
                            console.log(res);

                            if(res.status === 200){
                                //Eliminar la tarea de la vista

                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //Opcional una alerta

                                Swal.fire(
                                    'Tarea Eliminada',
                                    res.data,
                                    'success'
                                )

                                actualizarAvance();

                            }

                        });
                    
                }
            })

        }

    });

}

export default tareas;