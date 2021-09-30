const buscador_ordenes = () => {
    let estado = document.getElementById("estado_orden").value;
    let marca = document.getElementById("marca").value;
    let prioridad = document.getElementById("prioridad").value;
    let identificacion = document.getElementById("identificacion").value;
    let telefono = document.getElementById("telefono").value;
    let fecha = document.getElementById("fecha").value;
    let medio_compra = document.getElementById("medio_compra").value;
    let pagado = document.getElementById("pagado").value;
    let opcion_envio = document.getElementById("opcion_envio").value;
    let empresa_envio = document.getElementById("empresa_envio").value;
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
                let cliente_telefono = data['ordenes'][i]['cliente']['telefono'];
                let estado_orden = data['ordenes'][i]['estado_orden'];
                let marca_orden = data['ordenes'][i]['marca'];
                let orden_medio_compra = data['ordenes'][i]['medio_compra'];
                let responsable = data['ordenes'][i]['usuario_responsable'];
                let orden_fecha = data['ordenes'][i]['fecha'];
                let orden_pagado = data['ordenes'][i]['pagado'];
                let orden_opcion_envio = data['ordenes'][i]['opcion_envio'];
                let orden_tiempo_estimado = data['ordenes'][i]['tiempo_estimado'];
                let orden_empresa_envio = data['ordenes'][i]['empresa_envio'];
                let total = data['ordenes'][i]['precio_total']
                let abono = data['ordenes'][i]['abono']
                if (abono == "") {
                    abono = 0
                }
                let debe = parseFloat(total) - parseFloat(abono)
                

                if ((estado == estado_orden || estado == "todas") && (marca == marca_orden || marca == "todas") && (prioridad == prioritaria || prioridad == "todas") &&
                (identificacion == cliente_identificacion || identificacion == "") && (telefono == cliente_telefono || telefono == "")
                && (fecha == orden_fecha || fecha == "") && (medio_compra == orden_medio_compra || medio_compra == "todas") && (pagado == orden_pagado || pagado == "todas") &&
                (opcion_envio == orden_opcion_envio || opcion_envio == "todas") && (empresa_envio == orden_empresa_envio || empresa_envio == "todas") && 
                (tiempo_estimado == orden_tiempo_estimado || tiempo_estimado == "todas") ) {
                    
                    html_orden = `<tr class="fila">
                        <td>${prioritaria}</td>
                        <td class="orden">${numero_orden}</td>
                        <td>${cantidad_prendas}</td>
                        <td>${cliente_nombre}</td>
                        <td>${cliente_identificacion}</td>
                        <td>${cliente_telefono}</td>
                        <td>${estado_orden}</td>
                        <td>${total}</td>
                        <td>${abono}</td>
                        <td>${debe}</td>
                        
                        <td>                
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" name="check_pago_${i}" id="check_pago_${i}">
                                <label class="custom-control-label" for="check_pago_${i}">Pagó</label>
                            </div>
                        </td>
                        <td>${responsable}</td>
                    </tr>`;


                    tabla.insertAdjacentHTML('beforeend', html_orden);
                    let checkbox_pago = document.getElementById(`check_pago_${i}`)
                    if (data['ordenes'][i]['pagado'] == "si") {
                        checkbox_pago.checked = true;
                    }
                    checkbox_pago.addEventListener('click',checkPago)
                }
            }
        }
    }
    request.send();
}

let boton_buscador_ordenes = document.getElementById("buscador_ordenes");
boton_buscador_ordenes.addEventListener('click', buscador_ordenes);

const checkPago = (evento) => {
    let fila = evento.target.parentElement.parentElement.parentElement;
    let orden = fila.querySelector(".orden").textContent;

    info = {orden:orden, estado:evento.target.checked}
    info_json = JSON.stringify(info)
    
    fetchData("POST", "/marcarpago", (error, data) => {
        alert(data['message'])
    }, info_json)

}


