
// recursos/js/perfil.js


// ==========================================
// IMPORTACIONES
// ==========================================

import { fanPacks } from "./catalogo.js";
import { artistasData } from "./datosArtistas.js";

import {
    eventos,
    obtenerFavoritos,
    alternarFavorito,
    inicializarModuloEventos
} from "./eventosMusicales.js";

import {
    abrirDetalleEvento
} from "./detalleEventos.js";

import {
    abrirDetalleFanPack,
    actualizarVistaDetalle
} from "./detalleCatalogo.js";


// ==========================================
// 1. VARIABLES Y ELEMENTOS DEL HTML
// ==========================================

// Arreglo donde se almacenan las reservas
const reservas = [];

const filtrosArtistas = document.querySelectorAll('input[name="filtro-artista"]');
const filtrosPacks = document.querySelectorAll('input[name="filtro-pack"]');

const grillaArtistas = document.querySelector("#grilla-artistas");
const grillaFanPacks = document.querySelector("#grilla-fanpacks");
const tablaReservas = document.querySelector("#tabla-reservas");
const listaEventosGuardados = document.querySelector("#lista-eventos-guardados");
const contenedorEventos = document.querySelector("#contenedor-modulo-eventos");

const seccionesOcultables = document.querySelectorAll(
    "#artistas-seguidos, #detalles-fanpack, #detalles-evento, #vista-detalle-fanpack"
);


// ==========================================
// 2. CARGAR RESERVAS DESDE LOCALSTORAGE
// ==========================================

function cargarReservas() {

    // Vaciar el arreglo antes de cargar los datos
    reservas.length = 0;

    // Recorrer todos los Fan Packs del catálogo
    fanPacks.forEach(pack => {

        const claveReserva = `reservaFanPack_${pack.id}`;

        const reservaGuardada = localStorage.getItem(claveReserva);

        if (reservaGuardada) {

            // Separar cantidad, precio y modalidad
            const datosReserva = reservaGuardada.split("|");

            reservas.push({
                id: pack.id,
                nombre: `${pack.nombre} (${pack.artista})`,
                cantidad: Number(datosReserva[0]),
                precio: Number(datosReserva[1]),
                modalidadRetiro: datosReserva[2]
            });

        }

    });

}


// ==========================================
// 3. GUARDAR RESERVAS EN LOCALSTORAGE
// ==========================================

function guardarReservas() {

    // Recorrer todas las reservas
    reservas.forEach(reserva => {

        const claveReserva = `reservaFanPack_${reserva.id}`;

        // Guardar cantidad, precio y modalidad
        localStorage.setItem(
            claveReserva,
            `${reserva.cantidad}|${reserva.precio}|${reserva.modalidadRetiro || "estadio"}`
        );

    });

}


// ==========================================
// 4. NAVEGACIÓN ENTRE SECCIONES
// ==========================================

function ocultarSecciones() {

    seccionesOcultables.forEach(seccion => {

        seccion.style.display = "none";
        seccion.classList.add("seccion-oculta");

    });

}

