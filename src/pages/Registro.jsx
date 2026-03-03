import { useState } from "react";

function Registro({ cambiarPagina }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const registrar = () => {
    const nuevoUsuario = { correo, password };
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    alert("Usuario registrado");
    cambiarPagina("login");
  };

  return (
    <div className="contenedor">
      <h1 className="titulo-principal">Biblioteca Universal</h1>
      <p className="subtitulo">Crear nueva cuenta</p>

      <div className="caja">
        <h2>Registro</h2>

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

        <button onClick={registrar}>Registrar</button>

        <br />
        <button onClick={() => cambiarPagina("login")}>Volver</button>
      </div>
    </div>
  );
}

export default Registro;
