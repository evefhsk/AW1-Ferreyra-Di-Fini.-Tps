
import { eventos } from "./eventosMusicales.js";


// ==================================================
// 1. ELEMENTOS DEL HTML
// ==================================================

const vistaDetalleEvento = document.querySelector(
    "#detalles-evento"
);

const imagenDetalleEvento = document.querySelector(
    "#imagen-detalle-evento"
);

const artistaDetalleEvento = document.querySelector(
    "#artista-detalle-evento"
);

const nombreDetalleEvento = document.querySelector(
    "#nombre-detalle-evento"
);

const descripcionDetalleEvento = document.querySelector(
    "#descripcion-detalle-evento"
);

const fechaDetalleEvento = document.querySelector(
    "#fecha-detalle-evento"
);

const aperturaPuertasEvento = document.querySelector(
    "#apertura-puertas-evento"
);

const inicioShowEvento = document.querySelector(
    "#inicio-show-evento"
);

const accesosEvento = document.querySelector(
    "#accesos-evento"
);

const elementosPermitidosEvento = document.querySelector(
    "#elementos-permitidos-evento"
);

const setlistEvento = document.querySelector(
    "#setlist-evento"
);

const retiroFanPackEvento = document.querySelector(
    "#retiro-fanpack-evento"
);


// ==================================================
// 2. MOSTRAR DETALLE DE UN EVENTO
// ==================================================

export function abrirDetalleEvento(id, mostrarSeccion) {

    // Buscar el evento seleccionado
    const evento = eventos.find((item) => {
        return item.id === Number(id);
    });

    if (!evento) {
        console.error("No se encontró el evento:", id);
        return;
    }

    // Comprobar que existan los elementos HTML necesarios
    if (
        !vistaDetalleEvento ||
        !imagenDetalleEvento ||
        !artistaDetalleEvento ||
        !nombreDetalleEvento ||
        !descripcionDetalleEvento ||
        !fechaDetalleEvento ||
        !aperturaPuertasEvento ||
        !inicioShowEvento ||
        !accesosEvento ||
        !elementosPermitidosEvento ||
        !setlistEvento ||
        !retiroFanPackEvento
    ) {
        console.error("Faltan elementos HTML del detalle del evento.");
        return;
    }

    // Obtener los detalles específicos del evento
    const detalles = evento.detalles;

    // Cargar la información principal
    if (evento.imagen) {
        imagenDetalleEvento.src = evento.imagen;
    }

    imagenDetalleEvento.alt = `Evento de ${evento.artista}`;

    artistaDetalleEvento.textContent = evento.artista;
    nombreDetalleEvento.textContent = evento.artista;

    descripcionDetalleEvento.textContent =
        `Evento en ${evento.recinto}`;

    fechaDetalleEvento.textContent = evento.fecha;

    // Cargar horarios
    aperturaPuertasEvento.textContent =
        detalles.aperturaPuertas || "Sin información";

    inicioShowEvento.textContent =
        detalles.inicioShow || "Sin información";

    // Cargar accesos
    accesosEvento.textContent =
        detalles.accesos.length > 0
            ? detalles.accesos.join(", ")
            : "Sin información disponible";

    // Cargar elementos permitidos
    elementosPermitidosEvento.innerHTML = `
        <strong>Elementos permitidos:</strong>
        ${detalles.elementosPermitidos.length > 0
            ? detalles.elementosPermitidos.join(", ")
            : "Sin información disponible"
        }
    `;

    // Cargar setlist
    setlistEvento.innerHTML = detalles.setlist.length > 0
        ? detalles.setlist.map((cancion) => `
            <li class="canciones-lista__item">
                ${cancion}
            </li>
        `).join("")
        : `
            <li class="canciones-lista__item">
                Sin información disponible
            </li>
        `;

    // Cargar información sobre el retiro del Fan Pack
    retiroFanPackEvento.textContent =
        detalles.retiroFanPack || "Información no disponible.";

    // Mostrar la sección del evento
    mostrarSeccion(vistaDetalleEvento);

    // Actualizar la dirección de navegación
    window.location.hash = "detalles-evento";
}
