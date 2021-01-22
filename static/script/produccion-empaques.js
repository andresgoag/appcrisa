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
        caso = ['diseno', 'sublimacion', 'corte', 'confeccion-preparacion', 'confeccion-terminacion', 'calidad', 'empaque']; // Sublimada
        break;
    case 2:
        caso = ['corte', 'confeccion-preparacion', 'confeccion-terminacion', 'calidad', 'empaque']; // Unicolor
        break;

    case 3:
        caso = ['corte', 'diseno', 'sublimacion', 'confeccion-preparacion', 'confeccion-terminacion', 'calidad', 'empaque']; // Medidas personalizadas
        break;

    case 4:
        caso = ['diseno', 'sublimacion', 'confeccion-terminacion', 'calidad', 'empaque']; // Apliques
        break;

    case 5:
        caso = ['empaque']; // Manualidad
        break;

    case 6:
        caso = ['corte', 'preparacion', 'terminacion', 'diseno', 'sublimacion', 'calidad', 'empaque']; // Unicolor vinilo
        break;

    case 7:
        caso = ['corte', 'diseno', 'sublimacion', 'preparacion', 'terminacion', 'calidad', 'empaque']; // Primero corte
        break;

    case 8:
        caso = ['empaque', 'terminacion', 'calidad', 'empaque']; // Manualidad con costuras
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

const empacado = (evento) => {
    let prenda = evento.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    let prenda_id = prenda.querySelector(".id_input").value;

    let info = {
        prenda_id:prenda_id,
        estado:evento.target.checked
    };

    let info_json = JSON.stringify(info);

    fetchData("POST", "/marcarempaque", (error, data) => {
        if (error) return console.error(error);
        alert(data['message'])
    }, info_json);

} // ok

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
        <select class="form-control form-control-sm contenedor-areas" id="area_${id_prenda_nueva}" onchange="area_responsable_prenda(this);" disabled>
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
    
    <div class="col-12 mt-3 d-none contenedor_estados_produccion">
    
    </div>
    
    <div class="col-12 mt-3">
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary btn-sm cargar_tiempos" id="cargar_tiempos_${id_prenda_nueva}" onclick="cargarTiempos(this);">Cargar tiempos</button>
            <div class="d-flex align-items-center px-3">
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" name="empacado_${id_prenda_nueva}" id="empacado_${id_prenda_nueva}">
                    <label class="custom-control-label" for="empacado_${id_prenda_nueva}">Empacado</label>
                </div>
            </div>
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

    document.getElementById(`empacado_${id_prenda_nueva}`).addEventListener('click', empacado);
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
    set_element_value("opcion_envio", data["opcion_envio"]);
    set_element_value("empresa_envio", data["empresa_envio"]);
    set_element_value("guia_envio", data["guia_envio"]);
    set_element_value("cliente_categoria", data["cliente"]["tipo"]);
    set_element_value("cliente_nombre", data["cliente"]["nombre"]);
    set_element_value("cliente_correo", data["cliente"]["correo"]);
    set_element_value("cliente_tipodoc", data["cliente"]["tipodoc"]);
    set_element_value("cliente_cedula", data["cliente"]["cedula"]);
    set_element_value("cliente_telefono", data["cliente"]["telefono"]);
    set_element_value("cliente_direccion", data["cliente"]["direccion"]);
    set_element_value("cliente_barrio", data["cliente"]["barrio"]);
    set_element_value("cliente_ciudad", data["cliente"]["ciudad"]);
    set_element_value("cliente_departamento", data["cliente"]["departamento"]);
    set_element_value("cliente_pais", data["cliente"]["pais"]);





    if (data["pagado"] == "si") {
        document.getElementById("pagado").checked = true;
    } else {
        document.getElementById("pagado").checked = false;
    }

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

        set_element_value("usuario_"+i, data["prendas"][i]["usuario_responsable"]);
        set_element_value("area_"+i, data["prendas"][i]["area_responsable"]);
        casos_produccion_modal(data["prendas"][i]["caso_produccion"], document.getElementById(`caso_produccion_error_${i}`));

        if (data["prendas"][i]["empacado"] == "si") {
            document.getElementById(`empacado_${i}`).checked = true;
        }
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

        case 'sublimacion':
            return "Sublimación";

        case 'corte':
            return "Corte";

        case 'confeccion-preparacion':
            return "Confección-preparación";

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
        document.querySelector("#"+_id+" .contenedor-areas").insertAdjacentHTML('beforeend', '<option value="planeacion">Planeación</option>');

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