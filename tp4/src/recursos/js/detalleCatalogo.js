

import { fanPacks } from "./catalogo.js";

// Elementos del HTML del detalle
const vistaDetalleFanPack = document.querySelector(
    "#vista-detalle-fanpack"
);

const imagenDetalle = document.querySelector(
    "#imagen-detalle-fanpack"
);

const artistaDetalle = document.querySelector(
    "#artista-detalle-fanpack"
);

const nombreDetalle = document.querySelector(
    "#nombre-detalle-fanpack"
);

const descripcionDetalle = document.querySelector(
    "#descripcion-detalle-fanpack"
);

const precioDetalle = document.querySelector(
    "#precio-detalle-fanpack"
);

const contenidoDetalle = document.querySelector(
    "#contenido-productos-fanpack"
);

const modalidadDetalle = document.querySelector(
    "#modalidad-retiro-fanpack"
);

// Contenedor de los botones
const contenedorAccionesDetalle = vistaDetalleFanPack
    ? vistaDetalleFanPack.querySelector(".detalle-hero__acciones")
    : null;

// Estado visible de la reserva
const estadoReservaDetalle = vistaDetalleFanPack
    ? vistaDetalleFanPack.querySelector("#estado-reserva-fanpack")
    : null;


// ==================================================
// 1. MOSTRAR EL DETALLE DE UN FAN PACK
// ==================================================

export function abrirDetalleFanPack(id, reservas, mostrarSeccion) {
    const pack = fanPacks.find((item) => {
        return item.id === Number(id);
    });

    if (!pack) {
        console.error("No se encontró el Fan Pack:", id);
        return;
    }

    if (
        !vistaDetalleFanPack ||
        !imagenDetalle ||
        !artistaDetalle ||
        !nombreDetalle ||
        !descripcionDetalle ||
        !precioDetalle ||
        !contenidoDetalle ||
        !modalidadDetalle ||
        !contenedorAccionesDetalle ||
        !estadoReservaDetalle
    ) {
        console.error("Faltan elementos HTML del detalle del Fan Pack.");
        return;
    }

    imagenDetalle.src = pack.imagen;
    imagenDetalle.alt = `Fan Pack de ${pack.artista}`;

    artistaDetalle.textContent = pack.artista;
    nombreDetalle.textContent = pack.nombre;
    descripcionDetalle.textContent = pack.descripcion;

    precioDetalle.textContent =
        `$${pack.precio.toLocaleString("es-AR")}`;

    contenidoDetalle.textContent =
        pack.contenido || pack.descripcion;

    const modalidades = Array.isArray(pack.modalidadRetiro)
        ? pack.modalidadRetiro.join(" y ")
        : pack.modalidadRetiro || "Consultar disponibilidad";

    modalidadDetalle.textContent = modalidades;

    actualizarVistaDetalle(pack.id, reservas);

    mostrarSeccion(vistaDetalleFanPack);

    window.location.hash = "vista-detalle-fanpack";
}


// ==================================================
// 2. ACTUALIZAR EL ESTADO DE LA RESERVA
// ==================================================

export function actualizarVistaDetalle(id, reservas) {
    const pack = fanPacks.find((item) => {
        return item.id === Number(id);
    });

    if (
        !pack ||
        !contenedorAccionesDetalle ||
        !estadoReservaDetalle
    ) {
        console.error("No se pudo actualizar el estado del Fan Pack.");
        return;
    }

    // Buscar si el Fan Pack ya está reservado
    const reservaExistente = reservas.find((reserva) => {
        return reserva.id === pack.id;
    });

    if (reservaExistente) {

        // Actualizar el estado visible
        estadoReservaDetalle.textContent =
            `Reservado (${reservaExistente.cantidad} un.)`;

        // Mostrar los botones correspondientes
        contenedorAccionesDetalle.innerHTML = `
            <button
                id="boton-agregar-detalle-fanpack"
                class="perfil-boton boton-agregar-detalle boton-agregar-pack"
                type="button"
                data-pack-id="${pack.id}"
            >
                Agregar otra unidad
            </button>

            <button
                class="perfil-boton boton-quitar-pack"
                type="button"
                data-pack-id="${pack.id}"
            >
                Sacar de carrito
            </button>
        `;

    } else {

        // Actualizar el estado visible
        estadoReservaDetalle.textContent = "Disponible";

        // Mostrar solamente el botón para agregar
        contenedorAccionesDetalle.innerHTML = `
            <button
                id="boton-agregar-detalle-fanpack"
                class="perfil-boton boton-agregar-detalle boton-agregar-pack"
                type="button"
                data-pack-id="${pack.id}"
            >
                + Agregar a mis reservas
            </button>
        `;
    }
}
