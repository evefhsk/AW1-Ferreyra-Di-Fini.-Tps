
import { inicializarModuloEventos } from "./eventosMusicales.js";
import { abrirDetalleEvento } from "./detalleEventos.js";

// Contenedor del módulo de eventos
const contenedorEventos = document.querySelector(
    "#contenedor-modulo-eventos"
);

// Sección de detalles del evento
const vistaDetalleEvento = document.querySelector(
    "#detalles-evento"
);

// Mostrar la sección de detalles
function mostrarSeccion(seccion) {

    if (!seccion) {
        console.error("No se encontró la sección.");
        return;
    }

    seccion.style.display = "block";
    seccion.classList.remove("seccion-oculta");

    seccion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Inicializar el módulo de eventos en Inicio
inicializarModuloEventos(contenedorEventos);

// Escuchar cuando el usuario selecciona un evento
contenedorEventos.addEventListener("abrirDetalleEvento", (evento) => {

    const id = evento.detail.id;

    abrirDetalleEvento(id, mostrarSeccion);
});
