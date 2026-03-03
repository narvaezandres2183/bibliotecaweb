function DetalleItem({ item, volver, cerrarSesion, toggleFavorito, esFavorito }) {
  if (!item) {
    return (
      <div>
        <div className="header">
          <h1>Biblioteca Universal</h1>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
        <div className="seccion">
          <div className="detalle">
            <h2>No se encontró el contenido</h2>
            <button onClick={volver}>Volver a biblioteca</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>Biblioteca Universal</h1>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      <div className="seccion">
        <div className="acciones-detalle">
          <button onClick={volver}>Volver a biblioteca</button>
          <button
            className={`favorito-detalle ${esFavorito ? "activo" : ""}`}
            onClick={() => toggleFavorito(item)}
          >
            {esFavorito ? "♥ En favoritos" : "♡ Agregar a favoritos"}
          </button>
        </div>

        <div className="detalle detalle-pagina">
          <h2>{item.titulo}</h2>
          <p>
            <strong>Tipo:</strong> {item.tipo}
          </p>
          <p>
            <strong>Categoría:</strong> {item.categoria}
          </p>
          <p>
            <strong>Autor:</strong> {item.autor}
          </p>
          <p>
            <strong>Año:</strong> {item.anio}
          </p>
          <p>
            <strong>Idiomas:</strong> {item.idiomas}
          </p>
          <p>
            <strong>Publicado por:</strong> {item.publicadoPor}
          </p>
          <p>
            <strong>Descripción:</strong> {item.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DetalleItem;
