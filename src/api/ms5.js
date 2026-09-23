import { MS5_URL, fetchJson } from "./config";

// MS5 solo expone 2 endpoints reales: /analitica/vista-resumen (una vista
// que no existe todavia) y /analitica/query-custom (SQL SELECT libre).
// Usamos query-custom con el SQL exacto que necesitamos, cruzando las
// tablas que ya creo el crawler de Glue (categorias, platos, resenas,
// pedido_detalle).

const QUERY_RESUMEN_CATEGORIA = `
  SELECT
    c.id AS categoria_id,
    c.nombre AS categoria,
    COUNT(DISTINCT p.id) AS total_platos,
    ROUND(AVG(r.calificacion), 1) AS calificacion_promedio,
    COALESCE(SUM(pd.cantidad), 0) AS total_pedidos
  FROM categorias c
  LEFT JOIN platos p ON p.categoria_id = c.id
  LEFT JOIN resenas r ON r.plato_id = p.id
  LEFT JOIN pedido_detalle pd ON pd.plato_id = p.id
  GROUP BY c.id, c.nombre
  ORDER BY c.nombre
`;

const queryTopPlatos = (limit) => `
  SELECT
    p.id AS plato_id,
    p.nombre AS nombre,
    c.nombre AS categoria,
    ROUND(AVG(r.calificacion), 1) AS calificacion_promedio,
    COALESCE(SUM(pd.cantidad), 0) AS total_pedidos
  FROM platos p
  LEFT JOIN categorias c ON c.id = p.categoria_id
  LEFT JOIN resenas r ON r.plato_id = p.id
  LEFT JOIN pedido_detalle pd ON pd.plato_id = p.id
  GROUP BY p.id, p.nombre, c.nombre
  ORDER BY total_pedidos DESC
  LIMIT ${limit}
`;

function mapResumen(row) {
  return {
    categoriaId: row.categoria_id,
    categoria: row.categoria,
    totalPlatos: Number(row.total_platos),
    calificacionPromedio:
      row.calificacion_promedio !== null ? Number(row.calificacion_promedio) : null,
    totalPedidos: Number(row.total_pedidos),
  };
}

function mapTopPlato(row) {
  return {
    platoId: row.plato_id,
    nombre: row.nombre,
    categoria: row.categoria,
    calificacionPromedio:
      row.calificacion_promedio !== null ? Number(row.calificacion_promedio) : null,
    totalPedidos: Number(row.total_pedidos),
  };
}

export const ms5 = {
  resumenPorCategoria: async () => {
    const url = `${MS5_URL}/analitica/query-custom?sql=${encodeURIComponent(QUERY_RESUMEN_CATEGORIA)}`;
    const res = await fetchJson(url);
    return res.data.map(mapResumen);
  },
  topPlatos: async (limit = 5) => {
    const url = `${MS5_URL}/analitica/query-custom?sql=${encodeURIComponent(queryTopPlatos(limit))}`;
    const res = await fetchJson(url);
    return res.data.map(mapTopPlato);
  },
};
