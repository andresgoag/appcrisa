var id_prenda_nueva = 1;


let caso1 = ['diseno', 'sublimacion', 'corte', 'confeccion-preparacion', 'confeccion-terminacion', 'calidad', 'empaque'];
let caso2 = ['corte', 'confeccion-preparacion', 'confeccion-terminacion', 'calidad', 'empaque'];
let caso3 = ['corte', 'diseno', 'sublimacion', 'confeccion-preparacion', 'confeccion-terminacion', 'calidad', 'empaque'];
let caso4 = ['diseno', 'sublimacion', 'confeccion-terminacion', 'calidad', 'empaque'];
let caso5 = ['empaque'];



function addPrendaProduccion() {
    
    id_prenda_nueva += 1;

    var div_nueva_prenda = document.createElement("div");

    div_nueva_prenda.setAttribute("class", "my-2 form-row form-group prenda p-2 border");

    div_nueva_prenda.setAttribute("id", "prenda_"+id_prenda_nueva)

    html_prenda = '<div style="display: none;"><input type="text" class="id_input" id="id_'+id_prenda_nueva+'" value=""></div><div class="col-12 col-lg-2"><input type="text" class="form-control form-control-sm" placeholder="Tipo de prenda" id="tipo_'+id_prenda_nueva+'" readonly></div><div class="col-12 col-lg-2"><input type="text" class="form-control form-control-sm subtipo" placeholder="Subtipo" id="subtipo_'+id_prenda_nueva+'" readonly></div><div class="col-12 col-lg-2"><input type="text" class="form-control form-control-sm" placeholder="Género" id="genero_'+id_prenda_nueva+'" readonly></div><div class="col-12 col-lg-2"><input type="text" class="form-control form-control-sm" placeholder="Talla" id="talla_'+id_prenda_nueva+'" readonly></div><div class="col-12 col-lg-2"><a href="https://google.com.co" target="_blank" id="imagen_'+id_prenda_nueva+'" class="form-control form-control-sm" readonly>URL Imagen</a></div><div class="col-12 col-lg-2"><input type="number" id="cantidad_'+id_prenda_nueva+'" placeholder="Cantidad" class="form-control form-control-sm cantidad" readonly></div><div class="col-12 col-lg-6"><input type="text" id="especificacion_'+id_prenda_nueva+'" placeholder="Especificación del producto" class="form-control form-control-sm"></div><div class="col-12 col-lg-2"><select id="caso_produccion_'+id_prenda_nueva+'" class="form-control form-control-sm" onchange="casos_produccion(this);"><option value="">Seleccionar proceso</option><option value="1">Caso 1 (Sublimada)</option><option value="2">Caso 2 (Unicolor)</option><option value="3">Caso 3 (Medidas personalizadas)</option><option value="4">Caso 4 (Apliques)</option><option value="5">Caso 5 (Manualidad)</option></select></div><div class="col-12 col-lg-2"><select class="form-control form-control-sm contenedor-areas" id="area_'+id_prenda_nueva+'" onchange="area_responsable_prenda(this);" disabled><option value="">Área responsable</option></select></div><div class="col-12 col-lg-2"><div class="input-group"><input type="text" id="usuario_'+id_prenda_nueva+'" placeholder="Usuario responsable" class="form-control form-control-sm contenedor-usuario" disabled><div class="input-group-append"><button class="btn btn-primary btn-sm" type="button" name="button" onclick="usuario_responsable_prenda(this);"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/></svg></button></div></div></div><div class="col-12 mt-3 d-flex flex-wrap justify-content-around contenedor_estados_produccion"></div><div class="col-12 mt-3"><div class="d-flex justify-content-center"><button class="btn btn-primary btn-sm cargar_tiempos" id="cargar_tiempos_'+id_prenda_nueva+'" onclick="cargarTiempos(this);">Cargar tiempos</button></div></div>'

    div_nueva_prenda.insertAdjacentHTML('beforeend', html_prenda);

    var div_prendas = document.getElementById("prendas");
    div_prendas.appendChild(div_nueva_prenda);
}



