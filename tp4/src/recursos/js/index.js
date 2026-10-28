//Arreglo para almacenar los eventos, cada evento es un objeto con las propiedades: id, artista, recinto, fecha e interesados
const eventos = [
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

//Llama los elementos html que se van a usar
const entradaBusqueda = document.querySelector("#buscar-evento");
const filtros = document.querySelectorAll('input[name="filtro-evento"]');
const contenedorResultados = document.querySelector(".seccion-resultados__grilla");
const formularioBusqueda = document.querySelector(".formulario-busqueda");

//Array para que el usuario guarde sus eventos favoritos
const favoritos = [];

//Para identificar que opción seleccionó el usuario
function obtenerFiltroSeleccionado() {

    const filtroSeleccionado = document.querySelector(
        'input[name="filtro-evento"]:checked'
    );

    return filtroSeleccionado.value;
}

//Normaliza el texto para que no discrimine por tildes
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Para decidir que evento se va a mostrar
function filtrarEventos() {

    const textoBusqueda = normalizarTexto(entradaBusqueda.value.trim());
    const filtro = obtenerFiltroSeleccionado();

    //Popular muestra todos los eventos ordenados por interesados
    if (filtro === "popular") {
        return [...eventos].sort((a, b) => {
            return b.interesados - a.interesados;
        });
    }

    //Filtra los eventos según la opción seleccionada
    const eventosFiltrados = eventos.filter((evento) => {

        if (filtro === "artista") {
            return normalizarTexto(evento.artista).includes(textoBusqueda);
        }

        else if (filtro === "recinto") {
            return normalizarTexto(evento.recinto).includes(textoBusqueda);
        }

        else if (filtro === "fecha") {
            return evento.fecha.includes(textoBusqueda);
        }

    });

    //Mantiene el orden de popularidad en los resultados filtrados
    eventosFiltrados.sort((a, b) => {
        return b.interesados - a.interesados;
    });

    return eventosFiltrados;
}

//Renderiza el resultado
function renderizarEventos() {

    const eventosFiltrados = filtrarEventos();

    let eventosHTML = "";

    if (eventosFiltrados.length === 0) {

        contenedorResultados.innerHTML =
            "<p>No se encontraron eventos.</p>";

        return;
    }

    eventosFiltrados.forEach((evento, indice) => {

        const estaGuardado = favoritos.includes(evento.id);

        eventosHTML += `
            <article class="tarjeta-evento">

                <h3 class="tarjeta-evento__ranking">
                    #${indice + 1} POPULAR
                </h3>

                <ul class="tarjeta-evento__detalles">

                    <li class="tarjeta-evento__item tarjeta-evento__item--destacado">
                        ${evento.artista}
                    </li>

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
                    class="boton boton--secundario boton-guardar"
                    type="button"
                    data-evento-id="${evento.id}"
                >
                    ${estaGuardado ? "Guardado" : "Guardar"}
                </button>

            </article>
        `;

    });

    contenedorResultados.innerHTML = eventosHTML;

    configurarBotonesGuardar();
}

//Para que el usuario guarde a sus favoritos
function configurarBotonesGuardar() {

    const botonesGuardar = document.querySelectorAll(".boton-guardar");

    botonesGuardar.forEach((boton) => {

        boton.addEventListener("click", () => {

            const identificadorEvento = Number(
                boton.dataset.eventoId
            );

            const indiceFavorito = favoritos.indexOf(
                identificadorEvento
            );

            if (indiceFavorito === -1) {

                favoritos.push(identificadorEvento);

            } else {

                favoritos.splice(indiceFavorito, 1);

            }

            renderizarEventos();

        });

    });
}

// Buscar mientras se escribe
entradaBusqueda.addEventListener("input", renderizarEventos);

// Actualizar al cambiar el filtro
filtros.forEach((filtro) => {

    filtro.addEventListener("change", renderizarEventos);

});

// Evitar que el formulario recargue la página
formularioBusqueda.addEventListener("submit", (evento) => {

    evento.preventDefault();

    renderizarEventos();

});

//Muestra los resultados

renderizarEventos();