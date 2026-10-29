
import { fanPacks } from "./catalogo.js";

import {
    eventos,
    obtenerFavoritos,
    alternarFavorito,
    inicializarModuloEventos
} from "./eventosMusicales.js";


// ==================================================
// 1. ARTISTAS QUE SIGUE EL USUARIO
// ==================================================

const artistasSeguidos = [
    {
        id: 1,
        nombre: "BTS",
        genero: "pop",
        imagen: "./recursos/imagenes/artistas/bts.jpeg"
    },
    {
        id: 2,
        nombre: "Coldplay",
        genero: "pop",
        imagen: "./recursos/imagenes/artistas/coldplay.jpeg"
    },
    {
        id: 3,
        nombre: "The Beatles",
        genero: "rock",
        imagen: "./recursos/imagenes/artistas/thebeatles.jpeg"
    }
];


// ==================================================
// 2. VARIABLES Y ELEMENTOS DEL HTML
// ==================================================

const reservas = [];

const filtrosArtistas = document.querySelectorAll(
    'input[name="filtro-artista"]'
);

const filtrosPacks = document.querySelectorAll(
    'input[name="filtro-pack"]'
);

const grillaArtistas = document.querySelector("#grilla-artistas");
const grillaFanPacks = document.querySelector("#grilla-fanpacks");
const tablaReservas = document.querySelector("#tabla-reservas");

// Contenedor de próximos eventos
const listaEventosGuardados = document.querySelector(
    "#lista-eventos-guardados"
);

// Contenedor del módulo reutilizable de eventos
const contenedorEventos = document.querySelector(
    "#contenedor-modulo-eventos"
);

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

const botonAgregarDetalle = document.querySelector(
    "#boton-agregar-detalle-fanpack"
);

const estadoReservaDetalle = document.querySelector(
    "#estado-reserva-fanpack"
);

// Secciones que se muestran y ocultan durante la navegación
const seccionesOcultables = document.querySelectorAll(
    "#artistas-seguidos, " +
    "#detalles-fanpack, " +
    "#detalles-evento-bts, " +
    "#detalles-evento-coldplay, " +
    "#vista-detalle-fanpack"
);


// ==================================================
// 3. NAVEGACIÓN ENTRE SECCIONES
// ==================================================

// Oculta las secciones secundarias
function ocultarSecciones() {
    seccionesOcultables.forEach((seccion) => {
        seccion.style.display = "none";
        seccion.classList.add("seccion-oculta");
    });
}

// Muestra una sección determinada
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

// Vuelve al perfil principal
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


// ==================================================
// 4. RENDERIZAR ARTISTAS SEGUIDOS
// ==================================================