const buscador_prendas = () => {
    let tipo = document.getElementById("tipo-prenda").value;
    let usuario = document.getElementById("usuario-responsable-prenda").value;
    let area = document.getElementById("area-responsable-prenda").value;
    let prioridad = document.getElementById("prioridad-prenda").value;
    let material = document.getElementById("material").value;
    let tabla = document.getElementById("tabla_prendas");
    let orden = document.getElementById("orden-prenda").value;

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
                let prendas = data['ordenes'][i]['prendas'];

                for (let a = 0; a < prendas.length; a++) {
                    let tipo_prenda = prendas[a]["tipo"];
                    let cantidad_prenda = prendas[a]["cantidad"];
                    let area_prenda = prendas[a]["area_responsable"];
                    let responsable_prenda = prendas[a]["usuario_responsable"];

                    if ((tipo == tipo_prenda || tipo == "todas") && (tipo_prenda !== 'interna') && (usuario == responsable_prenda || usuario == "") && (area == area_prenda || area == "") &&
                    (prioridad == prioritaria|| prioridad == "todas") && (material == area_prenda || material == "todas") && (orden == numero_orden || orden == "")
                     ) {
                        html_orden = '<tr class="fila"><td>'+prioritaria+'</td><td>'+numero_orden+'</td><td>'+tipo_prenda+'</td><td>'+cantidad_prenda+'</td><td>'+area_prenda+'</td><td>'+responsable_prenda+'</td></tr>'
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




const buscador_estadisticas = () => {

    let fecha_desde_str = document.getElementById("estadisticas-fecha-desde").value;
    let fecha_hasta_str = document.getElementById("estadisticas-fecha-hasta").value;
    if (fecha_desde_str === '' || fecha_hasta_str === '') {
        return alert('Se requiere llenar los campos de fecha')
    }
    let fecha_desde = new Date(fecha_desde_str);
    let fecha_hasta = new Date(fecha_hasta_str);
    let tipo_prenda = document.getElementById("estadisticas-tipo-prenda").value;
    let estado = document.getElementById("estadisticas-estado_orden").value;
    let marca = document.getElementById("estadisticas-marca").value;
    let identificacion = document.getElementById("estadisticas-identificacion").value;
    let medio_compra = document.getElementById("estadisticas-medio_compra").value;
    let opcion_envio = document.getElementById("estadisticas-opcion_envio").value;
    let empresa_envio = document.getElementById("estadisticas-empresa_envio").value;
    let tiempo_estimado = document.getElementById("estadisticas-tiempo_estimado").value;
    let tabla = document.getElementById("tabla_estadisticas");


    let request = new XMLHttpRequest();
    request.open("GET", "/verordenes");

    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {

            filas = document.querySelectorAll('#tabla_estadisticas .fila')

            for (let i = 0; i < filas.length; i++) {
                filas[i].remove()
            }

            let data = JSON.parse(request.responseText);
            let total_dinero = 0;
            let total_prendas = 0;
            for (let i = 0; i < data['ordenes'].length; i++) {

                let orden_fecha_str = data['ordenes'][i]['fecha'];
                let orden_fecha = new Date(orden_fecha_str);

                if (orden_fecha >= fecha_desde && orden_fecha <= fecha_hasta) {

                    let numero_orden = data['ordenes'][i]['numero_orden'];
                    let estado_orden = data['ordenes'][i]['estado_orden'];
                    let marca_orden = data['ordenes'][i]['marca'];
                    let cliente_identificacion = data['ordenes'][i]['cliente']['cedula'];
                    let orden_medio_compra = data['ordenes'][i]['medio_compra'];
                    let orden_opcion_envio = data['ordenes'][i]['opcion_envio'];
                    let orden_empresa_envio = data['ordenes'][i]['empresa_envio'];
                    let orden_tiempo_estimado = data['ordenes'][i]['tiempo_estimado'];
                    
    
                    if ( (estado == estado_orden || estado == "todas") && (marca == marca_orden || marca == "todas") && (marca_orden !== 'interna') 
                    && (identificacion == cliente_identificacion || identificacion == "") && (medio_compra == orden_medio_compra || medio_compra == "todas") 
                    && (opcion_envio == orden_opcion_envio || opcion_envio == "todas") && (empresa_envio == orden_empresa_envio || empresa_envio == "todas") 
                    && (tiempo_estimado == orden_tiempo_estimado || tiempo_estimado == "todas") ) {

                        let prendas = data['ordenes'][i]['prendas'];
                        let flag = false;
                        let cantidad_prendas = 0;
                        let valor_total = 0;
        
                        for (let i = 0; i < prendas.length; i++) {
                            if (tipo_prenda === prendas[i]['tipo'] || tipo_prenda === 'todas') {
                                cantidad_prendas += parseInt(prendas[i]['cantidad']);
                                valor_total += (parseInt(prendas[i]['precio'])*parseInt(prendas[i]['cantidad']))
                                flag = true;
                            }
                        }

                        total_dinero += valor_total;
                        total_prendas += cantidad_prendas;

                        if (flag) {

                            let html_orden = `
                            <tr class="fila">
                                <td>${numero_orden}</td>
                                <td>${cliente_identificacion}</td>
                                <td>${marca_orden}</td>
                                <td>${orden_medio_compra}</td>
                                <td>${orden_opcion_envio}</td>
                                <td>${orden_empresa_envio}</td>
                                <td>${orden_tiempo_estimado}</td>
                                <td>${cantidad_prendas}</td>
                                <td>${valor_total}</td>
                            </tr>`;

                            tabla.insertAdjacentHTML('beforeend', html_orden);

                        }
                    }
                }
            }

            document.getElementById("estadisticas-total-prendas").value = total_prendas;
            document.getElementById("estadisticas-total-dinero").value = total_dinero;
        }
    }
    request.send();
}




const boton_buscador_estadisticas = document.getElementById("buscador_estadisticas");
boton_buscador_estadisticas.addEventListener('click', buscador_estadisticas);