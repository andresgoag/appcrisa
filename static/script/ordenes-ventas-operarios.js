let id_prenda = 1;

let tipos_prendas = {
    falda:[
        "Prensada",
        "Ajustada",
        "Rotonda",
        "Short",
        "Overol"
    ],
    pantalon:[
        "Sencillo",
        "Cargo",
        "Sudadera",
        "Camuflado",
        "Overol"
    ],
    short:[
        "Sencillo",
        "Cargo",
        "Overol",
        "Pantaloneta",
        "Bermuda"
    ],
    buzo:[
        "Sencillo",
        "Capota + bolsillos laterales",
        "Capota + bolsillo canguro",
        "Capota + bolsillos laterales + cremallera",
        "Capota + bolsillo canguro + cremallera"
    ],
    camibuzo:[
        "Cuello redondo",
        "Cuello tortuga",
        "Cuello bandeja",
        "Croptop cuello redondo",
        "Croptop cuello tortuga",
        "Croptop cuello bandeja",
        "Oversize",
        "Cremallera yaro"
    ],
    camiseta:[
        "Sencilla",
        "Oversize",
        "Cuello peter pan",
    ],
    croptop:[
        "Straple",
        "Campesino",
        "Esqueleto",
        "De tiritas"
    ],
    camisilla:[
        "Tipo Único"
    ],
    camisa:[
        "Manga corta + cuello normal",
        "Manga corta + cuello sport",
        "Manga larga + cuello normal",
        "Manga larga + cuello sport",
        "Sin mangas"
    ],
    vestido:[
        "Cuello peter pan",
        "Ajustado de tiras",
        "Semitransparente"
    ],
    correa:[
        "Tipo único"
    ],
    medias:[
        "Bucaneras",
        "Media caña",
        "Malla",
        "Tobilleras"
    ],
    gorro:[
        "Pesqueros",
        "Lana"
    ],
    gafas:[
        "Tipo Único"
    ],
    tapabocas:[
        "Tipo Único"
    ],
    arnes:[
        "Tipo Único"
    ],
    panoleta:[
        "Tipo Único"
    ],
    cobija:[
        "Tipo Único"
    ],
    panties:[
        "Tipo Único"
    ],
    dakimakuras:[
        "Tipo Único"
    ],
    Kimono:[
        "Tipo Único"
    ]
}

