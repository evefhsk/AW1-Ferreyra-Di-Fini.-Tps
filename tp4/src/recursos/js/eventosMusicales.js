
// ARREGLO DE EVENTOS

export const eventos = [
    {
        id: 1,
        artista: "The Beatles",
        recinto: "Estadio Kempes",
        fecha: "25/09",
        interesados: 2500,
        imagen: "./recursos/imagenes/artistas/thebeatlestour.jpg",

        detalles: {
            aperturaPuertas: "17:00",
            inicioShow: "21:00",

            accesos: [
                "Portón Norte",
                "Portón Sur"
            ],

            elementosPermitidos: [
                "Riñoneras",
                "Banderas pequeñas sin mástil",
                "Cargadores portátiles"
            ],

            retiroFanPack: "Desde las 16:00",

            setlist: [
                "Come Together",
                "Let It Be",
                "Hey Jude",
                "Yesterday"
            ]
        }
    },

    {
        id: 2,
        artista: "BTS",
        recinto: "Vélez",
        fecha: "09/11",
        interesados: 2300,
        imagen: "./recursos/imagenes/artistas/btstour.jpg",

        detalles: {
            aperturaPuertas: null,
            inicioShow: null,

            accesos: [],

            elementosPermitidos: [
                "Army Bomb oficial",
                "Banners de papel",
                "Riñoneras"
            ],

            retiroFanPack: null,

            setlist: [
                "Dynamite",
                "Butter",
                "Boy With Luv",
                "Fake Love"
            ]
        }
    }
];


// OBTENER LOS EVENTOS FAVORITOS DEL USUARIO

export function obtenerFavoritos() {
    const favoritosGuardados = localStorage.getItem("eventosFavoritos");

    if (!favoritosGuardados) {
        return [];
    }

    return favoritosGuardados
        .split(",")
        .map(Number)
        .filter(id => !isNaN(id));
}


// COMPROBAR SI UN EVENTO ESTÁ GUARDADO

export function estaGuardado(id) {
    const favoritos = obtenerFavoritos();

    return favoritos.includes(Number(id));
}


// GUARDAR O ELIMINAR UN EVENTO DE FAVORITOS

export function alternarFavorito(id) {
    const favoritos = obtenerFavoritos();
    const identificador = Number(id);
    const indiceFavorito = favoritos.indexOf(identificador);

    if (indiceFavorito === -1) {
        favoritos.push(identificador);
    } else {
        favoritos.splice(indiceFavorito, 1);
    }

    localStorage.setItem("eventosFavoritos", favoritos.join(","));

    window.dispatchEvent(new Event("favoritosActualizados"));

    return favoritos;
}


// INICIALIZAR EL MÓDULO DE EVENTOS