function mostrarSeccion(seccion) {

    if (!seccion) {
        console.error("No se encontró la sección.");
        return;
    }

    ocultarSecciones();

    seccion.style.display = "block";
    seccion.classList.remove("seccion-oculta");

    seccion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

function volverAlPerfil() {

    ocultarSecciones();

    window.location.hash = "eventos-perfil";

    const eventosPerfil = document.querySelector("#eventos-perfil");

    if (eventosPerfil) {

        eventosPerfil.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ==========================================
// 5. RENDERIZAR ARTISTAS SEGUIDOS
// ==========================================

function renderizarArtistas() {

    const filtro = document.querySelector('input[name="filtro-artista"]:checked');

    if (!filtro || !grillaArtistas) {
        return;
    }

    // Obtener artistas seguidos
    const datosSeguidos = localStorage.getItem("artistasSeguidos");

    const nombresSeguidos = datosSeguidos
        ? datosSeguidos.split("|")
        : [];

    // Filtrar artistas
    const artistasFiltrados = artistasData.filter(artista => {

        const estaSeguido = nombresSeguidos.includes(artista.nombre);

        const coincideGenero =
            filtro.value === "todos" || artista.genero === filtro.value;

        return estaSeguido && coincideGenero;

    });

    // Mostrar mensaje si no hay resultados
    if (artistasFiltrados.length === 0) {

        const mensaje = nombresSeguidos.length === 0
            ? "Aún no seguís a ningún artista. ¡Explorá el catálogo para agregarlos! 🎸"
            : "No hay artistas seguidos en este género.";

        grillaArtistas.innerHTML = `
            <li class="perfil-mensaje-vacio" style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--color-texto-secundario); font-size: 1.1rem;">
                ${mensaje}
            </li>
        `;

        return;

    }

    // Mostrar artistas seguidos
    grillaArtistas.innerHTML = artistasFiltrados.map(artista => `
        <li class="perfil-item-grid">
            <figure>
                <img
                    class="perfil-imagen-grid"
                    src="${artista.imagen}"
                    alt="Foto de ${artista.nombre}"
                >
                <figcaption class="perfil-figcaption">
                    ${artista.nombre}
                </figcaption>
            </figure>
        </li>
    `).join("");

}


// ==========================================
// 6. RENDERIZAR CATÁLOGO DE FAN PACKS
// ==========================================

function renderizarFanPacks() {

    const filtro = document.querySelector('input[name="filtro-pack"]:checked');

    if (!filtro || !grillaFanPacks) {
        return;
    }

    const packsFiltrados = fanPacks.filter(pack => {

        return filtro.value === "todos" || pack.genero === filtro.value;

    });

    if (packsFiltrados.length === 0) {

        grillaFanPacks.innerHTML = `
            <li class="perfil-mensaje-vacio">
                No hay Fan Packs disponibles en este género.
            </li>
        `;

        return;

    }

    grillaFanPacks.innerHTML = packsFiltrados.map(pack => {

        const reservaExistente = reservas.find(reserva => {
            return reserva.id === pack.id;
        });

        return `
            <li class="perfil-item-grid">

                <figure>
                    <img
                        class="perfil-imagen-grid"
                        src="${pack.imagen}"
                        alt="Fan Pack de ${pack.artista}"
                    >
                </figure>

                <h3 class="perfil-subtitulo perfil-subtitulo--pequeno">
                    ${pack.nombre}
                </h3>

                <p class="perfil-texto">Artista: ${pack.artista}</p>

                <p class="perfil-texto">${pack.descripcion}</p>

                <p class="perfil-texto">
                    Precio: $${pack.precio.toLocaleString("es-AR")}
                </p>

                <button
                    class="perfil-boton perfil-boton--pequeno boton-ver-detalle"
                    type="button"
                    data-pack-id="${pack.id}"
                >
                    Ver detalles
                </button>

                ${reservaExistente ? `

                    <div class="contenedor-acciones-carrito">

                        <span class="perfil-texto">
                            Reservado (${reservaExistente.cantidad} un.)
                        </span>

                        <button
                            class="perfil-boton perfil-boton--pequeno boton-agregar-pack"
                            type="button"
                            data-pack-id="${pack.id}"
                        >
                            Agregar otra unidad
                        </button>

                        <button
                            class="perfil-boton perfil-boton--pequeno boton-quitar-pack"
                            type="button"
                            data-pack-id="${pack.id}"
                        >
                            Sacar de carrito
                        </button>

                    </div>

                ` : `

                    <button
                        class="perfil-boton perfil-boton--pequeno boton-agregar-pack"
                        type="button"
                        data-pack-id="${pack.id}"
                    >
                        + Agregar
                    </button>

                `}

            </li>
        `;

    }).join("");

}


// ==========================================
// 7. AGREGAR FAN PACK A LAS RESERVAS
// ==========================================

function agregarFanPack(id) {

    const pack = fanPacks.find(item => item.id === Number(id));

    if (!pack) {

        console.error("No se encontró el Fan Pack:", id);
        return;

    }

    const reservaExistente = reservas.find(reserva => {
        return reserva.id === pack.id;
    });

    if (reservaExistente) {

        // Aumentar la cantidad
        reservaExistente.cantidad++;

    } else {

        // Crear una nueva reserva
        reservas.push({

            id: pack.id,
            nombre: `${pack.nombre} (${pack.artista})`,
            cantidad: 1,
            precio: pack.precio,
            modalidadRetiro: "estadio"

        });

    }

    guardarReservas();

    renderizarReservas();
    renderizarFanPacks();
    actualizarVistaDetalle(pack.id, reservas);

}


// ==========================================
// 8. QUITAR FAN PACK DE LAS RESERVAS
// ==========================================

function quitarFanPack(id) {

    const pack = fanPacks.find(item => item.id === Number(id));

    if (!pack) {

        console.error("No se encontró el Fan Pack:", id);
        return;

    }

    const indiceReserva = reservas.findIndex(reserva => {
        return reserva.id === pack.id;
    });

    if (indiceReserva !== -1) {

        // Eliminar la reserva del arreglo
        reservas.splice(indiceReserva, 1);

        // Eliminar la clave individual del almacenamiento
        localStorage.removeItem(`reservaFanPack_${pack.id}`);

    }

    renderizarReservas();
    renderizarFanPacks();
    actualizarVistaDetalle(pack.id, reservas);

}


// ==========================================
// 9. RENDERIZAR TABLA DE RESERVAS
// ==========================================

function renderizarReservas() {

    if (!tablaReservas) {
        return;
    }

    if (reservas.length === 0) {

        tablaReservas.innerHTML = `
            <tr>
                <td colspan="5">
                    <p>Todavía no tenés Fan Packs reservados.</p>

                    <a href="#detalles-fanpack" class="perfil-boton-tabla">
                        Ver Fan Packs disponibles
                    </a>
                </td>
            </tr>
        `;

        return;

    }

    tablaReservas.innerHTML = reservas.map(reserva => {

        const precioFinal = reserva.precio * reserva.cantidad;

        return `
            <tr>

                <td>${reserva.nombre}</td>

                <td>${reserva.cantidad}</td>

                <td>$${precioFinal.toLocaleString("es-AR")}</td>

                <td>
                    <span class="perfil-badge">Reservado</span>
                </td>

                <td>
                    <button
                        type="button"
                        class="perfil-boton-tabla boton-ver-pack-reservado"
                        data-pack-id="${reserva.id}"
                    >
                        Ver pack
                    </button>
                </td>

            </tr>
        `;

    }).join("");

}


// ==========================================
// 10. RENDERIZAR EVENTOS GUARDADOS
// ==========================================

function renderizarEventosGuardados() {

    if (!listaEventosGuardados) {
        return;
    }

    const favoritos = obtenerFavoritos();

    const eventosGuardados = eventos.filter(evento => {

        return favoritos.includes(Number(evento.id));

    });

    if (eventosGuardados.length === 0) {

        listaEventosGuardados.innerHTML = `
            <p class="perfil-mensaje-vacio">
                Todavía no guardaste ningún evento.
            </p>
        `;

        return;

    }

    listaEventosGuardados.innerHTML = eventosGuardados.map(evento => `

        <article class="perfil-evento-item">

            <div class="perfil-evento-info">

                <span class="perfil-evento-titulo">
                    ${evento.artista}
                </span>

                <span class="perfil-evento-detalle">
                    ${evento.recinto}
                </span>

            </div>

            <div class="perfil-evento-acciones">

                <span class="perfil-evento-fecha">
                    ${evento.fecha}
                </span>

                <button
                    type="button"
                    class="perfil-boton-tabla boton-ver-detalle-evento"
                    data-evento-id="${evento.id}"
                >
                    Ver detalles
                </button>

                <button
                    type="button"
                    class="perfil-boton-tabla boton-quitar-evento"
                    data-evento-id="${evento.id}"
                >
                    Quitar de guardados
                </button>

            </div>

        </article>

    `).join("");

}


// ==========================================
// 11. CONFIGURAR FILTROS
// ==========================================

filtrosArtistas.forEach(filtro => {

    filtro.addEventListener("change", renderizarArtistas);

});

filtrosPacks.forEach(filtro => {

    filtro.addEventListener("change", renderizarFanPacks);

});


// ==========================================
// 12. MANEJAR BOTONES Y ENLACES
// ==========================================

document.addEventListener("click", evento => {

    if (!(evento.target instanceof Element)) {
        return;
    }

    // VER DETALLES DESDE EL CATÁLOGO
    const botonDetalle = evento.target.closest(".boton-ver-detalle");

    if (botonDetalle) {

        abrirDetalleFanPack(
            botonDetalle.dataset.packId,
            reservas,
            mostrarSeccion
        );

        return;

    }

    // VER PACK DESDE LA TABLA DE RESERVAS
    const botonVerPack = evento.target.closest(".boton-ver-pack-reservado");

    if (botonVerPack) {

        abrirDetalleFanPack(
            botonVerPack.dataset.packId,
            reservas,
            mostrarSeccion
        );

        return;

    }

    // VER DETALLES DE UN EVENTO
    const botonDetalleEvento = evento.target.closest(".boton-ver-detalle-evento");

    if (botonDetalleEvento) {

        abrirDetalleEvento(
            botonDetalleEvento.dataset.eventoId,
            mostrarSeccion
        );

        return;

    }

    // AGREGAR FAN PACK
    const botonAgregar = evento.target.closest(".boton-agregar-pack");

    if (botonAgregar) {

        agregarFanPack(botonAgregar.dataset.packId);
        return;

    }

    // QUITAR FAN PACK
    const botonQuitarPack = evento.target.closest(".boton-quitar-pack");

    if (botonQuitarPack) {

        quitarFanPack(botonQuitarPack.dataset.packId);
        return;

    }

    // QUITAR EVENTO DE FAVORITOS
    const botonQuitarEvento = evento.target.closest(".boton-quitar-evento");

    if (botonQuitarEvento) {

        const id = Number(botonQuitarEvento.dataset.eventoId);

        alternarFavorito(id);

        return;

    }

    // MANEJAR ENLACES
    const enlace = evento.target.closest("a");

    if (!enlace) {
        return;
    }

    const destino = enlace.getAttribute("href");

    const destinosPermitidos = [
        "#artistas-seguidos",
        "#detalles-fanpack",
        "#detalles-evento",
        "#eventos-perfil"
    ];

    if (!destinosPermitidos.includes(destino)) {
        return;
    }

    evento.preventDefault();

    const seccion = document.querySelector(destino);

    if (!seccion) {

        console.error("No se encontró la sección:", destino);
        return;

    }

    mostrarSeccion(seccion);

    window.location.hash = destino;

});


// ==========================================
// 13. SINCRONIZAR EVENTOS, ARTISTAS Y RESERVAS
// ==========================================

window.addEventListener("favoritosActualizados", () => {

    renderizarEventosGuardados();

});

window.addEventListener("storage", evento => {

    if (evento.key === "eventosFavoritos") {

        renderizarEventosGuardados();

    }

    if (evento.key === "artistasSeguidos") {

        renderizarArtistas();

    }

    // Actualizar reservas si cambian desde otra pestaña
    if (
        evento.key &&
        evento.key.startsWith("reservaFanPack_")
    ) {

        cargarReservas();

        renderizarReservas();
        renderizarFanPacks();

    }

});


// ==========================================
// 14. INICIALIZACIÓN
// ==========================================

ocultarSecciones();

cargarReservas();

renderizarArtistas();
renderizarFanPacks();
renderizarReservas();
renderizarEventosGuardados();

inicializarModuloEventos(contenedorEventos);