function addPrenda() {

    id_prenda += 1

    console.log(id_prenda);

    let div_nueva_prenda = document.createElement("div");

    div_nueva_prenda.setAttribute("class", "mt-3 form-row form-group prenda");

    div_nueva_prenda.setAttribute("id", "prenda_"+id_prenda)

    html_prenda = `<div style="display: none;">
            <input type="text" class="id_input" name="id_${id_prenda}" id="id_${id_prenda}" value="">
        </div>
        
        <div class="col-12 col-lg-2">
            <select class="form-control form-control-sm" name="tipo_${id_prenda}" id="tipo_${id_prenda}" onchange="selectSubtipo(this);" required>
                <option value="">Tipo de prenda</option>
                <option value="falda">Falda</option>
                <option value="pantalon">Pantalón</option>
                <option value="short">Short</option>
                <option value="buzo">Buzo</option>
                <option value="camibuzo">Camibuzo</option>
                <option value="camiseta">Camiseta</option>
                <option value="croptop">Croptop</option>
                <option value="camisilla">Camisilla</option>
                <option value="camisa">Camisa de Botones</option>
                <option value="vestido">Vestido</option>
                <option value="correa">Correa</option>
                <option value="medias">Medias</option>
                <option value="gorro">Gorro</option>
                <option value="gafas">Gafas</option>
                <option value="tapabocas">Tapabocas</option>
                <option value="arnes">Arnés</option>
                <option value="panoleta">Pañoleta</option>
                <option value="cobija">Cobija</option>
                <option value="panties">Panties</option>
                <option value="dakimakuras">Dakimakuras</option>
                <option value="kimono">Kimono</option>
            </select>
        </div>
        
        <div class="col-12 col-lg-2">
            <select class="form-control form-control-sm subtipo" name="subtipo_${id_prenda}" id="subtipo_${id_prenda}" disabled required>
                <option value="">Subtipo</option>
            </select>
        </div>
        
        <div class="col-12 col-lg-2">
            <select class="form-control form-control-sm" name="genero_${id_prenda}" id="genero_${id_prenda}" required>
                <option value="">Género</option>
                <option value="unisex">Unisex</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
            </select>
        </div>
        
        <div class="col-12 col-lg-2">
            <select class="form-control form-control-sm" name="talla_${id_prenda}" id="talla_${id_prenda}" required>
                <option value="">Talla</option>
                <option value="talla_unica">Talla única</option>
                <option value="junio">Junior</option>
                <option value="xs">XS</option>
                <option value="s">S</option>
                <option value="m">M</option>
                <option value="l">L</option>
                <option value="xl">XL</option>
                <option value="xxl">XXL</option>
                <option value="xxxl">XXXL</option>
            </select>
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="text" name="imagen_${id_prenda}" id="imagen_${id_prenda}" placeholder="URL Imagen" class="form-control form-control-sm">
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="number" name="precio_${id_prenda}" id="precio_${id_prenda}" placeholder="Precio Unitario" class="form-control form-control-sm precio" oninput="precioTotal(); sumCantidades();" required>
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="number" name="cantidad_${id_prenda}" id="cantidad_${id_prenda}" placeholder="Cantidad" class="form-control form-control-sm cantidad" oninput="precioTotal(); sumCantidades();" required>
        </div>
        
        <div class="col-12 col-lg-10">
            <div class="input-group">
                <input type="text" name="especificacion_${id_prenda}" id="especificacion_${id_prenda}" placeholder="Especificación del producto" class="form-control form-control-sm">
                <button class="btn btn-danger btn-sm" type="button" id="remover_${id_prenda}">-</button>
            </div>
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
        
        boton_remover.parentElement.parentElement.parentElement.remove()
        id_prenda = id_prenda-1
        sumCantidades();
        precioTotal();
    })

}

function sumCantidades() {

    let resultado = 0
    let cantidades = document.getElementsByClassName("cantidad")

    for (let i = 0; i < cantidades.length; i++) {
        let x = cantidades[i].value
        if (x == ""){
           x = 0;
        }
        resultado = resultado + parseInt(x)
    }

    if (!isNaN(resultado)) {
        if (resultado == 0) {
            document.getElementById('numero_de_prendas').value = "";
        } else {
            document.getElementById('numero_de_prendas').value = resultado;
        }
    }
}

function selectSubtipo(clickedElement) {

    let select_subtipo = document.querySelector("#"+clickedElement.parentElement.parentElement.id+" .subtipo")

    if (clickedElement.value != "") {

        select_subtipo.disabled = false;
        
        for (let i = select_subtipo.length-1; i >= 0 ; i--) {
            select_subtipo.remove(i);
        }

        let html_str = ''
        for (let i = 0; i < tipos_prendas[clickedElement.value].length; i++) {
            html_str = html_str + '<option value="'+tipos_prendas[clickedElement.value][i].toLowerCase()+'">'+tipos_prendas[clickedElement.value][i]+'</option>';
        }

        select_subtipo.insertAdjacentHTML('beforeend', html_str) 

    } else {
        select_subtipo.disabled = true;
    }
    
}

function habilitarEnvio() {

    checkbox_envio = document.getElementById("habilitar_envio")
    campos_envio = document.getElementsByClassName('form-envio');

    if (checkbox_envio.checked == true) {
        for (let i = 0; i < campos_envio.length; i++) {
            campos_envio[i].disabled = false;
            precioTotal();
        }
    } else {
        for (let i = 0; i < campos_envio.length; i++) {
            campos_envio[i].disabled = true;
            document.getElementById('precio_envio').value = "";
            precioTotal();
        }
    }
}

function precioTotal() {

    let resultado = 0
    let precios = document.getElementsByClassName("precio")

    for (let i = 0; i < precios.length; i++) {
        let precio = precios[i].value;
        if (precio == ""){
           precio = 0;
        }

        let cantidad = precios[i].parentElement.parentElement.querySelector(".cantidad").value;
        if (cantidad == ""){
            cantidad = 0;
        }

        resultado = resultado + (parseInt(precio)*parseInt(cantidad));
    }

    let precio_envio = document.getElementById('precio_envio').value;
    if(precio_envio == ""){
        precio_envio = 0;
    }

    resultado = resultado + parseInt(precio_envio);

    if (!isNaN(resultado)) {
        if (resultado == 0) {
            document.getElementById('precio_total').value = "";
        } else {
            document.getElementById('precio_total').value = resultado;
        }
    }

}

function buscarCliente(){
    cedula = document.getElementById("cliente_cedula").value;

    let request = new XMLHttpRequest();
    request.open("GET", "/getuser/"+cedula);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            let data = JSON.parse(request.responseText);
            document.getElementById("cliente_categoria").value = data["tipo"];
            document.getElementById("cliente_nombre").value = data["nombre"];
            document.getElementById("cliente_correo").value = data["correo"];
            document.getElementById("cliente_tipodoc").value = data["tipodoc"];
            document.getElementById("cliente_cedula").value = data["cedula"];
            document.getElementById("cliente_telefono").value = data["telefono"];
            document.getElementById("cliente_direccion").value = data["direccion"];
            document.getElementById("cliente_barrio").value = data["barrio"];
            document.getElementById("cliente_ciudad").value = data["ciudad"];
            document.getElementById("cliente_departamento").value = data["departamento"];
            document.getElementById("cliente_pais").value = data["pais"];
            document.getElementById("cliente_postal").value = data["codigo_postal"];
        } else if (request.readyState === 4 && request.status === 400) {
            let data = JSON.parse(request.responseText);
            document.getElementById("cliente_cedula").value = data["message"];
        }
    }

    request.send();

}

let boton_buscar_cliente = document.getElementById("boton_buscar_cliente");
boton_buscar_cliente.addEventListener('click', buscarCliente);

function crearNumeroOrden() {
    clearOrderPage();
    id_prenda = 0;
    document.getElementById("anadir-prenda").disabled = false;
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

let boton_crear_orden = document.getElementById("boton_crear_orden");
boton_crear_orden.addEventListener('click', crearNumeroOrden);

function buscarOrdenVentas() {

    order = document.getElementById("input_buscar_orden").value.trim();

    clearOrderPage();

    id_prenda = 1;

    let request = new XMLHttpRequest();
    request.open("GET", "/getorder/"+order);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            let data = JSON.parse(request.responseText);

            document.getElementById("numerodeorden").value = data["numero_orden"]
            document.getElementById("estado_orden").value = data["estado_orden"]

            if (data['prioritaria'] == 'si') {
                document.getElementById("prioritaria").checked = true;
            }


            for (let i = 0; i < data["prendas"].length; i++) {
                
                addPrendaLectura();
                document.getElementById("id_"+id_prenda).value = data["prendas"][i]["id"];
                document.getElementById("tipo_"+id_prenda).value = data["prendas"][i]["tipo"];
                selectSubtipo(document.getElementById("tipo_"+id_prenda));
                document.getElementById("subtipo_"+id_prenda).value = data["prendas"][i]["subtipo"];
                document.getElementById("genero_"+id_prenda).value = data["prendas"][i]["genero"];
                document.getElementById("talla_"+id_prenda).value = data["prendas"][i]["talla"];
                document.getElementById("imagen_"+id_prenda).value = data["prendas"][i]["imagen"];
                document.getElementById("precio_"+id_prenda).value = data["prendas"][i]["precio"];
                document.getElementById("cantidad_"+id_prenda).value = data["prendas"][i]["cantidad"];
                document.getElementById("especificacion_"+id_prenda).value = data["prendas"][i]["especificacion"];
                id_prenda += 1;
                
            }

            document.getElementById("anadir-prenda").disabled = true;

            document.getElementById("opcion_envio").value = data["opcion_envio"]

            if (data["incluir_envio"] === "si") {
                document.getElementById("habilitar_envio").checked = true;
                habilitarEnvio();
                document.getElementById("empresa_envio").value = data["empresa_envio"]
                document.getElementById("precio_envio").value = data["precio_envio"]
                document.getElementById("guia_envio").value = data["guia_envio"]
            }

            document.getElementById("abono").value = data["abono"]
            document.getElementById("precio_total").value = data["precio_total"]
            abono();
            document.getElementById("marca").value = data["marca"]
            document.getElementById("medio_compra").value = data["medio_compra"]
            document.getElementById("tiempo_estimado").value = data['tiempo_estimado']
            document.getElementById("forma_pago").value = data["forma_pago"]

            if (data["pagado"] === "si") {
                document.getElementById("pagado").checked = true;
            }

            document.getElementById("cliente_categoria").value = data["cliente"]["tipo"]
            document.getElementById("cliente_nombre").value = data["cliente"]["nombre"]
            document.getElementById("cliente_correo").value = data["cliente"]["correo"];
            document.getElementById("cliente_tipodoc").value = data["cliente"]["tipodoc"];
            document.getElementById("cliente_cedula").value = data["cliente"]["cedula"]
            document.getElementById("cliente_telefono").value = data["cliente"]["telefono"]
            document.getElementById("cliente_direccion").value = data["cliente"]["direccion"]
            document.getElementById("cliente_barrio").value = data["cliente"]["barrio"];
            document.getElementById("cliente_ciudad").value = data["cliente"]["ciudad"]
            document.getElementById("cliente_departamento").value = data["cliente"]["departamento"]
            document.getElementById("cliente_pais").value = data["cliente"]["pais"];
            document.getElementById("cliente_postal").value = data["cliente"]["codigo_postal"]

            document.getElementById("comentario").value = data["comentarios"];
            document.getElementById("boton_submit").disabled = false;

            sumCantidades();
            precioTotal();


        } else if (request.readyState === 4 && request.status === 400) {
            let data = JSON.parse(request.responseText);
            document.getElementById("input_buscar_orden").value = data["message"]
        }
    }

    request.send();
}

let boton_buscar_orden = document.getElementById("boton_buscar_orden");
boton_buscar_orden.addEventListener('click', buscarOrdenVentas);

function clearOrderPage() {
    document.getElementById("numerodeorden").value = "";
    document.getElementById("prioritaria").checked = false;
    // document.getElementById("id_1").value = "";
    // document.getElementById("tipo_1").value = "";
    // selectSubtipo(document.getElementById("tipo_1"));
    // document.getElementById("genero_1").value = "";
    // document.getElementById("talla_1").value = "";
    // document.getElementById("imagen_1").value = "";
    // document.getElementById("precio_1").value = "";
    // document.getElementById("cantidad_1").value = "";
    // document.getElementById("especificacion_1").value = "";
    
    prendas = document.querySelectorAll(".prenda");
    if (prendas.length > 0) {
        for (let i = 0; i < prendas.length; i++) {
            prendas[i].remove();
        }
    }

    document.getElementById("numero_de_prendas").value = "";
    document.getElementById("habilitar_envio").checked = false;
    document.getElementById("empresa_envio").value = "";
    document.getElementById("empresa_envio").disabled = true;
    document.getElementById("precio_envio").value = "";
    document.getElementById("precio_envio").disabled = true;
    document.getElementById("guia_envio").value = "";
    document.getElementById("guia_envio").disabled = true;
    document.getElementById("abono").value = "";
    document.getElementById("precio_total").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("medio_compra").value = "";
    document.getElementById("forma_pago").value = "";
    document.getElementById("pagado").checked = false;
    document.getElementById("cliente_categoria").value = "";
    document.getElementById("cliente_nombre").value = "";
    document.getElementById("cliente_correo").value = "";
    document.getElementById("cliente_tipodoc").value = "";
    document.getElementById("cliente_cedula").value = "";
    document.getElementById("cliente_telefono").value = "";
    document.getElementById("cliente_direccion").value = "";
    document.getElementById("cliente_barrio").value = "";
    document.getElementById("cliente_ciudad").value = "";
    document.getElementById("cliente_departamento").value = "";
    document.getElementById("cliente_pais").value = "";
    document.getElementById("cliente_postal").value = "";
    document.getElementById("comentario").value = "";
    document.getElementById("boton_submit").disabled = true;
}


const abono = () => {
    let abono = document.getElementById("abono").value
    if (abono == "") {abono = 0}; 
    abono = parseInt(abono);
    let total = document.getElementById("precio_total").value;
    if (total == "") {total = 0};
    total = parseInt(total);

    let restante = total - abono;
    document.getElementById("debe").value = restante;
    if (restante == 0) {
        document.getElementById("pagado").checked = true;
    } else {
        document.getElementById("pagado").checked = false;
    }

}

let input_abono = document.getElementById("abono");
input_abono.addEventListener('input', abono);


const mercadoLibre = (evento) => {
    let medio_seleccionado = evento.target.value;
    if (medio_seleccionado == 'mercadolibre') {
        document.getElementById("habilitar_envio").checked = true;
        let campos_envio = document.getElementsByClassName('form-envio')
        for (let i = 0; i < campos_envio.length; i++) {
            campos_envio[i].disabled = false;
            precioTotal();
        }

        document.getElementById("empresa_envio").value = "servientrega";
        document.getElementById("opcion_envio").value = "contado";
    } else {

        document.getElementById("habilitar_envio").checked = false;
        let campos_envio = document.getElementsByClassName('form-envio')

        for (let i = 0; i < campos_envio.length; i++) {
            campos_envio[i].disabled = true;
            document.getElementById('precio_envio').value = "";
            precioTotal();
        }

        document.getElementById("empresa_envio").value = "";
        document.getElementById("opcion_envio").value = "";
    }
}

let input_medio_compra = document.getElementById("medio_compra");
input_medio_compra.addEventListener("input", mercadoLibre);



function addPrendaLectura() {

    console.log(id_prenda);

    let div_nueva_prenda = document.createElement("div");

    div_nueva_prenda.setAttribute("class", "mt-3 form-row form-group prenda");

    div_nueva_prenda.setAttribute("id", "prenda_"+id_prenda)

    html_prenda = `<div style="display: none;">
            <input type="text" class="id_input" name="id_${id_prenda}" id="id_${id_prenda}" value="">
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="text" class="form-control form-control-sm" name="tipo_${id_prenda}" id="tipo_${id_prenda}" readonly required>
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="text" class="form-control form-control-sm subtipo" name="subtipo_${id_prenda}" id="subtipo_${id_prenda}" readonly required>
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="text" class="form-control form-control-sm" name="genero_${id_prenda}" id="genero_${id_prenda}" readonly required>
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="text" class="form-control form-control-sm" name="talla_${id_prenda}" id="talla_${id_prenda}" readonly required>
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="text" name="imagen_${id_prenda}" id="imagen_${id_prenda}" placeholder="URL Imagen" class="form-control form-control-sm">
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="number" name="precio_${id_prenda}" id="precio_${id_prenda}" placeholder="Precio Unitario" class="form-control form-control-sm precio" oninput="precioTotal(); sumCantidades();" required>
        </div>
        
        <div class="col-12 col-lg-2">
            <input type="number" name="cantidad_${id_prenda}" id="cantidad_${id_prenda}" placeholder="Cantidad" class="form-control form-control-sm cantidad" oninput="precioTotal(); sumCantidades();" readonly required>
        </div>
        
        <div class="col-12 col-lg-10">
            <div class="input-group">
                <input type="text" name="especificacion_${id_prenda}" id="especificacion_${id_prenda}" placeholder="Especificación del producto" class="form-control form-control-sm">
                <button class="btn btn-danger btn-sm" type="button" id="remover_${id_prenda}">-</button>
            </div>
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
        
        boton_remover.parentElement.parentElement.parentElement.remove()
        id_prenda = id_prenda-1
        sumCantidades();
        precioTotal();
    })

}