import { MS4_URL, fetchJson } from "./config";

export const ms4 = {
  obtenerComanda: (pedidoId) => fetchJson(`${MS4_URL}/comandas/${pedidoId}`),
};
