let select_previous_value;


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

const area_responsable_error = (id_prenda, select_areas) => {

    let info = {
        id_prenda: id_prenda, 
        area: select_areas
    }
    let info_json = JSON.stringify(info)

    fetchData("POST", "/arearesponsableprenda", mensaje_area_responsable, info_json);
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
            area_responsable_error(id_prenda, area_retorno);
            prenda.querySelector(".contenedor-areas").value = area_retorno;
            $(`#${modal_id}`).modal('hide')

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
        <a href="https://google.com.co" target="_blank" id="imagen_${id_prenda_nueva}" class="form-control form-control-sm" readonly>URL Imagen</a>
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
    
    <div class="col-12 col-lg-6">
        <select id="caso_produccion_${id_prenda_nueva}" class="form-control form-control-sm contenedor-caso-produccion" onfocus="select_previous(this);" onchange="verificar_casos_produccion(this);">
            <option value="">Seleccionar disponibilidad de material</option>
            <option value="9">Sin material</option>
            <option value="10">Con material</option>
            <option value="1">Caso 1 (Sublimada)</option>
            <option value="2">Caso 2 (Unicolor)</option>
            <option value="3">Caso 3 (Medidas personalizadas)</option>
            <option value="4">Caso 4 (Apliques)</option>
            <option value="5">Caso 5 (Manualidad)</option>
            <option value="6">Caso 6 (Unicolor vinilo)</option>
            <option value="7">Caso 7 (Primero corte)</option>
            <option value="8">Caso 8 (Manualidad con costuras)</option>
        </select>
    </div>

    <div class="col d-none">
        <select class="form-control form-control-sm contenedor-areas" id="area_${id_prenda_nueva}" onchange="area_responsable_prenda(this);">
            <option value="">Área responsable</option>
        </select>
    </div>
    
    <div class="col-12 d-none mt-3 contenedor_estados_produccion">
    
    </div>
    
    <div class="col-12 mt-3">
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary btn-sm cargar_tiempos" id="cargar_tiempos_${id_prenda_nueva}" onclick="cargarTiempos(this);">Cargar tiempos</button>
        </div>
    </div>`;

    div_nueva_prenda.insertAdjacentHTML('beforeend', html_nueva_prenda);
    let div_prendas = document.getElementById("prendas");
    div_prendas.appendChild(div_nueva_prenda);

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

const casos_produccion_modal = (caso, select) => {
    let list_caso = switch_caso(parseInt(caso));
    if (list_caso != "") {

        select.innerHTML = "";

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

    for (let i = 0; i < data["prendas"].length; i++) {

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
        let caso = switch_caso(parseInt(data["prendas"][i]["caso_produccion"]))
        if (caso != "") {
            for (let a = 0; a < caso.length; a++) {
                if (data["prendas"][i]["estados_produccion"][caso[a]] == 1) {
                    document.getElementById(caso[a]+"prenda_"+i).checked=true;
                    document.getElementById(caso[a]+"prenda_"+i).disabled=true;
                }
            }
        }

        
        set_element_value("area_"+i, data["prendas"][i]["area_responsable"]);

    }

    fetchData("GET", "/verificartiempos/"+get_element_value("numerodeorden"), verificar_tiempo_abierto)
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

const buscarOrdenProduccion = () => {
    clearProductionPage();
    let order = get_element_value("input_buscar_orden").trim();
    fetchData("GET", "/getorder/"+order, set_order_informacion);
} // OK

const postDoNothing = (error, data) => {
    if (error) return console.error(error);
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

const select_previous = (clickedElement) => {
    select_previous_value = clickedElement.value;
} // OK

const verificar_casos_produccion = (clickedElement) => {
    if (clickedElement.value == '9' || clickedElement.value == '10') {
        casos_produccion(clickedElement);
    } else {
        alert("El usuario de análisis no puede modificar los casos de producción");
        clickedElement.value = select_previous_value;
    }
} // OK

const casos_produccion = (clickedElement) => {

    let _id = clickedElement.parentElement.parentElement.id; // id del elemento contenedor de la prenda 
    let id_prenda = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
    let contenedor_estados_produccion = document.querySelector("#"+_id+" .contenedor_estados_produccion");
    let caso = switch_caso(parseInt(clickedElement.value));
    let info;
    contenedor_estados_produccion.innerHTML = "";
    
    if (caso != "") {

        info = {
            caso: clickedElement.value,
            id: id_prenda,
            estados: caso,
            area_inicial: caso[0]
        };

        document.querySelector("#"+_id+" .contenedor-areas").innerHTML = "";

        for (let i = 0; i < caso.length; i++) {
            let html_area_produccion = '<option value="'+caso[i]+'">'+area_produccion_bonita(caso[i])+'</option>'
            document.querySelector("#"+_id+" .contenedor-areas").insertAdjacentHTML('beforeend', html_area_produccion);

            let html_caso_produccion = `<div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="`+caso[i]+_id+`" value="`+caso[i]+`">
                <label class="form-check-label" for="`+caso[i]+_id+`">`+area_produccion_bonita(caso[i])+`</label>
            </div>`;

            contenedor_estados_produccion.insertAdjacentHTML('beforeend', html_caso_produccion);

            let checkbox_estado_produccion = document.getElementById(caso[i]+_id);
            checkbox_estado_produccion.addEventListener('click', function() {

                let elemento = this;
                let verification = confirm("Desea marcar como completo "+area_produccion_bonita(elemento.value)+"? Esta acción es irreversible.")
                if (verification) {
                    let area = elemento.value;
                    let _id = elemento.parentElement.parentElement.parentElement.id;
                    let id_prenda_para_estado = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
                    let info = {
                        id_prenda: id_prenda_para_estado,
                        area: area,
                        estado: elemento.checked,
                    };
                    let info_json = JSON.stringify(info);
                    fetchData("POST", "/marcarproduccion", function(error, data) {
                        if (error) return console.error(error);

                        if (data["status"] == "ok") {
                            elemento.disabled = true;
                        }
                    }, info_json)
                } else {
                    elemento.checked = false;
                }
            });

        }
    } else {
        info = {
            caso: clickedElement.value,
            id: id_prenda,
            estados: caso,
            area_inicial: ""
        };
        document.querySelector("#"+_id+" .contenedor-areas").innerHTML = '<option value="">Área responsable</option>';
    }

    let info_json = JSON.stringify(info);
    fetchData("POST", "/casoproduccion", postDoNothing, info_json);

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

const mensaje_area_responsable = (error, data) => {
    if (error) return console.error(error);
    alert(data["message"]);
} // OK

const area_responsable_prenda = (clickedElement) => {
    let _id = clickedElement.parentElement.parentElement.id; // id del elemento contenedor de la prenda 
    let id_prenda = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
    let select_areas = document.querySelector("#"+_id+" .contenedor-areas").value;

    let info = {
        id_prenda: id_prenda, 
        area: select_areas
    }
    let info_json = JSON.stringify(info)

    fetchData("POST", "/arearesponsableprenda", mensaje_area_responsable, info_json);
} // OK

const mensaje_usuario_responsable = (error, data) => {
    if (error) return console.error(error);
    alert(data["message"]);
} // OK

let usuario_responsable_prenda = (clickedElement) => {
    let _id = clickedElement.parentElement.parentElement.parentElement.parentElement.id; // id del elemento contenedor de la prenda 
    let id_prenda = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
    let select_areas = document.querySelector("#"+_id+" .contenedor-areas").value;
    let usuario = document.querySelector("#"+_id+" .contenedor-usuario").value;

    if (usuario != "") {
        let info = {
            id_prenda: id_prenda, 
            usuario: usuario,
            area: select_areas
        };
        let info_json = JSON.stringify(info);

        fetchData("POST", "/usuarioresponsableprenda", mensaje_usuario_responsable, info_json);

    } else {
        alert("Por favor escriba un usuario para asignar");
    }

} // OK

boton_buscar_orden = document.getElementById("boton_buscar_orden");
boton_buscar_orden.addEventListener('click', buscarOrdenProduccion);