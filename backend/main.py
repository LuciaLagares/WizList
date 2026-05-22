from datetime import timedelta
import os
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS
from app.models.user import User
from app.models.list import List
from app.models.rating import Rating
from app.models.character_spell import character_spells
from app.db import db
import random

from app.models.character import Character
from app.models.list_item import ListItem
from app.models.spell import Spell

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'a3f8c2e1d4b7a9f0e3c6d8b1a4f7c2e5d9b3a6f1c4e7d0b8a2f5c9e2d6b4a7f0'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=10)

jwt = JWTManager(app)



CORS(app, origins=['http://localhost:5173'], supports_=True)

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
 
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Bienvenido a Wizlist"}), 200

@app.route("/logout", methods=['POST'])
def logout():
    return jsonify({"message": "Sesión cerrada correctamente"}), 200

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
        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({"message": "Registro exitoso", "access_token": access_token}), 201
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
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Login exitoso", "access_token": access_token}), 200

@app.route("/perfil", methods=["GET"])
@jwt_required()
def get_profile():
    id_usuario = int(get_jwt_identity())

    if not id_usuario:
        return jsonify({"message": "No autenticado"}), 401
    
    user = User.query.get_or_404(id_usuario)
    listas = List.query.filter_by(user_id = id_usuario).all()
    valoraciones = Rating.query.filter_by(user_id=id_usuario).all()

    return jsonify({
        "usuario": user.to_dict(),
        "listas":  [l.to_dict() for l in listas],
        "valoraciones": [v.to_dict() for v in valoraciones]
    }), 200

@app.route("/api/characters")
def get_characters():
    response = requests.get('https://hp-api.onrender.com/api/characters')
    response.raise_for_status()
    return response.json()

@app.route("/api/spells")
def get_spells():
    response = requests.get('https://hp-api.onrender.com/api/spells')
    response.raise_for_status()
    return response.json()

@app.route("/show-characters", methods=["GET"])
def characters_spells():
    characters = get_characters()
    spells = get_spells()
    result = []

    for character in characters:
        result.append({
            "id": character.get("id"),
            "name": character.get("name"),
            "house": character.get("house"),
            "image": character.get("image"),
            "spells": random.sample(spells, min(5, len(spells)))
        })
    return jsonify(result)

@app.route("/character/<string:character_id>/spells", methods=["GET"])
def character_spells(character_id):
    characters = get_characters()
    spells = get_spells()

    character = next(
        (c for c in characters if c.get("id") == character_id),
        None
    )

    if not character:
        return jsonify({"error": f"Personaje '{character_id}' no encontrado"}), 404

    return jsonify({
        "name": character.get("name"),
        "house": character.get("house"),
        "image": character.get("image"),
        "spells": random.sample(spells, min(3, len(spells)))
    })

@app.route("/list/<int:list_id>/add-character", methods=["POST"])
@jwt_required()
def add_to_list(list_id):
    id_usuario = int(get_jwt_identity())
    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401

    lista = List.query.filter_by(id=list_id, user_id=id_usuario).first()
    if not lista:
        return jsonify({"error": "Lista no encontrada"}), 404

    data = request.get_json()

    character = Character.query.get(data["character_id"])
    if not character:
        character = Character(
            id=data["character_id"],
            name=data["character_name"],
            house=data.get("character_house"),
            image=data.get("character_image")
        )
        db.session.add(character)

    for spell_data in data.get("spells", []):
        spell = Spell.query.get(spell_data["id"])
        if not spell:
            spell = Spell(
                id=spell_data["id"],
                name=spell_data["name"],
                description=spell_data.get("description")
            )
            db.session.add(spell)
        if spell not in character.spells:
            character.spells.append(spell)

    ya_existe = ListItem.query.filter_by(
        list_id=list_id,
        character_id=data["character_id"]
    ).first()
    if ya_existe:
        return jsonify({"error": "El personaje ya está en la lista"}), 409

    item = ListItem(
        list_id=list_id,
        character_id=data["character_id"]
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({"message": "Personaje añadido"}), 201

@app.route('/my-lists', methods=["GET"])
@jwt_required()
def get_lists():
    id_usuario = int(get_jwt_identity())
    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401
    listas = List.query.filter_by(user_id=id_usuario).all()
    resultado = []
    for l in listas:
        resultado.append(l.to_dict())
    return jsonify(resultado), 200

@app.route("/list", methods=["POST"])
@jwt_required()
def create_list():
    id_usuario = int(get_jwt_identity())
    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401

    data = request.get_json()
    nueva_lista = List(
        title=data.get("title"),
        description=data.get("description", ""),
        is_public=data.get("is_public", True),
        user_id=id_usuario
    )
    db.session.add(nueva_lista)
    db.session.commit()
    return jsonify(nueva_lista.to_dict()), 201

@app.route("/list/<int:list_id>", methods=["GET"])
@jwt_required()
def show_list(list_id):
    id_usuario = int(get_jwt_identity())
    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401
    lista = List.query.get_or_404(list_id)
    items = []

    for i in lista.items:
        if i.character_id:
            character = Character.query.get(i.character_id)
            spell_list = []
            for spell in character.spells:
                spell_list.append({
                    "name": spell.name,
                    "description": spell.description
                })
            items.append({
                "tipo": "character",
                "id": character.id,
                "name": character.name,
                "house": character.house,
                "image": character.image,
                "spells": spell_list
            })
    return jsonify({
        "id": lista.id,
        "title": lista.title,
        "description": lista.description,
        "is_public": lista.is_public,
        "items": items
    }), 200

@app.route("/public-lists", methods=["GET"])
def get_public_lists():
    listas = List.query.filter_by(is_public=True).all()
    resultado = []
    for item in listas:
        user = User.query.get(item.user_id)
        d = item.to_dict()
        if user:
            d["username"] = user.username
        else:
            d["username"] = 'Desconocido'
        resultado.append(d)
    return jsonify(resultado), 200

@app.route("/<int:user_id>/perfil", methods=["GET"])
def show_profile(user_id):
    user = User.query.get_or_404(user_id)
    listas = List.query.filter_by(user_id=user_id, is_public=True).all()
    resul = []
    for l in listas:
        resul.append(l.to_dict())
    return jsonify({
        "usuario": user.to_dict(),
        "listas": resul
    }),200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)