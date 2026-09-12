import { useEffect, useState } from "react";
import { ms2 } from "../api/ms2";

export default function CartaSection() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [platos, setPlatos] = useState([]);
  const [totalElements, setTotalElements] = useState(null);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error
  const [error, setError] = useState("");

  useEffect(() => {
    ms2
      .listarCategorias()
      .then(setCategorias)
      .catch((err) => console.error("Error cargando categorias:", err));
  }, []);

  useEffect(() => {
    setEstado("cargando");
    ms2
      .listarPlatos({ page: 0, size: 12, categoriaId })
      .then((data) => {
        setPlatos(data.content || []);
        setTotalElements(data.totalElements);
        setEstado("listo");
      })
      .catch((err) => {
        setError(err.message);
        setEstado("error");
      });
  }, [categoriaId]);

  return (
    <section className="panel">
      <h2>La carta</h2>
      <p className="subtitle">
        {totalElements != null
          ? `${totalElements.toLocaleString("es-PE")} platos en el catalogo — mostrando 12`
          : "Menu y Platos · MS2"}
      </p>

      <div className="category-row">
        <button
          className="chip"
          data-active={categoriaId === null}
          onClick={() => setCategoriaId(null)}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            className="chip"
            data-active={categoriaId === c.id}
            onClick={() => setCategoriaId(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      {estado === "cargando" && <p className="state-msg">Cargando platos...</p>}
      {estado === "error" && (
        <p className="state-msg error">No se pudo cargar el menu: {error}</p>
      )}
      {estado === "listo" && (
        <ul className="menu-list">
          {platos.map((p) => (
            <li key={p.id}>
              <div>
                <div className="item-name">{p.nombre}</div>
                {p.descripcion && <div className="item-desc">{p.descripcion}</div>}
              </div>
              <div className="item-price">S/ {p.precio.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
