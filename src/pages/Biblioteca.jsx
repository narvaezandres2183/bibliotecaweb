import { useMemo, useState } from "react";
import libros from "../data/libros";
import exposiciones from "../data/exposiciones";

const secciones = [
  "Inicio",
  "Categorías",
  "Eventos",
  "Favoritos",
  "Reservas",
  "Historial",
  "Perfil"
];

function Biblioteca({
  cerrarSesion,
  abrirDetalle,
  favoritos,
  toggleFavorito,
  eliminarFavorito,
  eventos,
  inscribirEvento,
  cancelarInscripcion,
  historial,
  perfil,
  setPerfil,
  seccionActiva,
  setSeccionActiva
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const catalogo = useMemo(() => [...libros, ...exposiciones], []);
  const categorias = useMemo(
    () => [...new Set(catalogo.map((item) => item.categoria))],
    [catalogo]
  );

  const categoriasConConteo = useMemo(
    () =>
      categorias.map((categoria) => ({
        nombre: categoria,
        total: catalogo.filter((item) => item.categoria === categoria).length
      })),
    [categorias, catalogo]
  );

  const itemsInicio = useMemo(() => {
    return catalogo.filter((item) => {
      const cumpleTexto = `${item.titulo} ${item.autor} ${item.descripcion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const cumpleTipo = filtroTipo === "Todos" || item.tipo === filtroTipo;
      const cumpleCategoria =
        filtroCategoria === "Todas" || item.categoria === filtroCategoria;
      return cumpleTexto && cumpleTipo && cumpleCategoria;
    });
  }, [catalogo, busqueda, filtroTipo, filtroCategoria]);

  const itemsCategoria = useMemo(() => {
    if (categoriaActiva === "Todas") {
      return catalogo;
    }
    return catalogo.filter((item) => item.categoria === categoriaActiva);
  }, [catalogo, categoriaActiva]);

  const eventosInscritos = eventos.filter((evento) => evento.inscrito);

  const estadisticas = useMemo(() => {
    const ahora = new Date();
    const haceSieteDias = new Date(ahora);
    haceSieteDias.setDate(ahora.getDate() - 7);

    const visitadosSemana = historial.filter(
      (item) => new Date(item.fechaISO) >= haceSieteDias
    ).length;

    const conteoCategorias = historial.reduce((acumulado, item) => {
      acumulado[item.categoria] = (acumulado[item.categoria] || 0) + 1;
      return acumulado;
    }, {});

    const categoriaMasVisitada =
      Object.entries(conteoCategorias).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Sin datos";

    return {
      totalVisitados: historial.length,
      visitadosSemana,
      categoriaMasVisitada
    };
  }, [historial]);

  const esFavorito = (id) => favoritos.some((item) => item.id === id);

  const renderCatalogo = (items) => (
    <div className="grid">
      {items.map((item) => (
        <article key={item.id} className="card catalogo-card">
          <button
            className={`favorito-btn ${esFavorito(item.id) ? "activo" : ""}`}
            onClick={(evento) => {
              evento.stopPropagation();
              toggleFavorito(item);
            }}
            title={esFavorito(item.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            ♥
          </button>
          <button className="card-boton card-link" onClick={() => abrirDetalle(item)}>
            <div className="card-top">
              <h3>{item.titulo}</h3>
            </div>
            <p>{item.autor}</p>
            <div className="tags">
              <span className={`tag ${item.tipo === "Exposición" ? "tag-expo" : "tag-libro"}`}>
                {item.tipo}
              </span>
              <span className="tag tag-categoria">{item.categoria}</span>
            </div>
          </button>
        </article>
      ))}
    </div>
  );

  const renderSeccion = () => {
    if (seccionActiva === "Inicio") {
      return (
        <section className="seccion">
          <h2>Catálogo principal</h2>
          <div className="filtros">
            <input
              type="text"
              placeholder="Buscar por título, autor o descripción"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
            <select value={filtroTipo} onChange={(evento) => setFiltroTipo(evento.target.value)}>
              <option value="Todos">Tipo: Todos</option>
              <option value="Libro">Libro</option>
              <option value="Cómic">Cómic</option>
              <option value="Exposición">Exposición</option>
            </select>
            <select
              value={filtroCategoria}
              onChange={(evento) => setFiltroCategoria(evento.target.value)}
            >
              <option value="Todas">Categoría: Todas</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          {renderCatalogo(itemsInicio)}
        </section>
      );
    }

    if (seccionActiva === "Categorías") {
      return (
        <section className="seccion">
          <h2>Sistema de categorías</h2>
          <div className="grid">
            <button
              className={`card categoria-card ${
                categoriaActiva === "Todas" ? "categoria-activa" : ""
              }`}
              onClick={() => setCategoriaActiva("Todas")}
            >
              <h3>Todas</h3>
              <p>{catalogo.length} disponibles</p>
            </button>
            {categoriasConConteo.map((categoria) => (
              <button
                key={categoria.nombre}
                className={`card categoria-card ${
                  categoriaActiva === categoria.nombre ? "categoria-activa" : ""
                }`}
                onClick={() => setCategoriaActiva(categoria.nombre)}
              >
                <h3>{categoria.nombre}</h3>
                <p>{categoria.total} disponibles</p>
              </button>
            ))}
          </div>

          <h3 className="subtitulo-seccion">Contenido filtrado: {categoriaActiva}</h3>
          {renderCatalogo(itemsCategoria)}
        </section>
      );
    }

    if (seccionActiva === "Eventos") {
      return (
        <section className="seccion">
          <h2>Eventos y actividades</h2>
          <div className="grid">
            {eventos.map((evento) => {
              const disponibles = evento.cupoTotal - evento.inscritos;
              const ultimosCupos = disponibles > 0 && disponibles <= 5;
              return (
                <article key={evento.id} className="card evento-card">
                  <h3>{evento.titulo}</h3>
                  <p>{evento.descripcion}</p>
                  <p>
                    <strong>Fecha:</strong> {evento.fecha}
                  </p>
                  <p>
                    <strong>Hora:</strong> {evento.hora}
                  </p>
                  <p>
                    <strong>Lugar:</strong> {evento.lugar}
                  </p>
                  <p>
                    <strong>Moderador:</strong> {evento.moderador}
                  </p>
                  <p>
                    <strong>Cupos:</strong> {disponibles}/{evento.cupoTotal} disponibles
                  </p>
                  {ultimosCupos && <span className="tag tag-alerta">Últimos cupos</span>}
                  <button
                    className={`evento-accion ${evento.inscrito ? "ya-inscrito" : ""}`}
                    onClick={() => inscribirEvento(evento.id)}
                    disabled={evento.inscrito || disponibles <= 0}
                  >
                    {evento.inscrito ? "✓ Ya inscrito" : "Inscribirse"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      );
    }

    if (seccionActiva === "Favoritos") {
      return (
        <section className="seccion">
          <h2>Favoritos</h2>
          {favoritos.length === 0 && <p>No tienes elementos guardados.</p>}
          <div className="grid">
            {favoritos.map((item) => (
              <article key={item.id} className="card catalogo-card">
                <button className="card-boton card-link" onClick={() => abrirDetalle(item)}>
                  <h3>{item.titulo}</h3>
                  <p>{item.autor}</p>
                  <div className="tags">
                    <span
                      className={`tag ${item.tipo === "Exposición" ? "tag-expo" : "tag-libro"}`}
                    >
                      {item.tipo}
                    </span>
                    <span className="tag tag-categoria">{item.categoria}</span>
                  </div>
                </button>
                <button
                  className="eliminar-btn"
                  title="Eliminar de favoritos"
                  onClick={() => eliminarFavorito(item.id)}
                >
                  🗑
                </button>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (seccionActiva === "Reservas") {
      return (
        <section className="seccion">
          <h2>Eventos inscritos</h2>
          {eventosInscritos.length === 0 && <p>No tienes reservas activas.</p>}
          <div className="grid">
            {eventosInscritos.map((evento) => (
              <article key={evento.id} className="card evento-card">
                <h3>{evento.titulo}</h3>
                <p>{evento.descripcion}</p>
                <p>
                  <strong>Fecha:</strong> {evento.fecha}
                </p>
                <p>
                  <strong>Hora:</strong> {evento.hora}
                </p>
                <p>
                  <strong>Lugar:</strong> {evento.lugar}
                </p>
                <p>
                  <strong>Moderador:</strong> {evento.moderador}
                </p>
                <button
                  className="evento-accion cancelar"
                  onClick={() => cancelarInscripcion(evento.id)}
                >
                  Cancelar inscripción
                </button>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (seccionActiva === "Historial") {
      return (
        <section className="seccion">
          <h2>Historial de lectura</h2>
          <div className="grid estadisticas-grid">
            <article className="card estadistica-card">
              <h3>Total visitados</h3>
              <p>{estadisticas.totalVisitados}</p>
            </article>
            <article className="card estadistica-card">
              <h3>Visitados esta semana</h3>
              <p>{estadisticas.visitadosSemana}</p>
            </article>
            <article className="card estadistica-card">
              <h3>Categoría más visitada</h3>
              <p>{estadisticas.categoriaMasVisitada}</p>
            </article>
          </div>

          {historial.length === 0 && <p>Aún no has visitado libros o exposiciones.</p>}
          <div className="detalle">
            {historial.map((registro) => (
              <p key={registro.id}>
                <strong>{registro.titulo}</strong> ({registro.tipo}) -{" "}
                {new Date(registro.fechaISO).toLocaleString("es-CO")}
              </p>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="seccion">
        <h2>Perfil de usuario</h2>
        <div className="perfil-header">
          <span className="nivel">Nivel: {perfil.nivel}</span>
        </div>
        <form className="detalle perfil-form" onSubmit={(evento) => evento.preventDefault()}>
          <label>
            Nombre completo
            <input
              type="text"
              value={perfil.nombre}
              onChange={(evento) =>
                setPerfil((actual) => ({ ...actual, nombre: evento.target.value }))
              }
            />
          </label>
          <label>
            Correo
            <input
              type="email"
              value={perfil.correo}
              onChange={(evento) =>
                setPerfil((actual) => ({ ...actual, correo: evento.target.value }))
              }
            />
          </label>
          <label>
            Información personal
            <textarea
              value={perfil.biografia}
              onChange={(evento) =>
                setPerfil((actual) => ({ ...actual, biografia: evento.target.value }))
              }
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={perfil.notificacionesEmail}
              onChange={(evento) =>
                setPerfil((actual) => ({
                  ...actual,
                  notificacionesEmail: evento.target.checked
                }))
              }
            />
            Recibir notificaciones por email
          </label>
        </form>
      </section>
    );
  };

  return (
    <div>
      <div className="header">
        <h1>Biblioteca Universal</h1>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      <nav className="nav-principal">
        {secciones.map((seccion) => (
          <button
            key={seccion}
            className={`nav-item ${seccionActiva === seccion ? "activo" : ""}`}
            onClick={() => setSeccionActiva(seccion)}
          >
            {seccion}
          </button>
        ))}
      </nav>

      {renderSeccion()}
    </div>
  );
}

export default Biblioteca;