function buscarOrdenProduccion() {
    order = document.getElementById("input_buscar_orden").value;

    clearProductionPage();

    var request = new XMLHttpRequest();
    request.open("GET", "/getorder/"+order);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var data = JSON.parse(request.responseText);

            document.getElementById("numerodeorden").value = data["numero_orden"]
            let marca = data["marca"]
            let marcaCapitalized = marca.charAt(0).toUpperCase() + marca.slice(1)
            document.getElementById("marcaorden").value = marcaCapitalized
            document.getElementById("estado_orden").value = data["estado_orden"]

            for (let i = 0; i < data["prendas"].length; i++) {
                
                if (i == 0) {
                    document.getElementById("id_1").value = data["prendas"][i]["id"];
                    document.getElementById("tipo_1").value = data["prendas"][i]["tipo"];
                    document.getElementById("subtipo_1").value = data["prendas"][i]["subtipo"];
                    document.getElementById("genero_1").value = data["prendas"][i]["genero"];
                    document.getElementById("talla_1").value = data["prendas"][i]["talla"].toUpperCase();
                    document.getElementById("imagen_1").setAttribute('href', data["prendas"][i]["imagen"]);
                    document.getElementById("cantidad_1").value = data["prendas"][i]["cantidad"];
                    document.getElementById("especificacion_1").value = data["prendas"][i]["especificacion"];
                    document.getElementById("cargar_tiempos_1").disabled = false;
                    document.getElementById("caso_produccion_1").disabled = false;
                    document.getElementById("caso_produccion_1").value = data["prendas"][i]["caso_produccion"];

                    casos_produccion(document.getElementById("caso_produccion_1"))
                    
                    if (data["prendas"][i]["caso_produccion"] == '1') {
                        var caso_ll = caso1;
                    } else if (data["prendas"][i]["caso_produccion"] == '2') {
                        var caso_ll = caso2;
                    } else if (data["prendas"][i]["caso_produccion"] == '3') {
                        var caso_ll = caso3;
                    } else if (data["prendas"][i]["caso_produccion"] == '4') {
                        var caso_ll = caso4;
                    } else if (data["prendas"][i]["caso_produccion"] == '5') {
                        var caso_ll = caso5;
                    } else {
                        var caso_ll = "";
                    }

                    if (caso_ll != "") {
                        for (let a = 0; a < caso_ll.length; a++) {
                            if (data["prendas"][i]["estados_produccion"][caso_ll[a]] == 1) {
                                document.getElementById(caso_ll[a]+"prenda_1").checked=true;
                                document.getElementById(caso_ll[a]+"prenda_1").disabled=true;
                            }
                        }
                    }

                    document.getElementById("usuario_1").disabled = false;
                    document.getElementById("usuario_1").value = data["prendas"][i]["usuario_responsable"];
                    document.getElementById("area_1").disabled = false;
                    document.getElementById("area_1").value = data["prendas"][i]["area_responsable"]

                    
                } else {
                    addPrendaProduccion();
                    document.getElementById("id_"+id_prenda_nueva).value = data["prendas"][i]["id"];
                    document.getElementById("tipo_"+id_prenda_nueva).value = data["prendas"][i]["tipo"];
                    document.getElementById("subtipo_"+id_prenda_nueva).value = data["prendas"][i]["subtipo"];
                    document.getElementById("genero_"+id_prenda_nueva).value = data["prendas"][i]["genero"];
                    document.getElementById("talla_"+id_prenda_nueva).value = data["prendas"][i]["talla"].toUpperCase();
                    document.getElementById("imagen_"+id_prenda_nueva).setAttribute('href', data["prendas"][i]["imagen"]);
                    document.getElementById("cantidad_"+id_prenda_nueva).value = data["prendas"][i]["cantidad"];
                    document.getElementById("especificacion_"+id_prenda_nueva).value = data["prendas"][i]["especificacion"];
                    document.getElementById("caso_produccion_"+id_prenda_nueva).value = data["prendas"][i]["caso_produccion"];

                    casos_produccion(document.getElementById("caso_produccion_"+id_prenda_nueva))
                    
                    if (data["prendas"][i]["caso_produccion"] == '1') {
                        var caso_ll = caso1;
                    } else if (data["prendas"][i]["caso_produccion"] == '2') {
                        var caso_ll = caso2;
                    } else if (data["prendas"][i]["caso_produccion"] == '3') {
                        var caso_ll = caso3;
                    } else if (data["prendas"][i]["caso_produccion"] == '4') {
                        var caso_ll = caso4;
                    } else if (data["prendas"][i]["caso_produccion"] == '5') {
                        var caso_ll = caso5;
                    } else {
                        var caso_ll = "";
                    }

                    if (caso_ll != "") {
                        for (let a = 0; a < caso_ll.length; a++) {
                            if (data["prendas"][i]["estados_produccion"][caso_ll[a]] == 1) {
                                document.getElementById(caso_ll[a]+"prenda_"+id_prenda_nueva).checked=true;
                                document.getElementById(caso_ll[a]+"prenda_"+id_prenda_nueva).disabled=true;
                            }
                        }
                    }

                    document.getElementById("usuario_"+id_prenda_nueva).disabled = false;
                    document.getElementById("usuario_"+id_prenda_nueva).value = data["prendas"][i]["usuario_responsable"];
                    document.getElementById("area_"+id_prenda_nueva).disabled = false;
                    document.getElementById("area_"+id_prenda_nueva).value = data["prendas"][i]["area_responsable"]

                }

            }

            let request_verificar_tiempo = new XMLHttpRequest();
            request_verificar_tiempo.open("GET", "/verificartiempos/"+order);
            request_verificar_tiempo.onreadystatechange = function() {
                if (request_verificar_tiempo.readyState === 4 && request_verificar_tiempo.status === 200) {
                    let data_verificar_tiempo = JSON.parse(request_verificar_tiempo.responseText);
                    let tiempos_abiertos = data_verificar_tiempo["tiempos_abiertos"];
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
                }
            }
            request_verificar_tiempo.send();

        } else if (request.readyState === 4 && request.status === 400) {
            var data = JSON.parse(request.responseText);
            document.getElementById("input_buscar_orden").value = data["message"]
        }
    }

    request.send();
}

