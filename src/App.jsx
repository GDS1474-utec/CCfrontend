import { useState } from "react";
import CartaSection from "./components/CartaSection";
import ClientesSection from "./components/ClientesSection";
import PedidosSection from "./components/PedidosSection";
import ReservasSection from "./components/ReservasSection";
import ComandaSection from "./components/ComandaSection";
import AnaliticaSection from "./components/AnaliticaSection";

const TABS = [
  { id: "carta", label: "Carta", Component: CartaSection },
  { id: "clientes", label: "Clientes", Component: ClientesSection },
  { id: "pedidos", label: "Pedidos", Component: PedidosSection },
  { id: "reservas", label: "Reservas", Component: ReservasSection },
  { id: "comanda", label: "Comanda", Component: ComandaSection },
  { id: "analitica", label: "Analítica", Component: AnaliticaSection },
];

export default function App() {
  const [activo, setActivo] = useState("carta");
  const ActiveComponent = TABS.find((t) => t.id === activo).Component;

  return (
    <>
      <header className="top">
        <p className="eyebrow">Proyecto CS2032 · Cloud Computing</p>
        <h1>Panel de personal — La Sazón</h1>
        <p>Carta, pedidos, reservas y comandas para el equipo del restaurante.</p>
        <span className="internal-note">Uso interno — no es la app del cliente</span>
      </header>

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activo === t.id}
            onClick={() => setActivo(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="wrap">
        <ActiveComponent />
      </div>
    </>
  );
}
