from datetime import timedelta
import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from app.db import db


def create_app():
    app = Flask(__name__)

    # Configuración
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=10)
    app.config["SQLALCHEMY_DATABASE_URI"] = (
    os.environ.get("SQLALCHEMY_DATABASE_URI") or
    os.environ.get("DATABASE_URL")
)
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Extensiones
    db.init_app(app)
    JWTManager(app)
    CORS(app, origins=[os.environ.get("FRONTEND_URL", "http://localhost:5173")], supports_credentials=True)
    Migrate(app, db)

    # Blueprints
    from app.routes import auth_bp, characters_bp, lists_bp, ratings_bp, users_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(characters_bp)
    app.register_blueprint(lists_bp)
    app.register_blueprint(ratings_bp)
    app.register_blueprint(users_bp)

    # Ruta raíz
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "Bienvenido a Wizlist"}), 200

    # Crear tablas si no existen
    with app.app_context():
        db.create_all()

    return app