boton_buscar_orden = document.getElementById("boton_buscar_orden");
boton_buscar_orden.addEventListener('click', buscarOrdenProduccion);

function clearProductionPage() {
    document.getElementById("numerodeorden").value = "";
    document.getElementById("id_1").value = "";
    document.getElementById("tipo_1").value = "";
    document.getElementById("subtipo_1").value = "";
    document.getElementById("genero_1").value = "";
    document.getElementById("talla_1").value = "";
    document.getElementById("imagen_1").setAttribute('href', "#");
    document.getElementById("cantidad_1").value = "";
    document.getElementById("especificacion_1").value = "";
    
    prendas = document.querySelectorAll(".prenda");
    if (prendas.length > 0) {
        for (let i = 0; i < prendas.length; i++) {
            prendas[i].remove();
        }
    }

}

function cargarTiempos(clickedElement) {
    let orden = document.getElementById('numerodeorden').value;
    let _id = clickedElement.parentElement.parentElement.parentElement.id;
    let id_prenda = document.querySelector("#"+_id+" .id_input").value;
    let area_produccion = document.querySelector("li .active").textContent;
    

    let info = {id_prenda: id_prenda, area_produccion: area_produccion};
    let info_json = JSON.stringify(info);

    let request = new XMLHttpRequest();
    request.open("POST", "/tiempos");
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            let data = JSON.parse(request.responseText);
            if (data["final"] === ""){
                document.querySelector("#"+_id+" .cargar_tiempos").classList.remove("btn-primary");
                document.querySelector("#"+_id+" .cargar_tiempos").classList.add("btn-success");
                document.querySelector("#"+_id+" .cargar_tiempos").textContent = "Detener Tiempo"
            } else {
                document.querySelector("#"+_id+" .cargar_tiempos").classList.remove("btn-success");
                document.querySelector("#"+_id+" .cargar_tiempos").classList.add("btn-primary");
                document.querySelector("#"+_id+" .cargar_tiempos").textContent = "Cargar tiempos"
            }
        }
    }

    request.send(info_json);
}


