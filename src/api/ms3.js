import { MS3_URL, fetchJson } from "./config";

export const ms3 = {
  listarMesas: () => fetchJson(`${MS3_URL}/mesas`),
  listarReservas: () => fetchJson(`${MS3_URL}/reservas`),
};
