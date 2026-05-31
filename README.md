<div align="center">

# WizList

REST API y frontend para crear listas de personajes, compartir listas públicas y valorar personajes.

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://mysql.com)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-1.29-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

</div>

<br/>

## Why this project?

WizList es una aplicación fullstack orientada a listas de personajes y valoraciones. El backend expone rutas HTTP que validan la entrada y entregan respuestas JSON, mientras que el frontend consume esas rutas desde React/Vite.

La idea central es mantener cada capa enfocada: rutas para HTTP, modelos para persistencia y lógica de negocio donde convenga.

## Architecture

```
HTTP Request
     │
     ▼
  Routes          ← valida input, responde JSON
     │
     ▼
  Models / Clients← consultas y llamadas externas
     │
     ▼
  Database        ← MySQL 8.0
```

## Database

La base de datos se inicializa con `db/init.sql`.

## Quick Start

**Requirements:** Python 3.11, Docker.

```bash
python -m venv venv
venv\Scripts\activate
cd backend
pip install -r requirements.txt
```

### Con Docker Compose

```bash
docker compose up --build
```

Esto levantará:

- MySQL en `localhost:3306`
- backend en `http://localhost:5000`
- frontend en `http://localhost:5173`

### Sin Docker (solo backend)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask --app main.py run --host=0.0.0.0 --port=5000
```

### Frontend local

```bash
cd frontend
npm install
npm run dev
```

## Commands

| Command                     | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `docker compose up --build` | Levantar todos los servicios con Docker Compose |
| `npm run dev`               | Iniciar frontend en desarrollo                  |
| `npm run build`             | Compilar frontend para producción               |
| `npm run lint`              | Ejecutar ESLint en frontend                     |
| `python -m pytest -q`       | Ejecutar tests del backend                      |

## Configuration

| Variable       | Description                      | Default                 |
| -------------- | -------------------------------- | ----------------------- |
| `DB_HOST`      | Host de la base de datos         | `db` en Docker          |
| `DB_PORT`      | Puerto de MySQL                  | `3306`                  |
| `DB_NAME`      | Nombre de la base de datos       | `wizlist`               |
| `DB_USER`      | Usuario de MySQL                 | `wizuser`               |
| `DB_PASSWORD`  | Contraseña de MySQL              | `wizpassword`           |
| `SECRET_KEY`   | Clave secreta de Flask/JWT       | —                       |
| `FLASK_ENV`    | Entorno de Flask                 | `development`           |
| `VITE_API_URL` | URL del backend para el frontend | `http://localhost:5000` |

## Project Structure

```
backend/
├── Dockerfile
├── main.py
├── requirements.txt
├── app/
│   ├── db.py
│   ├── validations.py
│   ├── clients/
│   ├── models/
│   └── routes/
├── db/
│   └── init.sql
└── tests/

frontend/
├── Dockerfile
├── package.json
├── tsconfig.json
└── src/
```

## Notes

- El backend depende de que MySQL esté disponible.
- `docker compose up --build` es la forma recomendada para levantar todo el stack.
- El frontend consume el backend en `http://localhost:5000`.
