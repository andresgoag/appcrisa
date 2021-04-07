// Funciones

const set_element_value = (html_id, value) => {
    let elemento = document.getElementById(html_id);
    elemento.value = value;
} // OK

const get_element_value = (html_id) => {
    return document.getElementById(html_id).value;
} // OK

const switch_caso = (caso_produccion) => {

    let caso;

    switch (caso_produccion) {
    case 1:
        caso = ['diseno', 'impresion', 'sublimacion', 'corte', 'confeccion-preparacion1', 'confeccion-preparacion2', 'confeccion-terminacion', 'calidad', 'empaque']; // Sublimada
        break;
    case 2:
        caso = ['corte', 'confeccion-preparacion1', 'confeccion-preparacion2', 'confeccion-terminacion', 'calidad', 'empaque']; // Unicolor
        break;

    case 3:
        caso = ['corte', 'diseno', 'impresion', 'sublimacion', 'confeccion-preparacion1', 'confeccion-preparacion2', 'confeccion-terminacion', 'calidad', 'empaque']; // Medidas personalizadas
        break;

    case 4:
        caso = ['diseno', 'impresion', 'sublimacion', 'confeccion-terminacion', 'calidad', 'empaque']; // Apliques
        break;

    case 5:
        caso = ['empaque']; // Manualidad
        break;

    case 6:
        caso = ['corte', 'confeccion-preparacion1', 'confeccion-preparacion2', 'confeccion-terminacion', 'diseno', 'impresion', 'sublimacion', 'calidad', 'empaque']; // Unicolor vinilo
        break;

    case 7:
        caso = ['corte', 'diseno', 'impresion', 'sublimacion', 'confeccion-preparacion1', 'confeccion-preparacion2', 'confeccion-terminacion', 'calidad', 'empaque']; // Primero corte
        break;

    case 8:
        caso = ['confeccion-preparacion2', 'calidad', 'empaque']; // Manualidad con costuras
        break;

    case 9:
        caso = ['sin material'] // sin material
        break;

    case 10:
        caso = ['planeacion'] // con material
        break;

    default:
        caso = '';
        break;
    }

    return caso;
} // OK

const mensaje_area_responsable = (error, data) => {
    if (error) return console.error(error);
    alert(data["message"]);
} // OK

const area_responsable_prenda = (id_prenda, select_areas) => {

    let info = {
        id_prenda: id_prenda, 
        area: select_areas
    }
    let info_json = JSON.stringify(info)

    fetchData("POST", "/arearesponsableprenda", mensaje_area_responsable, info_json);
} // OK

const enviar_a_siguiente_area = (evento) => {
    let prenda = evento.target.parentElement.parentElement.parentElement;
    let caso = prenda.querySelector(".contenedor-caso-produccion").value;
    let area = prenda.querySelector(".contenedor-areas").value;
    let id_prenda = prenda.querySelector(".id_input").value; // id base de datos
    caso = switch_caso(parseInt(caso));
    let index = caso.indexOf(area)

    if (index == caso.length-1) {
        alert(`${area_produccion_bonita(area)} es la ultima área`)
    } else {
        let verification = confirm(`Desea marcar como completo ${area_produccion_bonita(area)}? Esta acción es irreversible.`)
        if (verification) {
            let info = {
                id_prenda: id_prenda,
                area: area,
                estado: true
            };
            let info_json = JSON.stringify(info);
            fetchData("POST", "/marcarproduccion", function(error, data) {
                if (error) return console.error(error);
                if (data["status"] == "ok") {
                    area_responsable_prenda(id_prenda, caso[index+1]);
                    fetchData("GET", `/cambiarusuariovacio/${id_prenda}`, postDoNothing);
                    prenda.style.display = 'none';
                }
            }, info_json)
        }
    }

} // OK

