import { MS1_URL, fetchJson } from "./config";

export const ms1 = {
  listarClientes: () => fetchJson(`${MS1_URL}/clientes`),
  listarPedidos: () => fetchJson(`${MS1_URL}/pedidos`),
};
