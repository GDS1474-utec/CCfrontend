import { MS5_URL, fetchJson } from "./config";

// Contrato propuesto para MS5 (pendiente de confirmar con Persona 5 / Tommy,
// que todavia no ha desplegado este microservicio). Son 2 endpoints GET que
// exponen resultados de consultas Athena, cruzando los datos de MS1 y MS2
// ya cargados en S3:
//   GET /analitica/categorias/resumen
//     -> [{ categoriaId, categoria, totalPlatos, calificacionPromedio, totalPedidos }]
//   GET /analitica/top-platos?limit=5
//     -> [{ platoId, nombre, categoria, calificacionPromedio, totalPedidos }]
export const ms5 = {
  resumenPorCategoria: () => fetchJson(`${MS5_URL}/analitica/categorias/resumen`),
  topPlatos: (limit = 5) => fetchJson(`${MS5_URL}/analitica/top-platos?limit=${limit}`),
};
