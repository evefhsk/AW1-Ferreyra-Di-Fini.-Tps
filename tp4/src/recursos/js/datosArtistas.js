// recursos/js/datosArtistas.js

export const artistasData = [
    {
        id: 1,
        nombre: "Coldplay",
        genero: "pop",
        tour: "Music of the Spheres",
        fecha: "25/09 - 21:00",
        imagen: "./recursos/imagenes/artistas/coldplay.jpeg",
        detalleImagen: "./recursos/imagenes/artistas/coldplaytour.png",
        descripcion: "Gira internacional Music of the Spheres World Tour.",
        recinto: "Estadio River Plate",
        puertas: "17:00 hs",
        inicio: "21:00 hs",
        accesos: "Puertas 1 a 4",
        elementos: "Riñoneras, botellas plásticas vacías, cargadores.",
        setlist: ["Higher Power", "Adventure of a Lifetime", "Paradise", "The Scientist"],
        fanpack: { nombre: "Pack Experiencia Coldplay", precio: 35000, descripcion: "Remera conmemorativa, credencial coleccionable y ecovaso oficial." }
    },
    {
        id: 2,
        nombre: "BTS",
        genero: "pop",
        tour: "ARIRANG World Tour",
        fecha: "12/11 - 21:00",
        imagen: "./recursos/imagenes/artistas/bts.jpeg",
        detalleImagen: "./recursos/imagenes/artistas/btstour.jpg",
        descripcion: "Gira mundial oficial ARIRANG World Tour.",
        recinto: "Campo Argentino de Polo",
        puertas: "16:00 hs",
        inicio: "21:00 hs",
        accesos: "Av. del Libertador y Av. Dorrego",
        elementos: "Army Bomb oficial, banners de papel, riñoneras.",
        setlist: ["Dynamite", "Butter", "Boy With Luv", "Fake Love"],
        fanpack: { nombre: "ARMY Tour Pack Oficial", precio: 42000, descripcion: "Photocard exclusiva, remera del tour ARIRANG y lanyard oficial." }
    },
    {
        id: 3,
        nombre: "The Beatles",
        genero: "rock",
        tour: "Revival Historic Show",
        fecha: "25/09 - 21:00",
        imagen: "./recursos/imagenes/artistas/thebeatles.jpeg",
        detalleImagen: "./recursos/imagenes/artistas/thebeatlestour.jpg",
        descripcion: "Presentación conmemorativa histórica y show oficial.",
        recinto: "Estadio Kempes",
        puertas: "17:00 hs",
        inicio: "21:00 hs",
        accesos: "Portón Norte y Sur",
        elementos: "Riñoneras, banderas pequeñas sin mástil, cargadores.",
        setlist: ["Come Together", "Let It Be", "Hey Jude", "Yesterday"],
        fanpack: { nombre: "Pack Abbey Road Memorial", precio: 48000, descripcion: "Vinilo conmemorativo, remera vintage y póster de colección." }
    }
];