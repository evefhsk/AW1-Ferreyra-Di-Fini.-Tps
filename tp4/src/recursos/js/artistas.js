

// ==========================================
// 1. IMPORTACIONES DE MÓDULOS
// ==========================================

import { artistasData } from './datosArtistas.js';
import { renderizarArtistas, filtrarArtistas } from './funcionesArtistas.js';
import { fanPacks } from './catalogo.js';


// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================

// Catálogo y filtros
const contenedorArtistas = document.getElementById("artistas-app");
const catalogoSeccion = document.getElementById("catalogo-seccion");
const detalleSeccion = document.getElementById("detalle-artista");
const inputBusqueda = document.getElementById("buscar-artista");
const filtrosGenero = document.querySelectorAll('input[name="genero"]');

// Detalle del artista
const detalleImagen = document.getElementById("detalle-artista-imagen");
const detalleNombre = document.getElementById("detalle-artista-nombre");
const detalleDescripcion = document.getElementById("detalle-artista-descripcion");
const detalleRecinto = document.getElementById("detalle-artista-recinto");
const detalleFecha = document.getElementById("detalle-artista-fecha");
const detallePuertas = document.getElementById("detalle-artista-puertas");
const detalleInicio = document.getElementById("detalle-artista-inicio");
const detalleAccesos = document.getElementById("detalle-artista-accesos");
const detalleElementos = document.getElementById("detalle-artista-elementos");
const detalleSetlist = document.getElementById("detalle-artista-setlist");

// Fan Packs
const contenedorPack = document.getElementById("contenedor-fanpack-dinamico");
const listaFanpacksArtista = document.getElementById("lista-fanpacks-artista");
const btnSeguir = document.querySelector(".boton-accion-negro");


// ==========================================
// 3. RENDERIZADO INICIAL DEL CATÁLOGO
// ==========================================

renderizarArtistas(contenedorArtistas, artistasData);


// ==========================================
// 4. MOSTRAR DETALLE DE UN ARTISTA
// ==========================================

function mostrarDetalleArtista(id) {

    const artista = artistasData.find(a => a.id === Number(id));

    if (!artista) return;

    // A. Información del artista
    detalleImagen.src = artista.detalleImagen || artista.imagen;
    detalleImagen.alt = `Tour de ${artista.nombre}`;

    detalleNombre.textContent = artista.nombre;
    detalleDescripcion.textContent = artista.descripcion;
    detalleRecinto.textContent = artista.recinto;
    detalleFecha.textContent = artista.fecha;
    detallePuertas.textContent = artista.puertas;
    detalleInicio.textContent = artista.inicio;
    detalleAccesos.textContent = artista.accesos;
    detalleElementos.textContent = artista.elementos;

    // B. Setlist
    detalleSetlist.innerHTML = artista.setlist
        .map(cancion => `<li class="canciones-lista__item">${cancion}</li>`)
        .join("");

    // C. Buscar Fan Packs del artista
    const fanpacksDelArtista = fanPacks.filter(pack => {
        return pack.artista === artista.nombre;
    });

    // D. Mostrar Fan Packs
    if (contenedorPack && listaFanpacksArtista) {

        contenedorPack.style.display = "block";

        if (fanpacksDelArtista.length > 0) {

            listaFanpacksArtista.innerHTML = fanpacksDelArtista.map(pack => `
                <div class="pack-compra">

                    <div class="pack-compra__cabecera">

                        <div class="pack-compra__miniatura">
                            <img src="${pack.imagen}" alt="${pack.nombre}">
                        </div>

                        <div class="pack-compra__datos">
                            <h4 class="pack-compra__nombre">${pack.nombre}</h4>
                            <p class="pack-compra__descripcion">${pack.descripcion}</p>
                        </div>

                    </div>

                    <form class="pack-compra__form" data-id-pack="${pack.id}">

                        <label class="visually-hidden" for="retiro-${pack.id}">
                            Modalidad de retiro
                        </label>

                        <select
                            class="pack-compra__select"
                            name="modalidad-retiro"
                            id="retiro-${pack.id}"
                            required
                        >
                            <option value="estadio">
                                Retiro: En estadio (Día del show)
                            </option>

                            <option value="domicilio">
                                Envío postal a domicilio
                            </option>
                        </select>

                        <div class="pack-compra__pie">

                            <span class="pack-compra__precio">
                                $${Number(pack.precio).toLocaleString("es-AR")}
                            </span>

                            <button class="boton-pack-agregar" type="submit">
                                + Agregar al Carrito
                            </button>

                        </div>

                    </form>

                </div>
            `).join("");

        } else {

            listaFanpacksArtista.innerHTML = `
                <p>Aún no hay Fan Packs disponibles para esta gira.</p>
            `;

        }
    }

    // E. Mostrar detalle
    catalogoSeccion.classList.add("seccion-oculta");
    detalleSeccion.classList.remove("seccion-oculta");

    detalleSeccion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    window.location.hash = "detalle-artista";

    cargarEstadoSeguir();
}


// ==========================================
// 5. VOLVER AL CATÁLOGO
// ==========================================

function volverAlCatalogo(evento) {

    evento.preventDefault();

    detalleSeccion.classList.add("seccion-oculta");
    catalogoSeccion.classList.remove("seccion-oculta");

    window.location.hash = "catalogo-seccion";
}


