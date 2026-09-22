// Todas las URLs se leen de variables de entorno de Vite (VITE_*), con
// defaults que apuntan a localhost para desarrollo. En Amplify, configura
// estas variables en "Environment variables" del build (ver README) para
// que apunten a las URLs reales (API Gateway o EC2) de cada microservicio.
export const MS1_URL = import.meta.env.VITE_MS1_URL || "http://localhost:8000";
export const MS2_URL = import.meta.env.VITE_MS2_URL || "http://localhost:8082";
export const MS3_URL = import.meta.env.VITE_MS3_URL || "http://localhost:8003";
export const MS4_URL = import.meta.env.VITE_MS4_URL || "http://localhost:8083";
export const MS5_URL = import.meta.env.VITE_MS5_URL || "http://localhost:8005";

/** Wrapper de fetch que lanza un Error legible si la respuesta no es 2xx. */
export async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let detalle = res.statusText;
    try {
      const data = await res.json();
      detalle = data.detail || data.mensaje || data.error || detalle;
    } catch {
      /* la respuesta no era JSON, nos quedamos con el statusText */
    }
    throw new Error(`${res.status}: ${detalle}`);
  }
  return res.json();
}