const guardarEspecificacion = (evento) => {
    let prenda = evento.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    let comentario = prenda.querySelector(".especificacion").value;
    let id_prenda = prenda.querySelector(".id_input").value; // id base de datos

    let info_comentario = {
        id:id_prenda,
        comentario: comentario
    }

    let info_json_comentario = JSON.stringify(info_comentario);
    fetchData("POST", "/modificarcomentario", (error_comentario, data_comentario) => {
        if (error_comentario) return console.error(error_comentario);

        if (data_comentario['message'] == 'ok') {
            prenda.querySelector('.especificacion').value = data_comentario['especificacion'];
            alert("Especificacion actualizada exitosamente");
        } else {
            alert(data_comentario['message'])
        }
    }, info_json_comentario)
} // OK

const postDoNothing = (error, data) => {
    if (error) return console.error(error);
} // OK

const reportarError = (evento) => {
    let prenda = evento.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    let caso = prenda.querySelector(".contenedor-caso-produccion").value;
    casos = switch_caso(parseInt(caso));
    let area = prenda.querySelector(".contenedor-areas").value;
    let id_prenda = prenda.querySelector(".id_input").value; // id base de datos
    let area_retorno = prenda.querySelector('.caso_produccion_error').value;
    let comentario = prenda.querySelector(".textarea-error").value;
    comentario = `El area ${area_produccion_bonita(area)} reportó un error del area ${area_produccion_bonita(area_retorno)} con el siguiente comentario: ${comentario}`;
    let modal_id = prenda.querySelector('.modal').id;

    let info_comentario = {
        id:id_prenda,
        comentario: comentario
    }

    let info_json_comentario = JSON.stringify(info_comentario);
    fetchData("POST", "/agregarcomentario", (error_comentario, data_comentario) => {
        if (error_comentario) return console.error(error_comentario);

        if (data_comentario['message'] == 'ok') {
            prenda.querySelector('.especificacion').value = data_comentario['especificacion'];
        } else {
            alert(data_comentario['message'])
        }
    }, info_json_comentario)

    let info = {
        caso: "",
        id: id_prenda,
        estados: "",
        area_inicial: ""
    };

    let info_json = JSON.stringify(info);
    fetchData("POST", "/casoproduccion", (error1, data1) => {
        if (error1) return console.error(error1);

        info = {
            caso: caso,
            id: id_prenda,
            estados: casos,
            area_inicial: ""
        };
    
        info_json = JSON.stringify(info);
        fetchData("POST", "/casoproduccion", (error2, data2) => {
            if (error2) return console.error(error2);
            area_responsable_prenda(id_prenda, area_retorno);
            $(`#${modal_id}`).modal('hide')
            prenda.style.display = 'none';

            fetchData("GET", `/cambiarusuariovacio/${id_prenda}`, postDoNothing);

        }, info_json);

    }, info_json);

} // OK

