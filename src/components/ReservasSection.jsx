import { useEffect, useState } from "react";
import { ms3 } from "../api/ms3";

export default function ReservasSection() {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([ms3.listarMesas(), ms3.listarReservas()])
      .then(([mesasData, reservasData]) => {
        setMesas(mesasData.mesas || mesasData);
        setReservas(reservasData.reservas || reservasData);
        setEstado("listo");
      })
      .catch((err) => {
        setError(err.message);
        setEstado("error");
      });
  }, []);

  return (
    <section className="panel">
      <h2>Mesas y reservas</h2>
      <p className="subtitle">Reservas y Mesas · MS3</p>

      {estado === "cargando" && <p className="state-msg">Cargando...</p>}
      {estado === "error" && (
        <p className="state-msg error">No se pudo conectar a MS3: {error}</p>
      )}

      {estado === "listo" && (
        <>
          <table className="data-table" style={{ marginBottom: 40 }}>
            <thead>
              <tr>
                <th>Mesa</th>
                <th>Capacidad</th>
                <th>Ubicacion</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((m) => (
                <tr key={m._id || m.id}>
                  <td>#{m.numero}</td>
                  <td>{m.capacidad} personas</td>
                  <td>{m.ubicacion}</td>
                  <td>
                    <span className="badge" data-state={m.estado}>
                      {m.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r._id || r.id}>
                  <td>Cliente #{r.cliente_id}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                  <td>{r.cantidad_personas}</td>
                  <td>
                    <span className="badge" data-state={r.estado}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
