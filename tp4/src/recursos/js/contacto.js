// recursos/js/contacto.js
const formularioContacto = document.getElementById("id-form-contacto");
const dialogoMensaje = document.getElementById("id-contacto-dialogo");

if (formularioContacto) {
    
    formularioContacto.addEventListener("submit", (evento) => {

        evento.preventDefault(); 

        dialogoMensaje.textContent = "¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.";
        
        formularioContacto.reset();
        setTimeout(() => {
            dialogoMensaje.textContent = ""; 
        }, 5000);
    });
}