const addPrendaProduccion = (id_prenda_nueva) => {

    let div_nueva_prenda = document.createElement("div");

    div_nueva_prenda.setAttribute("class", "my-2 form-row form-group prenda p-2 border");

    div_nueva_prenda.setAttribute("id", "prenda_"+id_prenda_nueva);

    let html_nueva_prenda = `<div style="display: none;">
        <input type="text" class="id_input" id="id_${id_prenda_nueva}" value="">
    </div>
    
    <div class="col-12 col-lg-2">
        <input type="text" class="form-control form-control-sm" placeholder="Tipo de prenda" id="tipo_${id_prenda_nueva}" readonly>
    </div>
    
    <div class="col-12 col-lg-2">
        <input type="text" class="form-control form-control-sm subtipo" placeholder="Subtipo" id="subtipo_${id_prenda_nueva}" readonly>
    </div>
    
    <div class="col-12 col-lg-2">
        <input type="text" class="form-control form-control-sm" placeholder="Género" id="genero_${id_prenda_nueva}" readonly>
    </div>
    
    <div class="col-12 col-lg-2">
        <input type="text" class="form-control form-control-sm" placeholder="Talla" id="talla_${id_prenda_nueva}" readonly>
    </div>
    
    <div class="col-12 col-lg-2">
        <a href="/noimagen" target="_blank" id="imagen_${id_prenda_nueva}" class="form-control form-control-sm" readonly>URL Imagen</a>
    </div>
    
    <div class="col-12 col-lg-2">
        <input type="number" id="cantidad_${id_prenda_nueva}" placeholder="Cantidad" class="form-control form-control-sm cantidad" readonly>
    </div>
    
    <div class="col-12 col-lg-6">
        <div class="input-group">
            <input type="text" id="especificacion_${id_prenda_nueva}" placeholder="Especificación del producto" class="form-control form-control-sm especificacion">
            <div class="input-group-append">
                <button class="btn btn-primary btn-sm" type="button" name="button" id="guardar_especificacion_${id_prenda_nueva}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    
    <div class="col-12 col-lg-2">
        <select id="caso_produccion_${id_prenda_nueva}" class="form-control form-control-sm contenedor-caso-produccion" onchange="casos_produccion(this);" disabled>
            <option value="">Seleccionar proceso</option>
            <option value="1">Caso 1 (Sublimada)</option>
            <option value="2">Caso 2 (Unicolor)</option>
            <option value="3">Caso 3 (Medidas personalizadas)</option>
            <option value="4">Caso 4 (Apliques)</option>
            <option value="5">Caso 5 (Manualidad)</option>
            <option value="6">Caso 6 (Unicolor vinilo)</option>
            <option value="7">Caso 7 (Primero corte)</option>
            <option value="8">Caso 8 (Manualidad con costuras)</option>
            <option value="9">Sin Material</option>
            <option value="10">Con Material</option>
        </select>
    </div>
    
    <div class="col-12 col-lg-2">
        <select class="form-control form-control-sm contenedor-areas" id="area_${id_prenda_nueva}" disabled>
            <option value="">Área responsable</option>
        </select>
    </div>
    
    <div class="col-12 col-lg-2">
        <div class="input-group">
            <input type="text" id="usuario_${id_prenda_nueva}" placeholder="Usuario responsable" class="form-control form-control-sm contenedor-usuario" disabled>
            <div class="input-group-append">
                <button class="btn btn-primary btn-sm" type="button" name="button" onclick="usuario_responsable_prenda(this);" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    
    <div class="col-12 mt-3">
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary btn-sm cargar_tiempos" id="cargar_tiempos_${id_prenda_nueva}" onclick="cargarTiempos(this);">Cargar tiempos</button>
            <button class="ml-1 btn btn-primary btn-sm" id="enviar_a_siguiente_area_${id_prenda_nueva}">Marcar etapa como completa</button>
            <button class="ml-1 btn btn-danger" type="button" name="button" data-toggle="modal" data-target="#modal_error_${id_prenda_nueva}">Reportar error</button>
        </div>
    </div>

    <!-- Este div es lo que aparece con el boton -->
    <div class="modal fade" id="modal_error_${id_prenda_nueva}" tabindex="-1" role="dialog" aria-labelledby="cualquier_modal_id" aria-hidden="true">
        <div class="modal-dialog">

            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Reporte de error</h5>
                    <button class="close" data-dismiss="modal" type="button" name="button">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">

                    <div class="row justify-content-center">
                        <div class="col-12">
                            <label for="caso_produccion_error_${id_prenda_nueva}">Área a la que retorna:</label>
                            <select id="caso_produccion_error_${id_prenda_nueva}" class="form-control caso_produccion_error">
                            </select>
                        </div>
                        <div class="col-12">
                            <label for="textarea_error_${id_prenda_nueva}">Comentarios:</label>
                            <textarea class="textarea-error form-control" rows="4" name="textarea_error_${id_prenda_nueva}" id="textarea_error_${id_prenda_nueva}" cols="30" rows="10"></textarea>
                            <p>Recuerde informar a su superior</p>
                        </div>
                        <div class="col-auto mt-2">
                            <button class="ml-1 btn btn-danger btn-sm" id="boton_reportar_error_${id_prenda_nueva}">Reportar error</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>`;

    div_nueva_prenda.insertAdjacentHTML('beforeend', html_nueva_prenda);
    let div_prendas = document.getElementById("prendas");
    div_prendas.appendChild(div_nueva_prenda);

    document.getElementById(`enviar_a_siguiente_area_${id_prenda_nueva}`).addEventListener('click', enviar_a_siguiente_area);
    document.getElementById(`boton_reportar_error_${id_prenda_nueva}`).addEventListener('click', reportarError);
    document.getElementById(`guardar_especificacion_${id_prenda_nueva}`).addEventListener('click', guardarEspecificacion);

} // OK

