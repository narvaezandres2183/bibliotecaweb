import libros from "../data/libros";
import exposiciones from "../data/exposiciones";

function Biblioteca({ cerrarSesion, abrirDetalle }) {
  return (
    <div>
      <div className="header">
        <h1>Biblioteca Universal</h1>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      <div className="seccion">
        <h2>Libros destacados</h2>
        <div className="grid">
          {libros.map((item) => (
            <button
              key={item.titulo}
              className="card card-boton"
              onClick={() => abrirDetalle(item)}
            >
              <h3>{item.titulo}</h3>
              <p>{item.autor}</p>
              <small>{item.tipo}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="seccion">
        <h2>Exposiciones famosas</h2>
        <div className="grid">
          {exposiciones.map((item) => (
            <button
              key={item.titulo}
              className="card card-boton"
              onClick={() => abrirDetalle(item)}
            >
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
              <small>{item.tipo}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Biblioteca;
