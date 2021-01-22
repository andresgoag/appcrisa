let id_prenda = 1;


function addPrenda() {

    id_prenda += 1

    console.log(id_prenda);

    let div_nueva_prenda = document.createElement("div");

    div_nueva_prenda.setAttribute("class", "mt-3 form-row form-group prenda");

    div_nueva_prenda.setAttribute("id", "prenda_"+id_prenda)

    html_prenda = `<div style="display: none;">
            <input type="text" class="id_input" name="id_${id_prenda}" id="id_${id_prenda}" value="">
        </div>

        <div class="col-12 col-lg-11">
            <input type="text" name="especificacion_${id_prenda}" id="especificacion_${id_prenda}" placeholder="Especificación del producto" class="form-control form-control-sm">
        </div>
        
        <div class="col-12 col-lg-1">
            <button class="btn btn-danger btn-block btn-sm" type="button" id="remover_${id_prenda}">-</button>
        </div>`;

    div_nueva_prenda.insertAdjacentHTML('beforeend', html_prenda);

    let div_prendas = document.getElementById("prendas");
    div_prendas.appendChild(div_nueva_prenda);

    let boton_remover = document.getElementById('remover_'+id_prenda)
    boton_remover.addEventListener('click', function(){

        let id_prenda_borrar = document.querySelector("#"+boton_remover.parentElement.parentElement.parentElement.id+" .id_input").value
        if(id_prenda_borrar !== "") {
            let request = new XMLHttpRequest();
            request.open("DELETE", "/borrarprenda/"+id_prenda_borrar);
            request.onreadystatechange = function() {
                if (request.readyState === 4 && request.status === 200) {
                    let data = JSON.parse(request.responseText);
                    console.log(data["message"]);
                }
            }
    
            request.send();
        }
        
        boton_remover.parentElement.parentElement.remove()
        id_prenda = id_prenda-1

    })

}

function crearNumeroOrden() {
    clearOrderPage();
    let request = new XMLHttpRequest();
    request.open("GET", "/crearnumerodeorden");
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            let data = JSON.parse(request.responseText);
            document.getElementById("numerodeorden").value = data["numero_orden"];
            document.getElementById("boton_submit").disabled = false;
        }
    }

    request.send();
}

function buscarOrdenVentas() {
    order = document.getElementById("input_buscar_orden").value.trim();

    clearOrderPage();

    let request = new XMLHttpRequest();
    request.open("GET", "/getorder/"+order);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            let data = JSON.parse(request.responseText);

            document.getElementById("numerodeorden").value = data["numero_orden"]
            document.getElementById("estado_orden").value = data["estado_orden"]

            for (let i = 0; i < data["prendas"].length; i++) {
                
                if (i == 0) {
                    document.getElementById("id_1").value = data["prendas"][i]["id"];
                    document.getElementById("especificacion_1").value = data["prendas"][i]["especificacion"];
                } else {
                    addPrenda();
                    document.getElementById("id_"+id_prenda).value = data["prendas"][i]["id"];
                    document.getElementById("especificacion_"+id_prenda).value = data["prendas"][i]["especificacion"];
                }
            }

            document.getElementById("comentario").value = data["comentarios"];
            document.getElementById("boton_submit").disabled = false;

        } else if (request.readyState === 4 && request.status === 400) {
            let data = JSON.parse(request.responseText);
            document.getElementById("input_buscar_orden").value = data["message"]
        }
    }

    request.send();
}

const clearOrderPage = () => {
    document.getElementById("numerodeorden").value = "";
    document.getElementById("id_1").value = "";

    prendas = document.querySelectorAll(".prenda");
    if (prendas.length > 0) {
        for (let i = 0; i < prendas.length; i++) {
            prendas[i].remove();
        }
    }

    document.getElementById("comentario").value = "";
    document.getElementById("boton_submit").disabled = true;
}


let boton_buscar_orden = document.getElementById("boton_buscar_orden");
boton_buscar_orden.addEventListener('click', buscarOrdenVentas);

let boton_crear_orden = document.getElementById("boton_crear_orden");
boton_crear_orden.addEventListener('click', crearNumeroOrden);