const clearProductionPage = () => {
    set_element_value("numerodeorden", "");

    let div_prendas = document.getElementById("prendas");
    div_prendas.innerHTML = "";

} // OK

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
} // OK

const verificar_tiempo_abierto = (error, data) => {

    if (error) return console.error(error);

    let tiempos_abiertos = data["tiempos_abiertos"];
    let prendas_creadas = document.getElementsByClassName("id_input");
    for (let index = 0; index < prendas_creadas.length; index++) {

        for (let indexb = 0; indexb < tiempos_abiertos.length; indexb++) {
            if (prendas_creadas[index].value == tiempos_abiertos[indexb]["prenda"]) {
                document.querySelector("#"+prendas_creadas[index].parentElement.parentElement.id +" .cargar_tiempos").classList.remove("btn-primary");
                document.querySelector("#"+prendas_creadas[index].parentElement.parentElement.id +" .cargar_tiempos").classList.add("btn-success");
                document.querySelector("#"+prendas_creadas[index].parentElement.parentElement.id +" .cargar_tiempos").textContent = "Detener Tiempo"
            } 
        }
    }
} // OK

const casos_produccion_modal = (caso, select) => {
    let list_caso = switch_caso(parseInt(caso));
    if (list_caso != "") {

        select.innerHTML = "";
        select.insertAdjacentHTML('beforeend', '<option value="planeacion">Planeación</option>');


        for (let i = 0; i < list_caso.length; i++) {
            let html_area_produccion = '<option value="'+list_caso[i]+'">'+area_produccion_bonita(list_caso[i])+'</option>'
            select.insertAdjacentHTML('beforeend', html_area_produccion);
        }
    } else {
        select.innerHTML = '<option value="">Área responsable</option>';
    }
} // OK

const set_order_informacion = (error, data) => {

    if (error) return console.error(error);

    set_element_value("numerodeorden", data["numero_orden"]);
    set_element_value("marcaorden", capitalize(data["marca"]));
    set_element_value("estado_orden", data["estado_orden"]);


    fetchData("GET", "/getsession", (error1, data1) => {
        if (error1) return console.error(error);

        for (let i = 0; i < data["prendas"].length; i++) {

            if (data1['area'] == data["prendas"][i]["area_responsable"] && data1['usuario'] == data["prendas"][i]["usuario_responsable"]) {
                addPrendaProduccion(i)
        
                set_element_value("id_"+i, data["prendas"][i]["id"]);
                set_element_value("tipo_"+i, data["prendas"][i]["tipo"]);
                set_element_value("subtipo_"+i, data["prendas"][i]["subtipo"]);
                set_element_value("genero_"+i, data["prendas"][i]["genero"]);
                set_element_value("talla_"+i, data["prendas"][i]["talla"].toUpperCase());
                document.getElementById("imagen_"+i).setAttribute('href', data["prendas"][i]["imagen"]);
                set_element_value("cantidad_"+i, data["prendas"][i]["cantidad"]);
                set_element_value("especificacion_"+i, data["prendas"][i]["especificacion"]);
                set_element_value("caso_produccion_"+i, data["prendas"][i]["caso_produccion"]);
                casos_produccion(document.getElementById("caso_produccion_"+i))
                if ((data["prendas"][i]["caso_produccion"] == "" && data["prendas"][i]["area_responsable"] == "diseno")) {
                    document.getElementById("area_"+i).innerHTML = '<option value="diseno">Diseño</option>';
                }
                set_element_value("usuario_"+i, data["prendas"][i]["usuario_responsable"]);
                set_element_value("area_"+i, data["prendas"][i]["area_responsable"]);
                casos_produccion_modal(data["prendas"][i]["caso_produccion"], document.getElementById(`caso_produccion_error_${i}`));
            } else {
                continue;
            }

        }
    
        fetchData("GET", "/verificartiempos/"+get_element_value("numerodeorden"), verificar_tiempo_abierto)

    })

} // OK

