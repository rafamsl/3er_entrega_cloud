# CoderHouse_proyecto

## API Docs
Documentacion API en `{{host}}/api-docs/` or `https://coderhouse-proyecto.up.railway.app/api-docs`.
Existen endpoints para:
- CRUD usuarios
- CRUD carritos
- CRUD productos
- Agregar o remover productos de un carrito
- Finalizar compra

## Frontend
Estos endpoints iniciales existen en el frontend
- `{{host}}/register` or `https://coderhouse-proyecto.up.railway.app/register`
- `{{host}}/home` or `https://coderhouse-proyecto.up.railway.app/home`
- `{{host}}/chat` or or `https://coderhouse-proyecto.up.railway.app/chat`

Usuarios tambien pueden:
- Crear productos
- Agregar y remover productos del carrito
- Finalizar compra (Se envia mail y SMS a usuario y admin)
- Usar el chat para ver todos los mensajes o solo los suyos `chat/{email}`

## Environment Variables
Esas son las Env Vars
- `ACCESS_TOKEN_SECRET`
- `DAO` (should be set to `mongo`)
- `ETH_PASS`
- `GMAIL_PASS`
- `MONGO_URL`
- `NODE_END` (should be set to `DEV`)
- `PORT` (should be set to `8080`)
- `RANDOM`
- `REFRESH_TOKEN_SECRET`
- `TIMEOUT` (tiempo acceptable para los tests)
- `TWILIO_ACCOUNT`
- `TWILIO_TOKEN`

## Tests
- `npm run test` simula el path de creacion de usuario y de un producto