import { useEffect, useState } from "react";
import { ms1 } from "../api/ms1";

export default function ClientesSection() {
  const [clientes, setClientes] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [error, setError] = useState("");

  useEffect(() => {
    ms1
      .listarClientes()
      .then((data) => {
        setClientes(data.clientes || data);
        setEstado("listo");
      })
      .catch((err) => {
        setError(err.message);
        setEstado("error");
      });
  }, []);

  return (
    <section className="panel">
      <h2>Clientes</h2>
      <p className="subtitle">
        Clientes y Pedidos · MS1 — mostrando los primeros 50 de miles de
        clientes registrados
      </p>

      {estado === "cargando" && <p className="state-msg">Cargando...</p>}
      {estado === "error" && (
        <p className="state-msg error">No se pudo conectar a MS1: {error}</p>
      )}

      {estado === "listo" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
