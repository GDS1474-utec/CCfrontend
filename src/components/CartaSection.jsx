import { useEffect, useState } from "react";
import { ms2 } from "../api/ms2";

const PAGE_SIZE = 12;

export default function CartaSection() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [page, setPage] = useState(0);
  const [platos, setPlatos] = useState([]);
  const [totalElements, setTotalElements] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
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
      .listarPlatos({ page, size: PAGE_SIZE, categoriaId })
      .then((data) => {
        setPlatos(data.content || []);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages ?? 0);
        setEstado("listo");
      })
      .catch((err) => {
        setError(err.message);
        setEstado("error");
      });
  }, [categoriaId, page]);

  function elegirCategoria(id) {
    setCategoriaId(id);
    setPage(0);
  }

  return (
    <section className="panel">
      <h2>La carta</h2>
      <p className="subtitle">
        {totalElements != null
          ? `${totalElements} platos en el menú`
          : "Menú y Platos · MS2"}
      </p>

      <div className="category-row">
        <button
          className="chip"
          data-active={categoriaId === null}
          onClick={() => elegirCategoria(null)}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            className="chip"
            data-active={categoriaId === c.id}
            onClick={() => elegirCategoria(c.id)}
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
        <>
          <ul className="menu-list">
            {platos.map((p) => (
              <li key={p.id}>
                <div>
                  <div className="item-name">
                    {p.nombre}
                    {!p.disponible && (
                      <span className="badge" data-state="cancelado" style={{ marginLeft: 8 }}>
                        agotado
                      </span>
                    )}
                  </div>
                  {p.descripcion && <div className="item-desc">{p.descripcion}</div>}
                  {p.totalResenas > 0 && (
                    <div className="item-desc">
                      ★ {p.calificacionPromedio?.toFixed(1)} ({p.totalResenas} reseñas)
                    </div>
                  )}
                </div>
                <div className="item-price">S/ {p.precio.toFixed(2)}</div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="comanda-form" style={{ marginTop: 24, justifyContent: "center" }}>
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ← Anterior
              </button>
              <span style={{ alignSelf: "center", color: "var(--ink-dim)", fontSize: 13 }}>
                Página {page + 1} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
