
var miFormulario = document.getElementById("formulariopersona");
var botonAlmacenar = document.getElementById("botonalmacenar");
let arrayPersonas = [];

var validarDatos = function(nombres,apellidos,cedula,direccion) {
    var validarNombres = false;
    var validarApellidos = false;
    var validarCedula = false;
    var validarDireccion = false; 
    var permitirOperacion = false;
    var mensajeOperacion = "Error en "

    if (nombres.length > 2) {
        validarNombres = true;
    }

    if (apellidos.length > 2) {
        validarApellidos = true;
    }

    if (String(cedula).length > 3 && typeof cedula === 'number') {
        validarCedula = true
    }

    if (direccion.length > 4) {
        validarDireccion = true;
    }

    const estadoValidacion = [
        {nombre:"Nombres", estado: validarNombres},
        {nombre:"Apellidos", estado: validarApellidos},
        {nombre:"Cédula", estado: validarCedula},
        {nombre:"Dirección", estado: validarDireccion}
    ];

    if (validarNombres == true && validarApellidos == true && validarCedula == true && validarDireccion == true) {
        mensajeOperacion = `Usuario ${nombres} ${apellidos} fue añadido correctamente.`
        permitirOperacion = true;
    } else {
       for (elemento = 0; elemento < estadoValidacion.length; elemento++){
            if (estadoValidacion[elemento].estado == false) {
                mensajeOperacion = mensajeOperacion + estadoValidacion[elemento].nombre + " "
            }
       }
    }
    return {estado: permitirOperacion, mensaje: mensajeOperacion};
}

var guardarDatos = function() {
    var nombres = document.getElementById("nombres").value;
    var apellidos = document.getElementById("apellidos").value;
    var cedula = parseInt(document.getElementById("cedula").value);
    var direccion = document.getElementById("direccion").value;
    var espacioMensajeOperacion = document.getElementById("contenedorrepuesta");
    var validarOperacion = validarDatos(nombres, apellidos, cedula, direccion);

    if (validarOperacion.estado == true) {
        espacioMensajeOperacion.innerHTML += '<div class="alert alert-success mensajeoperacion" role="alert" id="mensajeoperacion">' + validarOperacion.mensaje + '</div';
        arrayPersonas.push({ nombres: nombres, apellidos: apellidos, cedula: cedula, direccion: direccion }); 
        localStorage.setItem("arrayPersonas", JSON.stringify(arrayPersonas));
    } else if (validarOperacion.estado == false) {
        espacioMensajeOperacion.innerHTML += '<div class="alert alert-warning mensajeoperacion" role="alert" id="mensajeoperacion">' + validarOperacion.mensaje + '</div>';
    }
    miFormulario.reset()
}

botonAlmacenar.addEventListener("click", async function() {
    await esperar(10000);
    var mensajeOperacion = document.getElementById("mensajeoperacion");
    mensajeOperacion.remove();
});


var esperar = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




