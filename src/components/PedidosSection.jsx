import { useEffect, useMemo, useState } from "react";
import { ms1 } from "../api/ms1";

const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Por preparar" },
  { id: "en preparacion", label: "En preparación" },
  { id: "entregado", label: "Entregados" },
  { id: "cancelado", label: "Cancelados" },
];

export default function PedidosSection() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [estado, setEstado] = useState("cargando");
  const [error, setError] = useState("");

  useEffect(() => {
    ms1
      .listarPedidos()
      .then((data) => {
        setPedidos(data.pedidos || data);
        setEstado("listo");
      })
      .catch((err) => {
        setError(err.message);
        setEstado("error");
      });
  }, []);

  const pedidosFiltrados = useMemo(() => {
    if (filtro === "todos") return pedidos;
    return pedidos.filter((p) => p.estado === filtro);
  }, [pedidos, filtro]);

  return (
    <section className="panel">
      <h2>Pedidos</h2>
      <p className="subtitle">
        Clientes y Pedidos · MS1 — mostrando los primeros 50 (hay miles de
        pedidos en la base de datos)
      </p>

      {estado === "cargando" && <p className="state-msg">Cargando...</p>}
      {estado === "error" && (
        <p className="state-msg error">No se pudo conectar a MS1: {error}</p>
      )}

      {estado === "listo" && (
        <>
          <div className="category-row">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                className="chip"
                data-active={filtro === f.id}
                onClick={() => setFiltro(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {pedidosFiltrados.length === 0 ? (
            <p className="state-msg">No hay pedidos en este estado.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.cliente_nombre}</td>
                    <td>{new Date(p.fecha_pedido).toLocaleDateString("es-PE")}</td>
                    <td>
                      <span className="badge" data-state={p.estado}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
}
