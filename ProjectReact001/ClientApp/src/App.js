import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react";

const App = () => {

    //1.- Crear useState
    const [tareas, setTareas] = useState([]);

    //7.- Crear useState descripcion
    const [descripcion, setDescripcion] = useState("");

    //2.- Metodo Obtener
    const mostrarTareas = async () => {

        const response = await fetch("api/tarea/Listar");

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setTareas(data)
        } else {
            console.log("status code:" + response.status)
        }

    }
    //3.- Metodo convertir fecha
    const formatDate = (string) => {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let fecha = new Date(string).toLocaleDateString("pt-BR", options);
        let hora = new Date(string).toLocaleTimeString();
        return fecha + " | " + hora
    }

    //4.- Insertar datos
    useEffect(() => {
        mostrarTareas();
    }, [])


    //8.- Guardar NOTA
    const guardarTarea = async (e) => {

        e.preventDefault()

        const response = await fetch("api/tarea/Guardar", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ descripcion: descripcion })
        })

        if (response.ok) {
            setDescripcion("");
            await mostrarTareas();
        }
    }

    //10 Cerrar Tarea
    const cerrarTarea = async (id) => {

        const response = await fetch("api/tarea/Cerrar/" + id, {
            method: "DELETE"
        })

        if (response.ok)
            await mostrarTareas();
    }

    return (
        <div className="container bg-dark p-4 vh-100">
            <h2 className="text-white">Lista de tareas</h2>
            <div className="row">

                <div className="col-sm-12">
                    <form onSubmit={guardarTarea}>

                        <div className="input-group">
                            <input type="text" className="form-control"
                                placeholder="Adicionar Elemento"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)} />

                            <button className="btn btn-success">Agregar</button>
                        </div>

                    </form>
                </div>

            </div>
            <div className="row mt-4">
                <div className="col-sm-12">

                    <div className="list-group"> 
                        {
                            tareas.map(
                                (item) => (
                                    <div key={item.idTarea} className="list-group-item list-group-item-action">

                                        <h5 className="text-primary">{item.descripcion}</h5>

                                        <div className="d-flex justify-content-between">
                                            <small className="text-muted">{formatDate(item.fechaRegistro)}</small>
                                            <button type="button" className="btn btn-sm btn-outline-danger"
                                                onClick={() => cerrarTarea(item.idTarea)}>
                                                Apagar
                                            </button>
                                        </div>

                                    </div>
                                )
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default App;