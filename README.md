# La Sazón — Frontend

Página web del proyecto de Cloud Computing (Restaurante). Consume MS1, MS2,
MS3 y MS4. Hecho con React + Vite.

## Qué consume cada sección

| Pestaña | Microservicio | Endpoints |
|---|---|---|
| Carta | MS2 | `GET /api/v1/categorias`, `GET /api/v1/platos` |
| Pedidos | MS1 | `GET /clientes`, `GET /pedidos` |
| Reservas | MS3 | `GET /mesas`, `GET /reservas` |
| Comanda | MS4 | `GET /comandas/{pedidoId}` |

Cada sección usa al menos 2 métodos REST de su microservicio (excepto
Comanda, que usa el único endpoint de MS4 — que a su vez internamente ya
combina MS1 y MS2).

## Correrlo en desarrollo

```bash
npm install
cp .env.example .env
npm run dev
```

Abre `http://localhost:5173`. Por defecto apunta a:
- MS1: `http://localhost:8000`
- MS2: `http://localhost:8082`
- MS3: `http://localhost:8003`
- MS4: `http://localhost:8083`

Asegúrate de tener los 4 corriendo antes de abrir la página (o al menos los
que quieras probar — cada sección falla de forma independiente si su
microservicio no responde, no rompe las demás pestañas).

## Cambiar las URLs (cuando tengan EC2 / API Gateway)

Edita `.env` (para desarrollo local) con las URLs reales:

```
VITE_MS1_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms1
VITE_MS2_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms2
VITE_MS3_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms3
VITE_MS4_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/ms4
```

**Importante:** si el frontend se sirve en HTTPS (como pasará en Amplify),
las 4 URLs también deben ser HTTPS — un navegador bloquea llamadas HTTP
desde una página HTTPS ("mixed content"). Por eso, si algún microservicio
solo tiene una IP pública de EC2 en `http://`, no va a funcionar cuando el
frontend esté desplegado; hay que exponerlo con HTTPS (API Gateway, o un
certificado en la propia VM).

## Desplegar en AWS Amplify

1. Sube este proyecto a un repo de GitHub.
2. En Amplify Hosting, conecta el repo, rama `main`.
3. Build settings (debería detectarlo solo, si no, usa esto):
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
4. En **Environment variables**, agrega `VITE_MS1_URL`, `VITE_MS2_URL`,
   `VITE_MS3_URL`, `VITE_MS4_URL` con las URLs reales de cada microservicio.
   No las dejes quemadas en el código — así, cuando cambien, solo actualizas
   la variable en Amplify y rehaces el deploy.
5. **Rewrite de SPA** (importante, si no cualquier refresh en una ruta que no
   sea `/` da 404): en Amplify Hosting → Rewrites and redirects, agrega
   Source `/<*>`, Target `/index.html`, tipo **200 (Rewrite)**.

## Troubleshooting

- **Error de CORS en la consola**: el microservicio que estás llamando no
  tiene configurado CORS para aceptar el origen de tu página de Amplify.
  Avísale a quien mantiene ese microservicio.
- **Una pestaña muestra error pero las demás funcionan**: normal, cada
  sección llama a su propio microservicio de forma independiente. Revisa
  solo el que falla.
- **"Mixed content" en la consola**: estás llamando a una URL `http://`
  desde una página `https://`. Cambia esa variable de entorno a una URL
  `https://` (ver sección de arriba).
