import { MS5_URL, fetchJson } from "./config";

function mapResumen(row) {
  return {
    categoriaId: row.categoria_id,
    categoria: row.categoria,
    totalPlatos: Number(row.total_platos),
    calificacionPromedio:
      row.calificacion_promedio !== null
        ? Number(row.calificacion_promedio)
        : null,
    totalPedidos: Number(row.total_pedidos),
  };
}

function mapTopPlato(row) {
  return {
    platoId: row.plato_id,
    nombre: row.nombre,
    categoria: row.categoria,
    calificacionPromedio:
      row.calificacion_promedio !== null
        ? Number(row.calificacion_promedio)
        : null,
    totalPedidos: Number(row.total_pedidos),
  };
}

export const ms5 = {
  resumenPorCategoria: async () => {
    const res = await fetchJson(
      `${MS5_URL}/analitica/categorias/resumen`
    );
    return res.map(mapResumen);
  },

  topPlatos: async (limit = 5) => {
    const res = await fetchJson(
      `${MS5_URL}/analitica/top-platos?limit=${limit}`
    );
    return res.map(mapTopPlato);
  },
};
