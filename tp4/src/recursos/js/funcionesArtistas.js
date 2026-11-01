// recursos/js/funcionesArtistas.js

export function renderizarArtistas(contenedor, listaArtistas) {
    let artistasHTML = "";

    listaArtistas.forEach((artista) => {
        artistasHTML += `
            <article class="tarjeta-artista">
                <figure class="tarjeta-artista__marco-foto">
                    <img class="tarjeta-artista__foto" src="${artista.imagen}" alt="Banda ${artista.nombre}">
                    <figcaption class="visually-hidden">${artista.nombre}</figcaption>
                </figure>
                <div class="tarjeta-artista__contenido">
                    <h3 class="tarjeta-artista__nombre">${artista.nombre}</h3>
                    <p class="tarjeta-artista__tour">Tour: ${artista.tour}</p>
                    <p class="tarjeta-artista__fecha">Próximo: ${artista.fecha}</p>
                </div>
                <button class="tarjeta-artista__boton" type="button" data-id="${artista.id}">Ver detalles</button>
            </article>
        `;
    });

    contenedor.innerHTML = artistasHTML;
}

export function filtrarArtistas(arreglo, genero, textoBusqueda) {
    return arreglo.filter((artista) => {
        const coincideGenero = genero === "todos" || artista.genero.includes(genero.toLowerCase());
        const coincideTexto = artista.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) || 
                              artista.tour.toLowerCase().includes(textoBusqueda.toLowerCase());
        return coincideGenero && coincideTexto;
    });
}