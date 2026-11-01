// recursos/js/artistas.js

// 1. Importaciones de módulos
import { artistasData } from './datosArtistas.js';
import { renderizarArtistas, filtrarArtistas } from './funcionesArtistas.js';
import { fanPacks } from './catalogo.js'; // Importamos el catálogo de tu compañera

// 2. Referencias al DOM (Catálogo y Filtros)
const contenedorArtistas = document.getElementById("artistas-app");
const catalogoSeccion = document.getElementById("catalogo-seccion");
const detalleSeccion = document.getElementById("detalle-artista");
const inputBusqueda = document.getElementById("buscar-artista");
const filtrosGenero = document.querySelectorAll('input[name="genero"]');

// Referencias al DOM (Sección de Detalle del Artista)
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

// Referencias al DOM (Sección de Fan Pack Dinámico)
const fpNombre = document.getElementById("detalle-artista-fanpack-nombre");
const fpDescripcion = document.getElementById("detalle-artista-fanpack-descripcion");
const fpPrecio = document.getElementById("detalle-artista-fanpack-precio");
const contenedorPack = document.getElementById("contenedor-fanpack-dinamico");
const formFanpack = document.getElementById("form-fanpack-artista");
const btnSeguir = document.querySelector(".boton-accion-negro"); // Referencia al botón Seguir

// 3. Renderizado inicial del catálogo
renderizarArtistas(contenedorArtistas, artistasData);

// 4. Funciones de navegación SPA
function mostrarDetalleArtista(id) {
    const artista = artistasData.find(a => a.id === Number(id));
    if (!artista) return;

    // A. Cargar datos básicos del artista
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
    
    detalleSetlist.innerHTML = artista.setlist.map(cancion => `<li class="canciones-lista__item">${cancion}</li>`).join("");

    // B. INTEGRACIÓN: Buscar el Fan Pack correspondiente en el catálogo de tu compañera
    const fanpacksDelArtista = fanPacks.filter(pack => pack.artista === artista.nombre);
    
    if (fanpacksDelArtista.length > 0) {
        const pack = fanpacksDelArtista[0]; 
        fpNombre.textContent = pack.nombre;
        fpDescripcion.textContent = pack.descripcion;
        fpPrecio.textContent = `$${pack.precio.toLocaleString("es-AR")}`;
        if (contenedorPack) contenedorPack.style.display = "block";
    } else {
        fpNombre.textContent = "Próximamente";
        fpDescripcion.textContent = "Aún no hay Fan Packs disponibles para esta gira.";
        fpPrecio.textContent = "$0";
        if (contenedorPack) contenedorPack.style.display = "block";
    }

    // C. Mostrar la vista de detalle (Transición SPA)
    catalogoSeccion.classList.add("seccion-oculta");
    detalleSeccion.classList.remove("seccion-oculta");
    detalleSeccion.scrollIntoView({ behavior: "smooth", block: "start" });
    window.location.hash = "detalle-artista";

    cargarEstadoSeguir();
}

function volverAlCatalogo(evento) {
    evento.preventDefault();
    detalleSeccion.classList.add("seccion-oculta");
    catalogoSeccion.classList.remove("seccion-oculta");
    window.location.hash = "catalogo-seccion";
}

// Función auxiliar para actualizar la grilla con mensaje de "No encontrado"
function actualizarGrillaArtistas(texto, generoActivo) {
    const artistasFiltrados = filtrarArtistas(artistasData, generoActivo, texto);
    
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

// 5. Event Listeners para filtros y búsqueda en tiempo real
inputBusqueda.addEventListener("input", () => {
    const texto = inputBusqueda.value;
    const generoActivo = document.querySelector('input[name="genero"]:checked').value;
    actualizarGrillaArtistas(texto, generoActivo);
});

filtrosGenero.forEach((filtro) => {
    filtro.addEventListener("change", () => {
        const generoActivo = filtro.value;
        const texto = inputBusqueda.value;
        actualizarGrillaArtistas(texto, generoActivo);
    });
});

// 6. Delegación de eventos (Patrón usado por tu compañera)
document.addEventListener("click", (evento) => {
    // Al hacer clic en "Ver detalles" de una tarjeta
    const botonVer = evento.target.closest(".tarjeta-artista__boton");
    if (botonVer) {
        mostrarDetalleArtista(botonVer.dataset.id);
        return;
    }

    // Al hacer clic en "Volver al explorador"
    const botonVolver = evento.target.closest(".boton-volver");
    if (botonVolver) {
        volverAlCatalogo(evento);
        return;
    }

    const btnSeguirClick = evento.target.closest(".boton-accion-negro");
    if (btnSeguirClick) {
        const nombreArtista = detalleNombre.textContent;
        let seguidos = JSON.parse(localStorage.getItem("artistasSeguidos")) || [];
        
        if (seguidos.includes(nombreArtista)) {
            // Dejar de seguir
            seguidos = seguidos.filter(a => a !== nombreArtista);
            btnSeguirClick.textContent = "+ Seguir";
            btnSeguirClick.style.backgroundColor = "#000000"; // Vuelve al estilo original
        } else {
            // Seguir
            seguidos.push(nombreArtista);
            btnSeguirClick.textContent = "✓ Siguiendo";
            btnSeguirClick.style.backgroundColor = "var(--color-primario-activo)"; // Color de éxito
        }
        
        localStorage.setItem("artistasSeguidos", JSON.stringify(seguidos));
    }
});

// Función para pintar el estado correcto del botón "Seguir" al cargar un detalle
function cargarEstadoSeguir() {
    if (!btnSeguir) return;
    const nombreArtista = detalleNombre.textContent;
    const seguidos = JSON.parse(localStorage.getItem("artistasSeguidos")) || [];
    
    if (seguidos.includes(nombreArtista)) {
        btnSeguir.textContent = "✓ Siguiendo";
        btnSeguir.style.backgroundColor = "var(--color-primario-activo)";
    } else {
        btnSeguir.textContent = "+ Seguir";
        btnSeguir.style.backgroundColor = "#000000";
    }
}

// 7. Evento adicional: Simular la acción de agregar el Fan Pack al carrito
if (formFanpack) {
    formFanpack.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Evitamos la recarga real del formulario
        
        const nombrePack = fpNombre.textContent;
        const modalidad = document.getElementById("retiro-artista").value;
        
        // Feedback visual al usuario
        alert(`¡Excelente! Agregaste "${nombrePack}" a tu reserva.\nModalidad de retiro: ${modalidad === 'estadio' ? 'En estadio' : 'Envío a domicilio'}.\n\n(Esta acción se sincroniza con la tabla de reservas de tu perfil).`);
        
        formFanpack.reset(); // Limpiamos el select
    });
}