// ==========================================
// 6. ACTUALIZAR GRILLA DE ARTISTAS
// ==========================================

function actualizarGrillaArtistas(texto, generoActivo) {

    const artistasFiltrados = filtrarArtistas(
        artistasData,
        generoActivo,
        texto
    );

    if (artistasFiltrados.length === 0) {

        contenedorArtistas.innerHTML = `
            <p style="grid-column: 1 / -1; text-align: center; color: var(--color-texto-secundario); padding: 40px 0; font-size: 1.1rem;">
                No se encontraron artistas con ese nombre o género. ¡Intenta con "Coldplay", "BTS" o "The Beatles"! 🎸
            </p>
        `;

    } else {

        renderizarArtistas(contenedorArtistas, artistasFiltrados);

    }
}


// ==========================================
// 7. EVENTOS DE BÚSQUEDA Y FILTROS
// ==========================================

inputBusqueda.addEventListener("input", () => {

    const texto = inputBusqueda.value;

    const generoActivo = document.querySelector(
        'input[name="genero"]:checked'
    ).value;

    actualizarGrillaArtistas(texto, generoActivo);

});

filtrosGenero.forEach(filtro => {

    filtro.addEventListener("change", () => {

        const generoActivo = document.querySelector(
            'input[name="genero"]:checked'
        ).value;

        const texto = inputBusqueda.value;

        actualizarGrillaArtistas(texto, generoActivo);

    });

});


// ==========================================
// 8. DELEGACIÓN DE EVENTOS
// ==========================================

document.addEventListener("click", evento => {

    if (!(evento.target instanceof Element)) return;

    // Ver detalles del artista
    const botonVer = evento.target.closest(".tarjeta-artista__boton");

    if (botonVer) {

        mostrarDetalleArtista(botonVer.dataset.id);
        return;

    }

    // Volver al catálogo
    const botonVolver = evento.target.closest(".boton-volver");

    if (botonVolver) {

        volverAlCatalogo(evento);
        return;

    }

    // Botón Seguir
    const btnSeguirClick = evento.target.closest(".boton-accion-negro");

    if (btnSeguirClick && !detalleSeccion.classList.contains("seccion-oculta")) {

        const nombreArtista = detalleNombre.textContent;

        let seguidos = localStorage.getItem("artistasSeguidos");

        seguidos = seguidos ? seguidos.split("|") : [];

        if (seguidos.includes(nombreArtista)) {

            // Dejar de seguir
            seguidos = seguidos.filter(a => a !== nombreArtista);

            btnSeguirClick.textContent = "+ Seguir";
            btnSeguirClick.style.backgroundColor = "#000000";

        } else {

            // Seguir
            seguidos.push(nombreArtista);

            btnSeguirClick.textContent = "✓ Siguiendo";
            btnSeguirClick.style.backgroundColor = "var(--color-primario-activo)";

        }

        localStorage.setItem(
            "artistasSeguidos",
            seguidos.join("|")
        );

    }

});


// ==========================================
// 9. CARGAR ESTADO DEL BOTÓN SEGUIR
// ==========================================

function cargarEstadoSeguir() {

    if (!btnSeguir) return;

    const nombreArtista = detalleNombre.textContent;

    let seguidos = localStorage.getItem("artistasSeguidos");

    seguidos = seguidos ? seguidos.split("|") : [];

    if (seguidos.includes(nombreArtista)) {

        btnSeguir.textContent = "✓ Siguiendo";
        btnSeguir.style.backgroundColor = "var(--color-primario-activo)";

    } else {

        btnSeguir.textContent = "+ Seguir";
        btnSeguir.style.backgroundColor = "#000000";

    }

}


// ==========================================
// 10. AGREGAR FAN PACKS AL CARRITO
// ==========================================

if (listaFanpacksArtista) {

    listaFanpacksArtista.addEventListener("submit", evento => {

        if (!evento.target.matches(".pack-compra__form")) return;

        evento.preventDefault();

        // Obtener ID del Fan Pack
        const idPack = Number(evento.target.dataset.idPack);

        const pack = fanPacks.find(p => p.id === idPack);

        if (!pack) return;

        // Obtener modalidad de retiro
        const modalidad = evento.target.querySelector("select").value;

        // Crear una clave individual para el Fan Pack
        const claveReserva = `reservaFanPack_${pack.id}`;

        // Recuperar reserva existente
        const reservaGuardada = localStorage.getItem(claveReserva);

        let cantidad = 0;

        if (reservaGuardada) {

            const datosReserva = reservaGuardada.split("|");

            cantidad = Number(datosReserva[0]);

        }

        // Aumentar cantidad
        cantidad++;

        // Guardar cantidad, precio y modalidad sin JSON
        localStorage.setItem(
            claveReserva,
            `${cantidad}|${pack.precio}|${modalidad}`
        );

        // Confirmación
        alert(
            `¡Excelente! "${pack.nombre}" se agregó al carrito.\n` +
            `Modalidad de retiro: ${modalidad === "estadio" ? "En estadio" : "Envío a domicilio"}.`
        );

        evento.target.reset();

    });

}