function renderizarArtistas() {
    const filtro = document.querySelector(
        'input[name="filtro-artista"]:checked'
    );

    if (!filtro || !grillaArtistas) {
        return;
    }

    const artistasFiltrados = artistasSeguidos.filter((artista) => {
        return filtro.value === "todos" ||
            artista.genero === filtro.value;
    });

    if (artistasFiltrados.length === 0) {
        grillaArtistas.innerHTML = `
            <li class="perfil-mensaje-vacio">
                No hay artistas seguidos en este género.
            </li>
        `;

        return;
    }

    grillaArtistas.innerHTML = artistasFiltrados.map((artista) => `
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


// ==================================================
// 5. RENDERIZAR CATÁLOGO DE FAN PACKS
// ==================================================

function renderizarFanPacks() {
    const filtro = document.querySelector(
        'input[name="filtro-pack"]:checked'
    );

    if (!filtro || !grillaFanPacks) {
        return;
    }

    const packsFiltrados = fanPacks.filter((pack) => {
        return filtro.value === "todos" ||
            pack.genero === filtro.value;
    });

    if (packsFiltrados.length === 0) {
        grillaFanPacks.innerHTML = `
            <li class="perfil-mensaje-vacio">
                No hay Fan Packs disponibles en este género.
            </li>
        `;

        return;
    }

    grillaFanPacks.innerHTML = packsFiltrados.map((pack) => `
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

            <p class="perfil-texto">
                Artista: ${pack.artista}
            </p>

            <p class="perfil-texto">
                ${pack.descripcion}
            </p>

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

            <button
                class="perfil-boton perfil-boton--pequeno boton-agregar-pack"
                type="button"
                data-pack-id="${pack.id}"
            >
                + Agregar
            </button>

        </li>
    `).join("");
}


// ==================================================
// 6. MOSTRAR DETALLE DE UN FAN PACK
// ==================================================

function abrirDetalleFanPack(id) {
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
        !botonAgregarDetalle ||
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

    botonAgregarDetalle.dataset.packId = pack.id;

    const reservaExistente = reservas.find((reserva) => {
        return reserva.id === pack.id;
    });

    estadoReservaDetalle.textContent = reservaExistente
        ? "Reservado"
        : "Disponible";

    mostrarSeccion(vistaDetalleFanPack);

    window.location.hash = "vista-detalle-fanpack";
}


// ==================================================
// 7. AGREGAR FAN PACK A LAS RESERVAS
// ==================================================

function agregarFanPack(id) {
    const pack = fanPacks.find((item) => {
        return item.id === Number(id);
    });

    if (!pack) {
        console.error("No se encontró el Fan Pack:", id);
        return;
    }

    const reservaExistente = reservas.find((reserva) => {
        return reserva.id === pack.id;
    });

    if (reservaExistente) {
        reservaExistente.cantidad++;
    } else {
        reservas.push({
            id: pack.id,
            nombre: `${pack.nombre} (${pack.artista})`,
            cantidad: 1,
            precio: pack.precio
        });
    }

    renderizarReservas();

    const detalleVisible = vistaDetalleFanPack &&
        !vistaDetalleFanPack.classList.contains("seccion-oculta");

    if (detalleVisible && estadoReservaDetalle) {
        estadoReservaDetalle.textContent = "Reservado";
    }
}


// ==================================================
// 8. RENDERIZAR TABLA DE RESERVAS
// ==================================================

function renderizarReservas() {
    if (!tablaReservas) {
        return;
    }

    if (reservas.length === 0) {
        tablaReservas.innerHTML = `
            <tr>
                <td colspan="5">

                    <p>
                        Todavía no tenés Fan Packs reservados.
                    </p>

                    <a
                        href="#detalles-fanpack"
                        class="perfil-boton-tabla"
                    >
                        Ver Fan Packs disponibles
                    </a>

                </td>
            </tr>
        `;

        return;
    }

    tablaReservas.innerHTML = reservas.map((reserva) => {
        const precioFinal = reserva.precio * reserva.cantidad;

        return `
            <tr>

                <td>${reserva.nombre}</td>

                <td>${reserva.cantidad}</td>

                <td>
                    $${precioFinal.toLocaleString("es-AR")}
                </td>

                <td>
                    <span class="perfil-badge">
                        Reservado
                    </span>
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


// ==================================================
// 9. RENDERIZAR PRÓXIMOS EVENTOS GUARDADOS
// ==================================================

function renderizarEventosGuardados() {
    if (!listaEventosGuardados) {
        return;
    }

    const favoritos = obtenerFavoritos();

    const eventosGuardados = eventos.filter((evento) => {
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

    listaEventosGuardados.innerHTML = eventosGuardados.map((evento) => `
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
                    class="perfil-boton-tabla boton-quitar-evento"
                    data-evento-id="${evento.id}"
                >
                    Quitar de guardados
                </button>

            </div>

        </article>
    `).join("");
}


// ==================================================
// 10. CONFIGURAR FILTROS
// ==================================================

filtrosArtistas.forEach((filtro) => {
    filtro.addEventListener("change", renderizarArtistas);
});

filtrosPacks.forEach((filtro) => {
    filtro.addEventListener("change", renderizarFanPacks);
});


// ==================================================
// 11. MANEJAR BOTONES Y ENLACES
// ==================================================

document.addEventListener("click", (evento) => {

    // Comprobar que el clic provenga de un elemento HTML
    if (!(evento.target instanceof Element)) {
        return;
    }

    // VER DETALLES DESDE EL CATÁLOGO
    const botonDetalle = evento.target.closest(".boton-ver-detalle");

    if (botonDetalle) {
        abrirDetalleFanPack(botonDetalle.dataset.packId);
        return;
    }

    // VER PACK DESDE LA TABLA DE RESERVAS
    const botonVerPack = evento.target.closest(
        ".boton-ver-pack-reservado"
    );

    if (botonVerPack) {
        abrirDetalleFanPack(botonVerPack.dataset.packId);
        return;
    }

    // AGREGAR DESDE EL CATÁLOGO
    const botonAgregar = evento.target.closest(".boton-agregar-pack");

    if (botonAgregar) {
        agregarFanPack(botonAgregar.dataset.packId);
        return;
    }

    // AGREGAR DESDE EL DETALLE
    const botonAgregarDetalle = evento.target.closest(
        "#boton-agregar-detalle-fanpack"
    );

    if (botonAgregarDetalle) {
        agregarFanPack(botonAgregarDetalle.dataset.packId);
        return;
    }

    // QUITAR EVENTO DE FAVORITOS
    const botonQuitarEvento = evento.target.closest(
        ".boton-quitar-evento"
    );

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
        "#detalles-evento-bts",
        "#detalles-evento-coldplay",
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


// ==================================================
// 12. SINCRONIZAR LOS EVENTOS FAVORITOS
// ==================================================

// Actualizar la lista cuando cambian los favoritos en esta página
window.addEventListener("favoritosActualizados", () => {
    renderizarEventosGuardados();
});

// Actualizar la lista cuando cambian los favoritos en otra pestaña
window.addEventListener("storage", (evento) => {
    if (evento.key === "eventosFavoritos") {
        renderizarEventosGuardados();
    }
});


// ==================================================
// 13. INICIALIZACIÓN
// ==================================================

// Ocultar las secciones secundarias
ocultarSecciones();

// Renderizar el contenido inicial
renderizarArtistas();
renderizarFanPacks();
renderizarReservas();
renderizarEventosGuardados();

// Inicializar el módulo reutilizable de eventos
inicializarModuloEventos(contenedorEventos);
