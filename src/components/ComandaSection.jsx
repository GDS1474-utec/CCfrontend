import { useState } from "react";
import { ms4 } from "../api/ms4";

export default function ComandaSection() {
  const [pedidoId, setPedidoId] = useState("");
  const [comanda, setComanda] = useState(null);
  const [estado, setEstado] = useState("inicial"); // inicial | cargando | listo | error
  const [error, setError] = useState("");

  async function buscar(e) {
    e.preventDefault();
    if (!pedidoId) return;
    setEstado("cargando");
    setComanda(null);
    try {
      const data = await ms4.obtenerComanda(pedidoId);
      setComanda(data);
      setEstado("listo");
    } catch (err) {
      setError(err.message);
      setEstado("error");
    }
  }

  return (
    <section className="panel">
      <h2>Ver comanda</h2>
      <p className="subtitle">
        Comanda/Facturacion · MS4 — combina MS1 (pedido) y MS2 (precios)
      </p>

      <form className="comanda-form" onSubmit={buscar}>
        <input
          type="number"
          min="1"
          placeholder="Numero de pedido, ej. 1"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
        />
        <button type="submit" disabled={estado === "cargando"}>
          {estado === "cargando" ? "Buscando..." : "Ver cuenta"}
        </button>
      </form>

      {estado === "error" && (
        <p className="state-msg error">No se pudo generar la comanda: {error}</p>
      )}

      {estado === "listo" && comanda && (
        <div className="comanda-card">
          <p className="cliente">{comanda.cliente.nombre}</p>
          <p className="meta">
            Pedido #{comanda.pedidoId} ·{" "}
            <span className="badge" data-state={comanda.estadoPedido}>
              {comanda.estadoPedido}
            </span>
          </p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Plato</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {comanda.lineas.map((l) => (
                <tr key={l.platoId}>
                  <td>{l.nombre}</td>
                  <td>{l.cantidad}</td>
                  <td>S/ {l.precioUnitario.toFixed(2)}</td>
                  <td>S/ {l.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="comanda-total">
            <span>Total</span>
            <span>S/ {comanda.total.toFixed(2)}</span>
          </div>

          {(comanda.advertencias?.platosNoEncontradosEnMenu ||
            comanda.advertencias?.platosNoDisponibles) && (
            <div className="warning-box">
              Algunos platos tuvieron advertencias — revisa el detalle en la API.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
