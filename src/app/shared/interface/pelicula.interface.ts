export interface Pelicula {
  id: number;
  nombre: string;
  sinopsis: string;
  director: string;
  anio_publicacion: number;
  urlImagen: string;
  duracion: string;
  id_user: number;
  id_genero: number;


  genero:{
    id: number;
    nombre: string;
  }
}
