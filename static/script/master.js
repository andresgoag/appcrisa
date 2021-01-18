let buscador = document.getElementById("buscador")
let collapse_buscador = document.getElementById("collapse_buscador")
let window_size_575 = window.matchMedia("(max-width: 575px)")

collapse_buscador.addEventListener('click', function(){
    if (buscador.style.display == 'none') {
        buscador.style.display = 'block';
    } else {
        buscador.style.display = 'none';
    }
})

function myFunction(window_size_575) {
    if (window_size_575.matches) { // If media query matches
        buscador.style.display = 'none';
    } else {
        buscador.style.display = 'block';
    }
}

myFunction(window_size_575) // ejecutar la funcion a la primera corrida
window_size_575.addListener(myFunction) // crear un listener al cambio de window size y ejecutar la funcion



function fetchData(method, url_api, callback, info='') {

    let request = new XMLHttpRequest();

    request.open(method, url_api, true);

    request.onreadystatechange = function (event) {

        if (request.readyState === 4) {
            if (request.status === 200) {
                callback(null, JSON.parse(request.responseText));
            } else {
                const error = new Error('Error ' + url_api);
                return callback(error, null);
            }
        }

    }

    if (info === '') {
        request.send();
    } else {
        request.setRequestHeader("Content-Type", "application/json");
        request.send(info);
    }
}
