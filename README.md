<div align="center">

# WizList

REST API y frontend para crear listas de personajes, compartir listas públicas y valorar personajes.

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://mysql.com)

</div>

<br/>

## Demo

- **Frontend:** https://wiz-list.vercel.app
- **Backend:** https://wizlist-production.up.railway.app

## Architecture

HTTP Request
│
▼
Routes ← valida input, responde JSON
│
▼
Models / Clients← consultas y llamadas externas
│
▼
Database ← MySQL 8.0 (Aiven)

## Quick Start

### Frontend local

```bash
cd frontend
npm install
npm run dev
```

### Backend local

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask --app main.py run --host=0.0.0.0 --port=5000
```

## Configuration

### Backend (Railway)

| Variable                  | Description                   |
| ------------------------- | ----------------------------- |
| `SQLALCHEMY_DATABASE_URI` | URI completa de MySQL (Aiven) |
| `JWT_SECRET_KEY`          | Clave secreta para JWT        |
| `FRONTEND_URL`            | URL del frontend en Vercel    |
| `FLASK_ENV`               | `production`                  |

### Frontend (Vercel)

| Variable       | Description                |
| -------------- | -------------------------- |
| `VITE_API_URL` | URL del backend en Railway |

## Project Structure

backend/
├── Procfile
├── main.py
├── requirements.txt
└── app/
├── db.py
├── models/
└── routes/
frontend/
├── package.json
└── src/
