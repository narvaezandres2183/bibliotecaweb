import { useState } from "react";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Biblioteca from "./pages/Biblioteca";
import DetalleItem from "./pages/DetalleItem";

const eventosIniciales = [
  {
    id: "evento-1",
    titulo: "Club de lectura: Realismo mágico",
    descripcion: "Conversatorio sobre autores latinoamericanos y lectura guiada.",
    fecha: "2026-03-20",
    hora: "18:00",
    lugar: "Sala Cultural A",
    moderador: "Laura Restrepo",
    cupoTotal: 25,
    inscritos: 17,
    inscrito: false
  },
  {
    id: "evento-2",
    titulo: "Taller de cómic documental",
    descripcion: "Análisis de narrativa visual y creación de viñetas en grupo.",
    fecha: "2026-03-24",
    hora: "16:30",
    lugar: "Aula Creativa 2",
    moderador: "Daniel Cárdenas",
    cupoTotal: 20,
    inscritos: 18,
    inscrito: false
  },
  {
    id: "evento-3",
    titulo: "Mesa abierta: filosofía y actualidad",
    descripcion: "Debate sobre pensamiento clásico aplicado a problemas modernos.",
    fecha: "2026-03-28",
    hora: "17:00",
    lugar: "Auditorio Central",
    moderador: "Paula Sánchez",
    cupoTotal: 30,
    inscritos: 8,
    inscrito: false
  }
];

function App() {
  const [pagina, setPagina] = useState("login");
  const [seccionActiva, setSeccionActiva] = useState("Inicio");
  const [usuario, setUsuario] = useState(null);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [eventos, setEventos] = useState(eventosIniciales);
  const [historial, setHistorial] = useState([]);
  const [perfil, setPerfil] = useState({
    nombre: "",
    correo: "",
    biografia: "",
    notificacionesEmail: true,
    nivel: "Principiante"
  });

  const manejarInicioSesion = (usuarioLogeado) => {
    setUsuario(usuarioLogeado);
    setPagina("biblioteca");
    setSeccionActiva("Inicio");
    setItemSeleccionado(null);
    setPerfil((actual) => ({
      ...actual,
      correo: usuarioLogeado.correo || ""
    }));
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setPagina("login");
    setSeccionActiva("Inicio");
    setItemSeleccionado(null);
    setFavoritos([]);
    setEventos(eventosIniciales);
    setHistorial([]);
    setPerfil({
      nombre: "",
      correo: "",
      biografia: "",
      notificacionesEmail: true,
      nivel: "Principiante"
    });
  };

  const abrirDetalle = (item) => {
    setItemSeleccionado(item);
    setPagina("detalle");
    setHistorial((actual) => [
      {
        id: `historial-${Date.now()}`,
        itemId: item.id,
        titulo: item.titulo,
        tipo: item.tipo,
        categoria: item.categoria,
        fechaISO: new Date().toISOString()
      },
      ...actual
    ]);
  };

  const volverABiblioteca = () => {
    setPagina("biblioteca");
  };

  const toggleFavorito = (item) => {
    setFavoritos((actual) => {
      const existe = actual.some((favorito) => favorito.id === item.id);
      if (existe) {
        return actual.filter((favorito) => favorito.id !== item.id);
      }
      return [...actual, item];
    });
  };

  const eliminarFavorito = (itemId) => {
    setFavoritos((actual) => actual.filter((item) => item.id !== itemId));
  };

  const inscribirEvento = (eventoId) => {
    setEventos((actual) =>
      actual.map((evento) => {
        const cuposDisponibles = evento.cupoTotal - evento.inscritos;
        if (evento.id !== eventoId || evento.inscrito || cuposDisponibles <= 0) {
          return evento;
        }
        return {
          ...evento,
          inscrito: true,
          inscritos: evento.inscritos + 1
        };
      })
    );
  };

  const cancelarInscripcion = (eventoId) => {
    setEventos((actual) =>
      actual.map((evento) => {
        if (evento.id !== eventoId || !evento.inscrito) {
          return evento;
        }
        return {
          ...evento,
          inscrito: false,
          inscritos: Math.max(0, evento.inscritos - 1)
        };
      })
    );
  };

  if (usuario) {
    if (pagina === "detalle") {
      return (
        <DetalleItem
          item={itemSeleccionado}
          volver={volverABiblioteca}
          cerrarSesion={cerrarSesion}
          toggleFavorito={toggleFavorito}
          esFavorito={favoritos.some((item) => item.id === itemSeleccionado?.id)}
        />
      );
    }

    return (
      <Biblioteca
        cerrarSesion={cerrarSesion}
        abrirDetalle={abrirDetalle}
        favoritos={favoritos}
        toggleFavorito={toggleFavorito}
        eliminarFavorito={eliminarFavorito}
        eventos={eventos}
        inscribirEvento={inscribirEvento}
        cancelarInscripcion={cancelarInscripcion}
        historial={historial}
        perfil={perfil}
        setPerfil={setPerfil}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
    );
  }

  if (pagina === "registro") {
    return <Registro cambiarPagina={setPagina} />;
  }

  return <Login cambiarPagina={setPagina} iniciarSesion={manejarInicioSesion} />;
}

export default App;