let casos_produccion = (clickedElement) => {

    let _id = clickedElement.parentElement.parentElement.id; // id del elemento contenedor de la prenda 
    let id_prenda = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
    let contenedor_estados_produccion = document.querySelector("#"+_id+" .contenedor_estados_produccion");
    if (clickedElement.value == '1') {
        var caso = caso1;
    } else if (clickedElement.value == '2') {
        var caso = caso2;
    } else if (clickedElement.value == '3') {
        var caso = caso3;
    } else if (clickedElement.value == '4') {
        var caso = caso4;
    } else if (clickedElement.value == '5') {
        var caso = caso5;
    } else {
        var caso = "";
    }

    let info = {caso: clickedElement.value, id:id_prenda, estados:caso, area_inicial: caso[0]};
    var info_json = JSON.stringify(info);

    var request = new XMLHttpRequest();
    request.open("POST", "/casoproduccion");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(info_json);

    contenedor_estados_produccion.innerHTML = "";
    
    if (caso != "") {

        html_caso_produccion = '';
        document.querySelector("#"+_id+" .contenedor-areas").innerHTML = "";

        for (let i = 0; i < caso.length; i++) {

            let html_area_produccion = '<option value="'+caso[i]+'">'+verificar_area_produccion(caso[i])+'</option>'
            document.querySelector("#"+_id+" .contenedor-areas").insertAdjacentHTML('beforeend', html_area_produccion);

            html_caso_produccion = '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+caso[i]+_id+'" value="'+caso[i]+'"><label class="form-check-label" for="'+caso[i]+_id+'">'+verificar_area_produccion(caso[i])+'</label></div>';
            contenedor_estados_produccion.insertAdjacentHTML('beforeend', html_caso_produccion);

            var checkbox_estado_produccion = document.getElementById(caso[i]+_id);
            checkbox_estado_produccion.addEventListener('click', function(){

                let verification = confirm("Desea marcar como completo "+verificar_area_produccion(this.value)+"? Esta acción es irreversible.")

                if (verification) {
                    area = this.value;
                    _id = this.parentElement.parentElement.parentElement.id;
                    id_prenda_para_estado = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
    
                    info = {
                        id_prenda:id_prenda_para_estado,
                        area:area,
                        estado:this.checked,
                    }
    
                    var info_json = JSON.stringify(info);
    
                    var request = new XMLHttpRequest();
                    request.open("POST", "/marcarproduccion");
                    request.setRequestHeader("Content-Type", "application/json");
    
                    let deshabilitar_estado = () => {
                        if (request.readyState === 4 && request.status === 200) {
                            var data = JSON.parse(request.responseText);
                            if (data["status"] == "ok") {
                                this.disabled = true;
                            }
                        }
                    }
                    request.onreadystatechange = deshabilitar_estado;
                    request.send(info_json);
                } else {
                    this.checked = false;
                }

            })
        }
    } else {
        document.querySelector("#"+_id+" .contenedor-areas").innerHTML = '<option value="">Área responsable</option>';
    }
}


let verificar_area_produccion = (area) => {
    if (area == 'diseno') {
        area_bonita = "Diseño";
    } else if (area == 'sublimacion') {
        area_bonita = "Sublimación";
    } else if (area == 'corte') {
        area_bonita = "Corte";
    } else if (area == 'confeccion-preparacion') {
        area_bonita = "Confección-preparación";
    } else if (area == 'confeccion-terminacion') {
        area_bonita = "Confección-terminación";
    } else if (area == 'calidad') {
        area_bonita = "Calidad";
    } else if (area == 'empaque') {
        area_bonita = "Empaque";
    }

    return area_bonita;
}



let area_responsable_prenda = (clickedElement) => {
    let _id = clickedElement.parentElement.parentElement.id; // id del elemento contenedor de la prenda 
    let id_prenda = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
    let select_areas = document.querySelector("#"+_id+" .contenedor-areas").value;

    let info = {id_prenda:id_prenda, area:select_areas}
    info_json = JSON.stringify(info)

    let request = new XMLHttpRequest();
    request.open("POST", "/arearesponsableprenda");
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            let data = JSON.parse(request.responseText)
            alert(data["message"]);
        }
    }
    request.send(info_json);
}



let usuario_responsable_prenda = (clickedElement) => {
    let _id = clickedElement.parentElement.parentElement.parentElement.parentElement.id; // id del elemento contenedor de la prenda 
    let id_prenda = document.querySelector("#"+_id+" .id_input").value; // id de base de datos de la prenda
    let usuario = document.querySelector("#"+_id+" .contenedor-usuario").value;

    if (usuario != "") {
        let info = {id_prenda:id_prenda, usuario:usuario}
        info_json = JSON.stringify(info)

        let request = new XMLHttpRequest();
        request.open("POST", "/usuarioresponsableprenda");
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                let data = JSON.parse(request.responseText)
                alert(data["message"]);
            }
        }
        request.send(info_json);

    } else {
        alert("Por favor escriba un usuario para asignar");
    }

}