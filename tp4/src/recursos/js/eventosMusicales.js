
// =========================================
// 1. ARREGLO DE EVENTOS
// =========================================

// Almacena los eventos disponibles
export const eventos = [
    {
        id: 1,
        artista: "The Beatles",
        recinto: "Estadio Kempes",
        fecha: "25/09",
        interesados: 2500
    },
    {
        id: 2,
        artista: "BTS",
        recinto: "Vélez",
        fecha: "09/11",
        interesados: 2300
    }
];


// =========================================
// 2. GESTIÓN DE FAVORITOS
// =========================================

// Recupera los eventos favoritos almacenados
export function obtenerFavoritos() {
    const favoritosGuardados = localStorage.getItem("eventosFavoritos");

    if (!favoritosGuardados) {
        return [];
    }

    try {
        const favoritos = JSON.parse(favoritosGuardados);

        return Array.isArray(favoritos)
            ? favoritos.map(Number)
            : [];

    } catch (error) {
        console.error("Error al recuperar los favoritos:", error);
        return [];
    }
}


// Comprueba si un evento está guardado
export function estaGuardado(id) {
    const favoritos = obtenerFavoritos();

    return favoritos.includes(Number(id));
}


// Guarda o elimina un evento de favoritos
export function alternarFavorito(id) {
    const favoritos = obtenerFavoritos();
    const identificador = Number(id);
    const indiceFavorito = favoritos.indexOf(identificador);

    if (indiceFavorito === -1) {
        favoritos.push(identificador);
    } else {
        favoritos.splice(indiceFavorito, 1);
    }

    // Guardar los cambios en localStorage
    localStorage.setItem("eventosFavoritos", JSON.stringify(favoritos));

    // Avisar a otras partes de la página que cambiaron los favoritos
    window.dispatchEvent(new Event("favoritosActualizados"));

    return favoritos;
}


// =========================================
// 3. INICIALIZACIÓN DEL MÓDULO
// =========================================

// Inicializa el módulo de eventos en el contenedor indicado
export function inicializarModuloEventos(contenedor) {

    if (!contenedor) {
        return;
    }

    // Generar el HTML del módulo
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


    // =========================================
    // 4. SELECTORES DEL DOM
    // =========================================

    const seccionBusqueda = contenedor.querySelector("#seccion-eventos");

    const inputBusqueda = contenedor.querySelector("#buscar-evento");

    const filtros = contenedor.querySelectorAll(
        'input[name="filtro-evento"]'
    );

    const seccionResultados = contenedor.querySelector("#resultados-eventos");

    const grillaResultados = contenedor.querySelector(
        ".seccion-resultados__grilla"
    );


    // =========================================
    // 5. MOSTRAR EL MÓDULO
    // =========================================

    function mostrarModuloEventos() {

        seccionBusqueda.hidden = false;

        seccionBusqueda.scrollIntoView({
            behavior: "smooth"
        });
    }


    // =========================================
    // 6. RENDERIZAR EVENTOS
    // =========================================

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

                </article>
            `;
        });

        grillaResultados.innerHTML = eventosHTML;

        seccionResultados.hidden = false;
    }


    // =========================================
    // 7. APLICAR FILTROS
    // =========================================

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


    // =========================================
    // 8. EVENTOS DEL BUSCADOR Y LOS FILTROS
    // =========================================

    // Detectar cuando se escribe en el buscador
    inputBusqueda.addEventListener("input", aplicarFiltros);

    // Detectar cuando se cambia el filtro
    filtros.forEach((filtro) => {
        filtro.addEventListener("change", aplicarFiltros);
    });


    // =========================================
    // 9. GUARDAR O QUITAR FAVORITOS
    // =========================================

    grillaResultados.addEventListener("click", (evento) => {

        const boton = evento.target.closest(".boton-favorito");

        if (!boton) {
            return;
        }

        const id = Number(boton.dataset.eventoId);

        alternarFavorito(id);

        // Actualizar los resultados y el texto del botón
        aplicarFiltros();
    });


    // =========================================
    // 10. NAVEGACIÓN HACIA EL MÓDULO
    // =========================================

    // Permitir abrir el módulo desde cualquier enlace de la página
    document.addEventListener("click", (evento) => {

        const enlace = evento.target.closest(
            'a[href="#seccion-eventos"]'
        );

        if (!enlace) {
            return;
        }

        evento.preventDefault();

        mostrarModuloEventos();
    });


    // Si se ingresa directamente con el identificador en la URL
    if (window.location.hash === "#seccion-eventos") {
        mostrarModuloEventos();
    }
}

