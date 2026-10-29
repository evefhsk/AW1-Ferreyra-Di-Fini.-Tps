//Importa el módulo que contiene el catalogo
import { fanPacks } from "./catalogo.js";

// Arreglo para almacenar los artistas que sigue el usuario
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

// Arreglo temporal para almacenar los Fan Packs reservados
const reservas = [];

// Llama a los elementos HTML que se van a utilizar
const filtrosArtistas = document.querySelectorAll(
    'input[name="filtro-artista"]'
);

const filtrosPacks = document.querySelectorAll(
    'input[name="filtro-pack"]'
);

const grillaArtistas = document.querySelector("#grilla-artistas");
const grillaFanPacks = document.querySelector("#grilla-fanpacks");
const tablaReservas = document.querySelector("#tabla-reservas");

// Renderiza los artistas seguidos
function renderizarArtistas() {
    const filtroSeleccionado = document.querySelector(
        'input[name="filtro-artista"]:checked'
    ).value;

    // Filtra los artistas según el género seleccionado
    const artistasFiltrados = artistasSeguidos.filter((artista) => {
        if (filtroSeleccionado === "todos") {
            return true;
        }

        return artista.genero === filtroSeleccionado;
    });

    let artistasHTML = "";

    if (artistasFiltrados.length === 0) {
        artistasHTML = `
            <li class="perfil-mensaje-vacio">
                No hay artistas seguidos en este género.
            </li>
        `;
    } else {
        artistasFiltrados.forEach((artista) => {
            artistasHTML += `
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
            `;
        });
    }

    grillaArtistas.innerHTML = artistasHTML;
}

// Renderiza el catálogo de Fan Packs
function renderizarFanPacks() {
    const filtroSeleccionado = document.querySelector(
        'input[name="filtro-pack"]:checked'
    ).value;

    // Filtra los Fan Packs importados desde fanpacks.js
    const packsFiltrados = fanPacks.filter((pack) => {
        if (filtroSeleccionado === "todos") {
            return true;
        }

        return pack.genero === filtroSeleccionado;
    });

    let packsHTML = "";

    if (packsFiltrados.length === 0) {
        packsHTML = `
            <p class="perfil-mensaje-vacio">
                No hay Fan Packs disponibles en este género.
            </p>
        `;
    } else {
        packsFiltrados.forEach((pack) => {
            packsHTML += `
                <article class="perfil-item-grid">

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
                        class="perfil-boton perfil-boton--pequeno boton-agregar-pack"
                        type="button"
                        data-pack-id="${pack.id}"
                    >
                        + Agregar
                    </button>

                </article>
            `;
        });
    }

    // Muestra los Fan Packs en el HTML
    grillaFanPacks.innerHTML = packsHTML;

    // Configura los eventos de los botones generados
    configurarBotonesAgregar();
}

// Renderiza los Fan Packs reservados en la tabla
function renderizarReservas() {
    let reservasHTML = "";

    reservas.forEach((reserva) => {
        const precioFinal = reserva.precio * reserva.cantidad;

        reservasHTML += `
            <tr>
                <td>${reserva.nombre}</td>
                <td>${reserva.cantidad}</td>
                <td>$${precioFinal.toLocaleString("es-AR")}</td>
                <td>
                    <span class="perfil-badge">Reservado</span>
                </td>
                <td>
                    <a href="#detalles-fanpack" class="perfil-boton-tabla">
                        Ver pack
                    </a>
                </td>
            </tr>
        `;
    });

    // Si no hay reservas, muestra un mensaje
    if (reservas.length === 0) {
        reservasHTML = `
            <tr>
                <td colspan="5">
                    <p>Todavía no tenés Fan Packs reservados.</p>
                    <a href="#detalles-fanpack" class="perfil-boton-tabla">
                        Ver Fan Packs disponibles
                    </a>
                </td>
            </tr>
        `;
    }

    tablaReservas.innerHTML = reservasHTML;
}

// Configura los botones para agregar Fan Packs
function configurarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(
        ".boton-agregar-pack"
    );

    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const identificadorPack = Number(boton.dataset.packId);

            // Busca el Fan Pack seleccionado en el módulo importado
            const packSeleccionado = fanPacks.find((pack) => {
                return pack.id === identificadorPack;
            });

            // Verifica que el Fan Pack exista
            if (!packSeleccionado) {
                return;
            }

            // Busca si el Fan Pack ya está reservado
            const reservaExistente = reservas.find((reserva) => {
                return reserva.id === identificadorPack;
            });

            if (reservaExistente) {
                // Aumenta la cantidad si ya está reservado
                reservaExistente.cantidad++;
            } else {
                // Agrega el Fan Pack a las reservas
                reservas.push({
                    id: packSeleccionado.id,
                    nombre: `${packSeleccionado.nombre} (${packSeleccionado.artista})`,
                    cantidad: 1,
                    precio: packSeleccionado.precio
                });
            }

            // Actualiza la tabla de reservas
            renderizarReservas();
        });
    });
}

// Filtra los artistas cuando cambia la opción seleccionada
filtrosArtistas.forEach((filtro) => {
    filtro.addEventListener("change", renderizarArtistas);
});

// Filtra los Fan Packs cuando cambia la opción seleccionada
filtrosPacks.forEach((filtro) => {
    filtro.addEventListener("change", renderizarFanPacks);
});

// Secciones que se pueden ocultar durante la navegación
const seccionesOcultables = document.querySelectorAll(
    "#artistas-seguidos, " +
    "#detalles-fanpack, " +
    "#detalles-evento-bts, " +
    "#detalles-evento-coldplay"
);

// Oculta las secciones al cargar la página
seccionesOcultables.forEach((seccion) => {
    seccion.style.display = "none";
});

// Controla la navegación entre las secciones del perfil
document.addEventListener("click", (evento) => {
    const enlace = evento.target.closest("a");

    if (!enlace) {
        return;
    }

    const identificador = enlace.getAttribute("href");

    const destinosPermitidos = [
        "#artistas-seguidos",
        "#detalles-fanpack",
        "#detalles-evento-bts",
        "#detalles-evento-coldplay",
        "#eventos-perfil"
    ];

    if (!destinosPermitidos.includes(identificador)) {
        return;
    }

    evento.preventDefault();

    // Oculta las secciones que pueden alternarse
    seccionesOcultables.forEach((seccion) => {
        seccion.style.display = "none";
        seccion.classList.add("seccion-oculta");
    });

    const destino = document.querySelector(identificador);

    if (!destino) {
        console.error("No se encontró la sección:", identificador);
        return;
    }

    // Los eventos del perfil ya están visibles al volver
    if (identificador !== "#eventos-perfil") {
        destino.style.display = "block";
        destino.classList.remove("seccion-oculta");
    }

    // Actualiza la dirección y desplaza la página
    window.location.hash = identificador;

    destino.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Renderiza los artistas, los Fan Packs y las reservas al cargar
renderizarArtistas();
renderizarFanPacks();
renderizarReservas();
