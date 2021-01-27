const buscador_ordenes = () => {
    let estado = document.getElementById("estado_orden").value;
    let marca = document.getElementById("marca").value;
    let prioridad = document.getElementById("prioridad").value;
    let fecha = document.getElementById("fecha").value;
    let medio_compra = document.getElementById("medio_compra").value;
    let tiempo_estimado = document.getElementById("tiempo_estimado").value;
    let tabla = document.getElementById("tabla_ordenes");

    let request = new XMLHttpRequest();
    request.open("GET", "/verordenes");

    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {

            filas = document.querySelectorAll('#tabla_ordenes .fila')

            for (let i = 0; i < filas.length; i++) {
                filas[i].remove()
            }

            let data = JSON.parse(request.responseText);
            for (let i = 0; i < data['ordenes'].length; i++) {
                let prioritaria = data['ordenes'][i]['prioritaria'];
                let numero_orden = data['ordenes'][i]['numero_orden'];
                let prendas = data['ordenes'][i]['prendas'];
                let cantidad_prendas = 0;
                for (let i = 0; i < prendas.length; i++) {
                     cantidad_prendas += parseInt(prendas[i]['cantidad']);
                }
                let cliente_nombre = data['ordenes'][i]['cliente']['nombre'];
                let cliente_identificacion = data['ordenes'][i]['cliente']['cedula'];
                let estado_orden = data['ordenes'][i]['estado_orden'];
                let marca_orden = data['ordenes'][i]['marca'];
                let orden_medio_compra = data['ordenes'][i]['medio_compra'];
                let responsable = data['ordenes'][i]['usuario_responsable'];
                let orden_fecha = data['ordenes'][i]['fecha'];
                let orden_tiempo_estimado = data['ordenes'][i]['tiempo_estimado'];
                

                if ((estado == estado_orden || estado == "todas") && (marca == marca_orden || marca == "todas") && (prioridad == prioritaria || prioridad == "todas") &&
                (fecha == orden_fecha || fecha == "") && (medio_compra == orden_medio_compra || medio_compra == "todas") && 
                (tiempo_estimado == orden_tiempo_estimado || tiempo_estimado == "todas") ) {
                    
                    html_orden = `<tr class="fila">
                        <td>${prioritaria}</td>
                        <td class="orden">${numero_orden}</td>
                        <td>${cantidad_prendas}</td>
                        <td>${cliente_nombre}</td>
                        <td>${cliente_identificacion}</td>
                        <td>${estado_orden}</td>
                        <td>${responsable}</td>

                    </tr>`;
                    tabla.insertAdjacentHTML('beforeend', html_orden);

                }
            }
        }
    }
    request.send();
}

let boton_buscador_ordenes = document.getElementById("buscador_ordenes");
boton_buscador_ordenes.addEventListener('click', buscador_ordenes);


const buscador_prendas = () => {
    let tipo = document.getElementById("tipo-prenda").value;
    let usuario = document.getElementById("usuario-responsable-prenda").value;
    let area = document.getElementById("area-responsable-prenda").value;
    let prioridad = document.getElementById("prioridad-prenda").value;
    let material = document.getElementById("material").value;
    let tabla = document.getElementById("tabla_prendas");
    let medio_compra = document.getElementById("medio_compra_prenda").value;
    let categoria = document.getElementById("tiempo_estimado_prenda").value;

    let request = new XMLHttpRequest();
    request.open("GET", "/verordenes");
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {

            filas = document.querySelectorAll('#tabla_prendas .fila')

            for (let i = 0; i < filas.length; i++) {
                filas[i].remove()
            }

            let data = JSON.parse(request.responseText);
            for (let i = 0; i < data['ordenes'].length; i++) {
                let prioritaria = data['ordenes'][i]['prioritaria'];
                let numero_orden = data['ordenes'][i]['numero_orden'];
                let medio_compra_orden = data['ordenes'][i]['medio_compra'];
                let categoria_orden = data['ordenes'][i]['tiempo_estimado'];
                let prendas = data['ordenes'][i]['prendas'];

                for (let a = 0; a < prendas.length; a++) {
                    let tipo_prenda = prendas[a]["tipo"];
                    let cantidad_prenda = prendas[a]["cantidad"];
                    let area_prenda = prendas[a]["area_responsable"];
                    let responsable_prenda = prendas[a]["usuario_responsable"];

                    if ((tipo == tipo_prenda || tipo == "todas") && (usuario == responsable_prenda || usuario == "") && (area == area_prenda || area == "") &&
                    (prioridad == prioritaria|| prioridad == "todas") && (material == area_prenda || material == "todas") && (medio_compra == medio_compra_orden || medio_compra == "todas") &&
                    (categoria == categoria_orden || categoria == "todas") ) {
                        html_orden = `<tr class="fila">
                            <td>${prioritaria}</td>
                            <td>${numero_orden}</td>
                            <td>${tipo_prenda}</td>
                            <td>${cantidad_prenda}</td>
                            <td>${medio_compra_orden}</td>
                            <td>${categoria_orden}</td>
                            <td>${area_prenda}</td>
                            <td>${responsable_prenda}</td>
                        </tr>`
                        tabla.insertAdjacentHTML('beforeend', html_orden);
                    }
                }
            }
        }
    }
    request.send();
}


const boton_buscador_prendas = document.getElementById("buscador_prendas");
boton_buscador_prendas.addEventListener('click', buscador_prendas);
