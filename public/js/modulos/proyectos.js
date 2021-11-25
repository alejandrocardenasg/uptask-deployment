import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', (event)=>{
        const urlProyecto = event.target.dataset.proyectoUrl; // proyectoUrl = proyecto-url

        Swal.fire({
                title: 'Deseas borrar este proyecto',
                text: "Un proyecto eliminado no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, Borrar!'
            }).then((result) => {
                if (result.isConfirmed) {

                    //Enviar petición para eliminar

                    const url = `${location.origin}/proyectos/${urlProyecto}`;

                    axios.delete(url, {params: {urlProyecto}})
                        .then(function(res){
                            
                            Swal.fire(
                                'Eliminado!',
                                'El proyecto ha sido eliminado.',
                                'success'
                            );
            
                            //Redireccionar al inicio
                
                            setTimeout(()=>{
                                window.location.href = '/'
                            }, 1000);
                        }).catch((error)=>{
                            Swal.fire({
                                icon: 'error',
                                title:'Hubo un error',
                                text: 'No se pudo eliminar el proyecto'
                            })
                        })
        
                }
            })
    
    });
}

export default btnEliminar;
