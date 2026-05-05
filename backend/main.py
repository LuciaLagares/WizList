import os
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from app.models.user import User
from app.db import db

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.environ.get('DB_USER')}:{os.environ.get('DB_PASSWORD')}"
    f"@{os.environ.get('DB_HOST')}:{os.environ.get('DB_PORT')}/{os.environ.get('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar db con la app
db.init_app(app)

# Crear las tablas si no existen
with app.app_context():
    db.create_all()
 
@app.route("/register", methods=['POST'])
def registrer():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user_exists = User.query.filter_by(username=username).first()

    if user_exists:
        return jsonify({"message": "El nombre ya es de un usuario"}), 409
    
    new_user = User(
        username = username,
        password = generate_password_hash(password),
        role = 'normal'
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registro exitoso"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al registrar", "error": str(e)}), 500
    
@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

    return jsonify({"message": "Login exitoso"}), 200

@app.route("/api/characters")
def get_characters():
    response = requests.get('https://hp-api.onrender.com/api/characters')
    return jsonify(response.json())

@app.route("/api/spells")
def get_spells():
    response = requests.get('https://hp-api.onrender.com/api/spells')
    return jsonify(response.json())

@app.route("/detail/<string:id>/")
def get_details(id):
    response = requests.get('https://hp-api.onrender.com/api/character/'+id)
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)