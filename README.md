# WizList

WizList es una aplicación fullstack para crear listas de personajes, compartir listas públicas, y valorar personajes.

## Tecnologías

- Backend: Python 3.11, Flask, SQLAlchemy, Flask-JWT-Extended
- Frontend: React, Vite, TypeScript, TailwindCSS / DaisyUI
- Base de datos: MySQL 8.0
- Contenedores: Docker, Docker Compose

## Estructura del proyecto

- `backend/`: servidor Flask, modelos, rutas y tests
- `frontend/`: aplicación React + Vite
- `docker-compose.yml`: orquesta MySQL + backend + frontend
- `db/init.sql`: inicialización de la base de datos

## Ejecutar con Docker

```bash
docker compose up --build
```

Esto levantará:

- MySQL en `localhost:3306`
- backend en `http://localhost:5000`
- frontend en `http://localhost:5173`

## Ejecutar local sin Docker

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask --app main.py run --host=0.0.0.0 --port=5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

### Backend

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `SECRET_KEY`
- `FLASK_ENV`

### Frontend

- `VITE_API_URL`

## Scripts útiles

### Frontend

- `npm run dev` — iniciar servidor de desarrollo
- `npm run build` — compilar para producción
- `npm run lint` — ejecutar ESLint

### Backend

- `python -m pytest -q` — ejecutar tests

## Notas

- La base de datos se inicializa con `db/init.sql`.
- El backend depende de que MySQL esté disponible antes de arrancar.
- Si usas Docker Compose, el servicio `backend` espera que `db` esté saludable.
