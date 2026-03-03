import { useState } from "react";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Biblioteca from "./pages/Biblioteca";
import DetalleItem from "./pages/DetalleItem";

function App() {
  const [pagina, setPagina] = useState("login");
  const [usuario, setUsuario] = useState(null);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const manejarInicioSesion = (usuarioLogeado) => {
    setUsuario(usuarioLogeado);
    setPagina("biblioteca");
    setItemSeleccionado(null);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setPagina("login");
    setItemSeleccionado(null);
  };

  const abrirDetalle = (item) => {
    setItemSeleccionado(item);
    setPagina("detalle");
  };

  const volverABiblioteca = () => {
    setPagina("biblioteca");
  };

  if (usuario) {
    if (pagina === "detalle") {
      return (
        <DetalleItem
          item={itemSeleccionado}
          volver={volverABiblioteca}
          cerrarSesion={cerrarSesion}
        />
      );
    }

    return <Biblioteca cerrarSesion={cerrarSesion} abrirDetalle={abrirDetalle} />;
  }

  if (pagina === "registro") {
    return <Registro cambiarPagina={setPagina} />;
  }

  return <Login cambiarPagina={setPagina} iniciarSesion={manejarInicioSesion} />;
}

export default App;