const buscarOrdenProduccion = () => {
    clearProductionPage();
    let order = get_element_value("input_buscar_orden").trim();
    fetchData("GET", "/getorder/"+order, set_order_informacion);
} // OK

const area_produccion_bonita = (area) => {

    switch (area) {
        case 'diseno':
            return "Diseño";

        case 'impresion':
            return "Impresión";

        case 'sublimacion':
            return "Sublimación";

        case 'corte':
            return "Corte";

        case 'confeccion-preparacion1':
            return "Confección-preparación 1";

        case 'confeccion-preparacion2':
            return "Confección-preparación 2";

        case 'confeccion-terminacion':
            return "Confección-terminación";

        case 'calidad':
            return "Calidad";

        case 'empaque':
            return "Empaque";

        case 'sin material':
            return "Sin Material";

        case 'planeacion':
            return "Planeación";

        default:
            return 'Area no reconocida'
    }
} // OK

const casos_produccion = (clickedElement) => {
    let _id = clickedElement.parentElement.parentElement.id; // id del elemento contenedor de la prenda 
    let caso = switch_caso(parseInt(clickedElement.value));
    if (caso != "") {

        document.querySelector("#"+_id+" .contenedor-areas").innerHTML = "";
        document.querySelector("#"+_id+" .contenedor-areas").insertAdjacentHTML('beforeend', '<option value="planeacion">Planeación</option>');

        for (let i = 0; i < caso.length; i++) {
            let html_area_produccion = '<option value="'+caso[i]+'">'+area_produccion_bonita(caso[i])+'</option>'
            document.querySelector("#"+_id+" .contenedor-areas").insertAdjacentHTML('beforeend', html_area_produccion);
        }
    } else {
        document.querySelector("#"+_id+" .contenedor-areas").innerHTML = '<option value="">Área responsable</option>';
    }
} // OK

const cargarTiempos = (clickedElement) => {
    let _id = clickedElement.parentElement.parentElement.parentElement.id;
    let id_prenda = document.querySelector("#"+_id+" .id_input").value;
    let info = {
        id_prenda: id_prenda,
    };
    let info_json = JSON.stringify(info);

    fetchData("POST", "/tiempos", (error, data) => {
        if(error) return console.error(error);

        if (data["final"] === ""){
            document.querySelector("#"+_id+" .cargar_tiempos").classList.remove("btn-primary");
            document.querySelector("#"+_id+" .cargar_tiempos").classList.add("btn-success");
            document.querySelector("#"+_id+" .cargar_tiempos").textContent = "Detener Tiempo"
        } else {
            document.querySelector("#"+_id+" .cargar_tiempos").classList.remove("btn-success");
            document.querySelector("#"+_id+" .cargar_tiempos").classList.add("btn-primary");
            document.querySelector("#"+_id+" .cargar_tiempos").textContent = "Cargar tiempos"
        }
    }, info_json);
} // OK





boton_buscar_orden = document.getElementById("boton_buscar_orden");
boton_buscar_orden.addEventListener('click', buscarOrdenProduccion);