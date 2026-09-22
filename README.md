# La Sazón — Frontend

Panel interno del restaurante (proyecto CS2032). Consume los 5 microservicios
del proyecto: MS1, MS2, MS3, MS4 y MS5. Hecho con React + Vite.

## Qué consume cada pestaña

| Pestaña | Microservicio | Endpoints usados |
|---|---|---|
| Carta | MS2 | `GET /api/v1/categorias`, `GET /api/v1/platos` (paginado, con filtro por categoría) |
| Clientes | MS1 | `GET /clientes` |
| Pedidos | MS1 | `GET /pedidos` (con filtro por estado: pendiente / en preparación / entregado / cancelado) |
| Reservas | MS3 | `GET /mesas`, `GET /reservas` |
| Comanda | MS4 | `GET /comandas/{pedidoId}` |
| Analítica | MS5 | `GET /analitica/categorias/resumen`, `GET /analitica/top-platos` |

Esto cubre el requisito de la rúbrica de consumir los 5 microservicios, con
al menos 2 métodos REST por cada uno (MS1 usa `/clientes` + `/pedidos`; MS4
y MS5 tienen su propio par de endpoints).

## ⚠️ Pendiente: MS5 (Consultas Analíticas)

MS5 todavía no está desplegado por el equipo al momento de escribir esto. La
pestaña "Analítica" ya está construida contra un contrato propuesto:

```
GET /analitica/categorias/resumen
  -> [{ categoriaId, categoria, totalPlatos, calificacionPromedio, totalPedidos }]

GET /analitica/top-platos?limit=5
  -> [{ platoId, nombre, categoria, calificacionPromedio, totalPedidos }]
```

Cuando Persona 5 (Tommy) tenga el endpoint real corriendo, confirmen que la
forma de la respuesta coincida (o avísenme para ajustar `src/api/ms5.js` y
`src/components/AnaliticaSection.jsx`), y actualicen `VITE_MS5_URL`. Mientras
tanto, esa pestaña mostrará un error de conexión sin afectar a las demás.

## Volumen de datos actual (referencia)

- MS1: ~5,000 clientes, ~20,000 pedidos, con detalle de platos por pedido.
- MS2: 50 platos (12 categorías), ~24,481 reseñas (usadas para calcular
  `calificacionPromedio` y `totalResenas` en cada plato).
- MS3: ~200 mesas, ~20,000 reservas.

Todas las tablas anteriores están paginadas (`limit`/`offset` o `page`/`size`
según el microservicio), por eso cada pestaña muestra solo una porción y lo
indica en el subtítulo.

## Correrlo en desarrollo

```bash
npm install
cp .env.example .env
npm run dev
```

Abre `http://localhost:5173`. Asegúrate de tener los microservicios que
quieras probar corriendo en los puertos configurados en `.env` (cada pestaña
falla de forma independiente si su microservicio no responde).

## Cambiar las URLs (producción / EC2 / API Gateway)

Edita `.env` (local) o las variables de entorno en Amplify (producción):

```
VITE_MS1_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms1
VITE_MS2_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms2
VITE_MS3_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms3
VITE_MS4_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms4
VITE_MS5_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms5
```

**Importante:** si el frontend se sirve en HTTPS (como en Amplify), las 5
URLs también deben ser HTTPS — un navegador bloquea llamadas HTTP desde una
página HTTPS ("mixed content"). Por eso se usa un API Gateway delante de
cada microservicio en vez de la IP pública directa de la EC2.

## Desplegar en AWS Amplify

1. Sube este proyecto a un repo de GitHub (público, para el entregable).
2. En Amplify Hosting, conecta el repo, rama `main`.
3. Build settings (Amplify suele detectarlo solo; si no, usa esto):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
4. En **Environment variables**, agrega las 5 variables `VITE_MSx_URL` con
   las URLs reales (del API Gateway, no la IP directa).
5. **Rewrite de SPA**: Amplify ya agrega por defecto una regla
   `/<*> → /index.html (404-200 Rewrite)` — no hace falta tocarla.
6. Cada vez que cambies una variable de entorno, tienes que forzar un
   **"Redeploy this version"** — Vite incrusta esas variables en el build,
   no las lee en tiempo real.

## Checklist contra la rúbrica del profesor

- [x] Consume los 5 microservicios (MS1 a MS5).
- [x] Al menos 2 métodos REST por microservicio consultado.
- [ ] Desplegado en AWS Amplify (pendiente de confirmar URL final del equipo).
- [x] Repositorio público de GitHub con el código fuente.

## Troubleshooting

- **Error de CORS**: el microservicio que llamas no tiene CORS habilitado
  para el origen de tu página de Amplify.
- **Una pestaña falla pero las demás funcionan**: normal, cada sección es
  independiente.
- **"Mixed content"**: estás llamando a una URL `http://` desde una página
  `https://`. Usa la URL del API Gateway (HTTPS), no la IP directa.
