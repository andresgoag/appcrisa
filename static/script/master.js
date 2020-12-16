var buscador = document.getElementById("buscador")
var collapse_buscador = document.getElementById("collapse_buscador")
var window_size_575 = window.matchMedia("(max-width: 575px)")

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
