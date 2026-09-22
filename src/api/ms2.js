import { MS2_URL, fetchJson } from "./config";

export const ms2 = {
  listarCategorias: () => fetchJson(`${MS2_URL}/api/v1/categorias`),
  listarPlatos: ({ page = 0, size = 12, categoriaId } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (categoriaId) params.set("categoriaId", categoriaId);
    return fetchJson(`${MS2_URL}/api/v1/platos?${params.toString()}`);
  },
};
