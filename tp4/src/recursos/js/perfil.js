
import { fanPacks } from "./catalogo.js";

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


// 1. ARTISTAS QUE SIGUE EL USUARIO

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


// 2. VARIABLES Y ELEMENTOS DEL HTML

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

const listaEventosGuardados = document.querySelector(
    "#lista-eventos-guardados"
);

const contenedorEventos = document.querySelector(
    "#contenedor-modulo-eventos"
);

const seccionesOcultables = document.querySelectorAll(
    "#artistas-seguidos, " +
    "#detalles-fanpack, " +
    "#detalles-evento, " +
    "#vista-detalle-fanpack"
);


// 3. NAVEGACIÓN ENTRE SECCIONES

function ocultarSecciones() {
    seccionesOcultables.forEach((seccion) => {
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


// 4. RENDERIZAR ARTISTAS SEGUIDOS

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


// 5. RENDERIZAR CATÁLOGO DE FAN PACKS

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

    grillaFanPacks.innerHTML = packsFiltrados.map((pack) => {
        const reservaExistente = reservas.find((reserva) => {
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


// 6. AGREGAR FAN PACK A LAS RESERVAS

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
    renderizarFanPacks();

    actualizarVistaDetalle(pack.id, reservas);
}


// 7. QUITAR FAN PACK DE LAS RESERVAS

function quitarFanPack(id) {
    const pack = fanPacks.find((item) => {
        return item.id === Number(id);
    });

    if (!pack) {
        console.error("No se encontró el Fan Pack:", id);
        return;
    }

    const indiceReserva = reservas.findIndex((reserva) => {
        return reserva.id === pack.id;
    });

    if (indiceReserva !== -1) {
        reservas.splice(indiceReserva, 1);
    }

    renderizarReservas();
    renderizarFanPacks();

    actualizarVistaDetalle(pack.id, reservas);
}


// 8. RENDERIZAR TABLA DE RESERVAS

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


// 9. RENDERIZAR PRÓXIMOS EVENTOS GUARDADOS

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


// 10. CONFIGURAR FILTROS

filtrosArtistas.forEach((filtro) => {
    filtro.addEventListener("change", renderizarArtistas);
});

filtrosPacks.forEach((filtro) => {
    filtro.addEventListener("change", renderizarFanPacks);
});


// 11. MANEJAR BOTONES Y ENLACES

document.addEventListener("click", (evento) => {

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
    const botonVerPack = evento.target.closest(
        ".boton-ver-pack-reservado"
    );

    if (botonVerPack) {
        abrirDetalleFanPack(
            botonVerPack.dataset.packId,
            reservas,
            mostrarSeccion
        );

        return;
    }

    // VER DETALLES DE UN EVENTO
    const botonDetalleEvento = evento.target.closest(
        ".boton-ver-detalle-evento"
    );

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

    // SACAR FAN PACK
    const botonQuitarPack = evento.target.closest(".boton-quitar-pack");

    if (botonQuitarPack) {
        quitarFanPack(botonQuitarPack.dataset.packId);
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


// 12. SINCRONIZAR LOS EVENTOS FAVORITOS

window.addEventListener("favoritosActualizados", () => {
    renderizarEventosGuardados();
});

window.addEventListener("storage", (evento) => {
    if (evento.key === "eventosFavoritos") {
        renderizarEventosGuardados();
    }
});


// 13. INICIALIZACIÓN

ocultarSecciones();

renderizarArtistas();
renderizarFanPacks();
renderizarReservas();
renderizarEventosGuardados();

inicializarModuloEventos(contenedorEventos);
