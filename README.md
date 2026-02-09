# libreria
Catálogo de libros y reseñas

## Descripción
Este proyecto proporciona un API REST para gestionar reseñas de libros, permitiendo crear, leer, actualizar, buscar y eliminar reseñas.

## Instalación

```bash
npm install
```

## Uso

Para iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

## Estructura de una Reseña

Cada reseña tiene el siguiente formato:

```json
{
  "id": 1,
  "autores": ["Nombre del Autor"],
  "titulo": "Título del Libro",
  "serie": "Nombre de la Serie o N/A",
  "valoracion": 5,
  "comentarios": "Comentarios sobre el libro"
}
```

## Endpoints del API

### 1. Obtener todas las reseñas
- **Método:** GET
- **URL:** `/api/resenas`
- **Respuesta:** Array de todas las reseñas

```bash
curl http://localhost:3000/api/resenas
```

### 2. Obtener una reseña por ID
- **Método:** GET
- **URL:** `/api/resenas/:id`
- **Respuesta:** Objeto de la reseña solicitada

```bash
curl http://localhost:3000/api/resenas/1
```

### 3. Buscar reseñas
- **Método:** GET
- **URL:** `/api/resenas/buscar/query`
- **Parámetros de búsqueda (query params):**
  - `autor`: Buscar por nombre de autor (búsqueda parcial)
  - `titulo`: Buscar por título (búsqueda parcial)
  - `serie`: Buscar por serie (búsqueda parcial)
  - `valoracion`: Buscar por valoración mínima

```bash
# Buscar por autor
curl "http://localhost:3000/api/resenas/buscar/query?autor=García"

# Buscar por valoración mínima
curl "http://localhost:3000/api/resenas/buscar/query?valoracion=4"

# Buscar por múltiples criterios
curl "http://localhost:3000/api/resenas/buscar/query?autor=García&valoracion=5"
```

### 4. Crear una nueva reseña
- **Método:** POST
- **URL:** `/api/resenas`
- **Body (JSON):**

```json
{
  "autores": ["Nombre del Autor"],
  "titulo": "Título del Libro",
  "serie": "Nombre de la Serie",
  "valoracion": 4,
  "comentarios": "Mis comentarios"
}
```

```bash
curl -X POST http://localhost:3000/api/resenas \
  -H "Content-Type: application/json" \
  -d '{
    "autores": ["Jorge Luis Borges"],
    "titulo": "Ficciones",
    "serie": "N/A",
    "valoracion": 5,
    "comentarios": "Obra maestra de la literatura argentina"
  }'
```

### 5. Actualizar una reseña existente
- **Método:** PUT
- **URL:** `/api/resenas/:id`
- **Body (JSON):** Campos a actualizar

```bash
curl -X PUT http://localhost:3000/api/resenas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "valoracion": 5,
    "comentarios": "Comentario actualizado"
  }'
```

### 6. Eliminar una reseña
- **Método:** DELETE
- **URL:** `/api/resenas/:id`

```bash
curl -X DELETE http://localhost:3000/api/resenas/1
```

## Validaciones

- `autores`: Requerido, debe ser un array con al menos un elemento
- `titulo`: Requerido, debe ser una cadena de texto
- `valoracion`: Opcional, debe ser un número entre 1 y 5
- `serie`: Opcional, valor por defecto "N/A"
- `comentarios`: Opcional

## Estructura del Proyecto

```
libreria/
├── api.js           # Servidor Express con todos los endpoints
├── resenas.json     # Archivo JSON con las reseñas
├── package.json     # Configuración de npm
├── .gitignore       # Archivos a ignorar por git
└── README.md        # Este archivo
```