export function inicializarModuloEventos(contenedor) {

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = `
        <section class="seccion-filtro"
            id="seccion-eventos"
            aria-labelledby="titulo-eventos"
            hidden>

            <h2 class="seccion-filtro__titulo" id="titulo-eventos">
                Descubre los eventos top del año
            </h2>

            <form class="formulario-busqueda" action="#" method="get" role="search">

                <label class="formulario-busqueda__label" for="buscar-evento">
                    Buscar evento:
                </label>

                <input
                    class="formulario-busqueda__input"
                    type="search"
                    id="buscar-evento"
                    name="q"
                    placeholder="Ej: Estadio Kempes, BTS..."
                >

                <fieldset class="formulario-busqueda__filtros">

                    <legend class="formulario-busqueda__leyenda">
                        Filtrar por:
                    </legend>

                    <label class="formulario-busqueda__opcion">
                        <input type="radio" name="filtro-evento" value="popular">
                        Popular
                    </label>

                    <label class="formulario-busqueda__opcion">
                        <input type="radio" name="filtro-evento" value="artista">
                        Artista
                    </label>

                    <label class="formulario-busqueda__opcion">
                        <input type="radio" name="filtro-evento" value="recinto">
                        Recinto
                    </label>

                    <label class="formulario-busqueda__opcion">
                        <input type="radio" name="filtro-evento" value="fecha">
                        Fecha
                    </label>

                </fieldset>

            </form>

        </section>

        <section class="seccion-resultados"
            id="resultados-eventos"
            aria-labelledby="titulo-resultados"
            hidden>

            <h2 class="seccion-resultados__titulo" id="titulo-resultados">
                Resultados
            </h2>

            <div class="seccion-resultados__grilla"></div>

        </section>
    `;

    const seccionBusqueda = contenedor.querySelector("#seccion-eventos");

    const inputBusqueda = contenedor.querySelector("#buscar-evento");

    const filtros = contenedor.querySelectorAll(
        'input[name="filtro-evento"]'
    );

    const seccionResultados = contenedor.querySelector("#resultados-eventos");

    const grillaResultados = contenedor.querySelector(
        ".seccion-resultados__grilla"
    );


    // MOSTRAR EL MÓDULO

    function mostrarModuloEventos() {
        seccionBusqueda.hidden = false;

        seccionBusqueda.scrollIntoView({
            behavior: "smooth"
        });
    }


    // RENDERIZAR TARJETAS DE EVENTOS

    function renderizarEventos(listaEventos) {

        grillaResultados.innerHTML = "";

        if (listaEventos.length === 0) {
            seccionResultados.hidden = true;
            return;
        }

        let eventosHTML = "";

        listaEventos.forEach((evento) => {

            const guardado = estaGuardado(evento.id);

            eventosHTML += `
                <article class="tarjeta-evento">

                    <h3 class="tarjeta-evento__ranking">
                        ${evento.artista}
                    </h3>

                    <ul class="tarjeta-evento__detalles">

                        <li class="tarjeta-evento__item">
                            Recinto: ${evento.recinto}
                        </li>

                        <li class="tarjeta-evento__item">
                            Fecha: ${evento.fecha}
                        </li>

                        <li class="tarjeta-evento__item">
                            ${evento.interesados} interesados
                        </li>

                    </ul>

                    <button
                        class="boton boton--secundario boton-favorito"
                        type="button"
                        data-evento-id="${evento.id}"
                    >
                        ${guardado ? "Quitar de guardados" : "Guardar evento"}
                    </button>

                    <button
                        class="boton boton--secundario boton-ver-detalle-evento"
                        type="button"
                        data-evento-id="${evento.id}"
                    >
                        Ver detalles
                    </button>

                </article>
            `;
        });

        grillaResultados.innerHTML = eventosHTML;

        seccionResultados.hidden = false;
    }


    // FILTRAR Y ORDENAR EVENTOS

    function aplicarFiltros() {

        const filtroSeleccionado = contenedor.querySelector(
            'input[name="filtro-evento"]:checked'
        );

        const textoBusqueda = inputBusqueda.value.toLowerCase().trim();

        if (!filtroSeleccionado) {
            seccionResultados.hidden = true;
            return;
        }

        const tipoFiltro = filtroSeleccionado.value;

        let eventosFiltrados = [];

        if (tipoFiltro === "popular") {

            eventosFiltrados = [...eventos].sort(
                (a, b) => b.interesados - a.interesados
            );

        } else {

            if (textoBusqueda === "") {
                seccionResultados.hidden = true;
                return;
            }

            if (tipoFiltro === "artista") {

                eventosFiltrados = eventos.filter((evento) =>
                    evento.artista.toLowerCase().includes(textoBusqueda)
                );

            } else if (tipoFiltro === "recinto") {

                eventosFiltrados = eventos.filter((evento) =>
                    evento.recinto.toLowerCase().includes(textoBusqueda)
                );

            } else if (tipoFiltro === "fecha") {

                eventosFiltrados = eventos.filter((evento) =>
                    evento.fecha.toLowerCase().includes(textoBusqueda)
                );
            }
        }

        renderizarEventos(eventosFiltrados);
    }


    // ESCUCHAR BUSCADOR Y FILTROS

    inputBusqueda.addEventListener("input", aplicarFiltros);

    filtros.forEach((filtro) => {
        filtro.addEventListener("change", aplicarFiltros);
    });


    // GESTIONAR FAVORITOS

    grillaResultados.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element)) {
            return;
        }

        const boton = evento.target.closest(".boton-favorito");

        if (!boton) {
            return;
        }

        const id = Number(boton.dataset.eventoId);

        alternarFavorito(id);

        aplicarFiltros();
    });


    // ABRIR DETALLES DEL EVENTO

    grillaResultados.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element)) {
            return;
        }

        const botonDetalle = evento.target.closest(
            ".boton-ver-detalle-evento"
        );

        if (!botonDetalle) {
            return;
        }

        const id = botonDetalle.dataset.eventoId;

        contenedor.dispatchEvent(
            new CustomEvent("abrirDetalleEvento", {
                detail: { id }
            })
        );
    });


    // ABRIR EL MÓDULO DESDE EL ENLACE

    document.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element)) {
            return;
        }

        const enlace = evento.target.closest(
            'a[href="#seccion-eventos"]'
        );

        if (!enlace) {
            return;
        }

        evento.preventDefault();

        mostrarModuloEventos();
    });


    if (window.location.hash === "#seccion-eventos") {
        mostrarModuloEventos();
    }
}
