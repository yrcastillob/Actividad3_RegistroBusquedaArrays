
//// VARIABLES GLOBALES
var miFormulario = document.getElementById("formulariopersona");
var formularioCedula = document.getElementById("formularioBuscarCedula");
var botonAlmacenar = document.getElementById("botonalmacenar");
var botonBuscarCedula = document.getElementById("botonbuscarcedula");
var espacioMensajeOperacion = document.getElementById("contenedorrepuesta");
var botonVaciarDatos = document.getElementById("botonVaciarDatos");
var espacioRestuladoBorrado = document.getElementById("resultadoBorradoInformación");
let arrayPersonas = [];

document.addEventListener("DOMContentLoaded", function() {


    if (localStorage.getItem("arrayPersonas")) {
        arrayPersonas = JSON.parse(localStorage.getItem("arrayPersonas"));
    }

        /// FUNCIÓN VERIFICAR QUE UNA CÉDULA SEA ÚNICA
    var verificarCedulaUnica = function(cedula) {
        // Trae el array personas del local storage.
        arrayPersonas = JSON.parse(localStorage.getItem("arrayPersonas"));
        // Itera a través del array para ver si la cédula está repetida si está repetida returna false.
        for (let item = 0; item < arrayPersonas.length; item++){
            // Si está repetida returna falso e inyecta un mensaje de error.
            if (arrayPersonas[item].cedula === cedula){
                espacioMensajeOperacion.innerHTML += `<div class="alert alert-danger mensajeoperacion mensajeOperacionGuardado" role="alert" id="mensajeoperacion"> El número de cédula ${cedula} ya está en el sistema. Debe tener un número único. </div`;
                return false; 
            }
        }
        // Si termina de iterar y no está repetida returna true.
        return true;
    }

    /// FUNCIÓN PARA VERIFICAR QUE TODOS LOS DATOS SEAN VÁLIDOS
    var validarDatos = function(nombres,apellidos,cedula,direccion) {
        // Asigna falso a todas las variables de verificación.
        var validarNombres = false;
        var validarApellidos = false;
        var validarCedula = false;
        var validarDireccion = false; 
        var permitirOperacion = false;
        var mensajeOperacion = "Error en "
        // Realiza la validación de nombres, si cumple cambia la variable de verificación a true.
        if (nombres.length > 2) {
            validarNombres = true;
        }

        // Realiza la validación de apellidos, si cumple cambia la variable de verificación a true.
        if (apellidos.length > 2) {
            validarApellidos = true;
        }

        // Realiza la validación de cedula, si cumple cambia la variable de verificación a true. Llama a la función verificar cédula unica.
        if (String(cedula).length > 3 && typeof cedula === 'number') {
            cedulaUnica = verificarCedulaUnica(cedula);
            // Si cédula única es falso la variable queda en falso. 
            if (cedulaUnica == false) {
                validarCedula = false 
            } else if (cedulaUnica == true) {
                validarCedula = true 
            }
        }

        // Realiza la validación de dirección, si cumple cambia la variable de verificación a true.
        if (direccion.length > 4) {
            validarDireccion = true;
        }

        // Crea un array con los resultados obtenidos para cada uno de los elementos.
        const estadoValidacion = [
            {nombre:"Nombres", estado: validarNombres},
            {nombre:"Apellidos", estado: validarApellidos},
            {nombre:"Cédula", estado: validarCedula},
            {nombre:"Dirección", estado: validarDireccion}
        ];

        // Verifica, si todas las variables son iguales a true, crea un mensaje de operación y cambia el estado de operación a true.
        if (validarNombres == true && validarApellidos == true && validarCedula == true && validarDireccion == true) {
            mensajeOperacion = `Usuario ${nombres} ${apellidos} fue añadido correctamente.`
            permitirOperacion = true;
        } else { // Si algún elemento es falso, itera a través del array estadoValidación y va añadiendo al mensaje el elemento que está mal para crear un mensaje de error que diga cuál es el dato(s) que está mal.
        for (elemento = 0; elemento < estadoValidacion.length; elemento++){
                if (estadoValidacion[elemento].estado == false) {
                    mensajeOperacion = mensajeOperacion + estadoValidacion[elemento].nombre + " "
                }
        }
        }
        // Devuelve el estado de permitir operación y el mensaje de permitir operación.
        return {estado: permitirOperacion, mensaje: mensajeOperacion};
    }

    /// FUNCIÓN PARA ESPERAR Y ELIMINAR ALGUNOS ELEMENTOS INYECTADOS POSTERIORMENTE
    var esperar = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /// FUNCIÓN PARA GUARDAR LOS DATOS
    var guardarDatos = function() {
        localStorage.setItem("arrayPersonas", JSON.stringify(arrayPersonas));

        // Variables traídas del documento.
        var nombres = document.getElementById("nombres").value;
        var apellidos = document.getElementById("apellidos").value;
        var cedula = parseInt(document.getElementById("cedula").value);
        var direccion = document.getElementById("direccion").value;
        // Llama a la función validarDatos para ver si los datos son correctos.
        var validarOperacion = validarDatos(nombres, apellidos, cedula, direccion);

        // Si la validación de datos es correcta procede a almacendar los datos.
        if (validarOperacion.estado == true) {
            // Trae el arraypersonas del local estorage para que sea ese el que se modifique y los datos perduren
            arrayPersonas = JSON.parse(localStorage.getItem("arrayPersonas"))
            // Añade la nueva persona al array.
            arrayPersonas.push({ nombres: nombres, apellidos: apellidos, cedula: cedula, direccion: direccion }); 
            // Envía el nuevo array a local storage acutalizado.
            localStorage.setItem("arrayPersonas", JSON.stringify(arrayPersonas));
            // Inyecta un mensaje de éxito en la operación.
            espacioMensajeOperacion.innerHTML += '<div class="alert alert-success mensajeoperacion mensajeOperacionGuardado" role="alert" id="mensajeoperacion">' + validarOperacion.mensaje + '</div';
            // Hace reset al fomurlario para que quede en blanco
            miFormulario.reset()
        } else if (validarOperacion.estado == false) { // Si la validación de datos da false
            // Inyecta un mensaje de error indicando qué elementos están mal en el formulario.
            espacioMensajeOperacion.innerHTML += '<div class="alert alert-warning mensajeoperacion mensajeOperacionGuardado" role="alert" id="mensajeoperacion">' + validarOperacion.mensaje + '</div>';
        }
        
    }

    /// EVENT LISTENER DEL BOTÓN ALMACENAR
    // Después de que se oprima el botón almacenar, espera 10 segundos y borra todos los mensajes inyectados que tienen la clase mensajeOperacionGuardado
    botonAlmacenar.addEventListener("click", async function() {
        await esperar(10000);
        var elementosAEliminar = document.querySelectorAll(".mensajeOperacionGuardado");
        elementosAEliminar.forEach(function(elemento) {
            elemento.remove();
        });
    });

    /// FUNCIÓN PARA BUSCAR LA CÉDULA DENTRO DEL ARRAY
    var buscarCedula = function() {
        // Trae las variables del documentos y el array del Local Storage
        var cedulaPorBuscar = parseInt(document.getElementById("cedulaporbuscar").value);
        arrayPersonas = JSON.parse(localStorage.getItem("arrayPersonas"));
        var contenedorResultadoBusqueda = document.getElementById("contenedorresultadobusqueda");

        // Realiza la validación de que la cédula ingresada sea válida
        if (String(cedulaPorBuscar).length > 3 && typeof cedulaPorBuscar === 'number') {
            // Si es valida itera a través de los elementos del array
            for (let item = 0; item < arrayPersonas.length; item++) {
                // Si la cédula coincide asigna el objeto del array que coincide a var personas
                if (arrayPersonas[item].cedula === cedulaPorBuscar){
                    persona = arrayPersonas[item];
                    //Crea un mensaje tomando los datos del array de personas.
                    mensaje = `El usuario es ${persona.nombres} ${persona.apellidos} cédula ${persona.cedula} y dirección ${persona.direccion}.`
                    // Crea un alert mostrando los elementos
                    alert(mensaje)
                    // Inyecta un div con el mensaje de éxito en la búsqueda
                    contenedorResultadoBusqueda.innerHTML += `<div class="alert alert-success mensajeoperacion mensajeOperacionBusqueda" role="alert" id="mensajeResultado"> El usuario es ${persona.nombres} ${persona.apellidos} cédula ${persona.cedula} y dirección ${persona.direccion}.</div>`;
                    formularioCedula.reset()
                    // Hace return para que no haga nada más en la función
                    return;
                }      
            }
            // Si no hay una cédula igual, sale del ciclo y da este mensaje y la alerta.
            mensaje = `El usuario con cédula ${cedulaPorBuscar} no existe.`;
            contenedorResultadoBusqueda.innerHTML += `<div class="alert alert-warning mensajeoperacion mensajeOperacionBusqueda" role="alert" id="mensajeResultado"> El usuario con cédula ${cedulaPorBuscar} no existe.</div>`;
            alert(mensaje);
        } else {
            // Si la cédula ingresada no es válida, no realiza ninguna validación e inyecta un mensaje de error.
            contenedorResultadoBusqueda.innerHTML += `<div class="alert alert-danger mensajeoperacion mensajeOperacionBusqueda" role="alert" id="mensajeResultado"> El número de cédula ${cedulaPorBuscar} no es válido.</div>`;
        } 
    }

    /// EVENT LISTENER DEL BOTÓN BUSCAR CÉDULA
    // Después de que se oprima el botón almacenar, espera 10 segundos y borra todos los mensajes inyectados que tienen la clase mensajeOperacionBusqueda
    botonBuscarCedula.addEventListener("click", async function() {
        await esperar(10000);
        var elementosAEliminar = document.querySelectorAll(".mensajeOperacionBusqueda");
        elementosAEliminar.forEach(function(elemento) {
            elemento.remove();
        });
    });

    /// FUNCIÓN PARA BORRAR DATOS GUARDADOS EN LOCAL STORAGE
    var vaciarDatosGuardados = function(){
        // Crea una alerta de confirmación para asegurarse de que el usuario quiere borrarlo y es conciente de que no se puede deshacer.
        var respuestaConfirmacion = confirm('¿Está seguro de que quiere borrar todos los datos de las personas que ha guardado?, esto no se puede deshacer.');
        // Trae el array del local storage.
        arrayPersonas = JSON.parse(localStorage.getItem("arrayPersonas"));
        cantidadPersonas = arrayPersonas.length;

        // Si confirma borra todos los elementos y le dice cuántos borró.
        if (respuestaConfirmacion === true) {
            arrayPersonas.splice(0,arrayPersonas.length);
            localStorage.setItem("arrayPersonas", JSON.stringify(arrayPersonas));
            espacioRestuladoBorrado.innerHTML += `<div class="alert alert-primary mensajeoperacion mensajeResultadoBorrado" role="alert" id="mensajeResultado"> Se borraron ${cantidadPersonas} de las que se habían inscrito. Esta acción no se puede deshacer.</div>`;
        } else { // Si no dice que no se borró nada.
            espacioRestuladoBorrado.innerHTML += `<div class="alert alert-primary mensajeoperacion mensajeResultadoBorrado" role="alert" id="mensajeResultado"> No se borró ninguna persona.</div>`;
        }
    }

    /// EVENT LISTENER DEL BOTÓN BORRAR DATOS
    // Después de que se oprima el botón borrar todas las personas, espera 10 segundos y borra todos los mensajes inyectados que tienen la clase mensajeResultadoBorrado
    botonVaciarDatos.addEventListener("click", async function() {
        await esperar(5000);
        var elementosAEliminar = document.querySelectorAll(".mensajeResultadoBorrado");
        elementosAEliminar.forEach(function(elemento) {
            elemento.remove();
        });
    });


})




