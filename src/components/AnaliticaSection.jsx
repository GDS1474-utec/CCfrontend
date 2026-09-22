import { useEffect, useState } from "react";
import { ms5 } from "../api/ms5";

export default function AnaliticaSection() {
  const [resumen, setResumen] = useState([]);
  const [topPlatos, setTopPlatos] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([ms5.resumenPorCategoria(), ms5.topPlatos(5)])
      .then(([resumenData, topData]) => {
        setResumen(resumenData);
        setTopPlatos(topData);
        setEstado("listo");
      })
      .catch((err) => {
        setError(err.message);
        setEstado("error");
      });
  }, []);

  return (
    <section className="panel">
      <h2>Consultas analíticas</h2>
      <p className="subtitle">Consultas Analíticas (Athena) · MS5</p>

      {estado === "cargando" && <p className="state-msg">Cargando...</p>}
      {estado === "error" && (
        <p className="state-msg error">
          No se pudo conectar a MS5: {error}
          <br />
          Este microservicio aún está en despliegue — revisa que{" "}
          <code>VITE_MS5_URL</code> apunte a la URL correcta.
        </p>
      )}

      {estado === "listo" && (
        <>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 12 }}>
            Calificación promedio y pedidos por categoría
          </h3>
          <table className="data-table" style={{ marginBottom: 40 }}>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Platos</th>
                <th>Calificación</th>
                <th>Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {resumen.map((r) => (
                <tr key={r.categoriaId}>
                  <td>{r.categoria}</td>
                  <td>{r.totalPlatos}</td>
                  <td>{r.calificacionPromedio?.toFixed(1) ?? "—"} ★</td>
                  <td>{r.totalPedidos}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 12 }}>
            Top 5 platos más pedidos
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Plato</th>
                <th>Categoría</th>
                <th>Calificación</th>
                <th>Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {topPlatos.map((p) => (
                <tr key={p.platoId}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{p.calificacionPromedio?.toFixed(1) ?? "—"} ★</td>
                  <td>{p.totalPedidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
