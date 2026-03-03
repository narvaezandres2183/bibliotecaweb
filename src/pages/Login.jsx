import { useState } from "react";

function Login({ cambiarPagina, iniciarSesion }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const manejarLogin = () => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    if (
      usuarioGuardado &&
      usuarioGuardado.correo === correo &&
      usuarioGuardado.password === password
    ) {
      iniciarSesion(usuarioGuardado);
    } else {
      alert("Datos incorrectos");
    }
  };

  return (
    <div className="contenedor">
      <h1 className="titulo-principal">Biblioteca Universal</h1>
      <p className="subtitulo">Sistema de gestión de libros</p>

      <div className="caja">
        <h2>Inicio de sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={manejarLogin}>Ingresar</button>

        <p>
          ¿No tienes cuenta?
          <br />
          <button onClick={() => cambiarPagina("registro")}>Registrarse</button>
        </p>
      </div>
    </div>
  );
}

export default Login;
