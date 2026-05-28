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
from flask_migrate import Migrate
import random

from app.models.character import Character
from app.models.list_item import ListItem
from app.models.spell import Spell

app = Flask(__name__)
migrate = Migrate(app, db)

app.config['JWT_SECRET_KEY'] = 'a3f8c2e1d4b7a9f0e3c6d8b1a4f7c2e5d9b3a6f1c4e7d0b8a2f5c9e2d6b4a7f0'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=10)

jwt = JWTManager(app)



CORS(app, origins=['http://localhost:5173'], supports_credentials=True)

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
    listas_resultado = []
    valoraciones_resultado = []

    for l in listas:
        listas_resultado.append(l.to_dict())

    for v in valoraciones:
        valoraciones_resultado.append(v.to_dict())
    return jsonify({
        "usuario": user.to_dict(),
        "listas":  listas_resultado,
        "valoraciones": valoraciones_resultado
    }), 200

def fetch_characters():
    response = requests.get('https://hp-api.onrender.com/api/characters')
    response.raise_for_status()
    return response.json()

def get_characters():
    return jsonify(fetch_characters())

@app.route("/api/spells")
def get_spells():
    response = requests.get('https://hp-api.onrender.com/api/spells')
    response.raise_for_status()
    return response.json()

@app.route("/show-characters", methods=["GET"])
def characters_spells():
    characters = fetch_characters()
    spells = get_spells()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 6, type=int)

    total = len(characters)
    start = (page - 1) * per_page
    end = start + per_page
    characters_page = characters[start:end]

    result = []
    for character in characters_page:
        result.append({
            "id": character.get("id"),
            "name": character.get("name"),
            "house": character.get("house"),
            "image": character.get("image"),
            "spells": random.sample(spells, min(5, len(spells)))
        })

    return jsonify({
        "characters": result,
        "total": total,
        "pages": -(-total // per_page),
        "current_page": page,
        "has_next": end < total,
        "has_prev": page > 1
    })

@app.route("/character/<string:character_id>/spells", methods=["GET"])
def character_spells(character_id):
    characters = fetch_characters()
    spells = get_spells()

    character = next(
        (c for c in characters if c.get("id") == character_id),
        None
    )

    if not character:
        return jsonify({"error": f"Personaje '{character_id}' no encontrado"}), 404

    return jsonify({
        "id": character.get("id"),
        "name": character.get("name"),
        "house": character.get("house"),
        "image": character.get("image"),
        "alternate_names": character.get("alternate_names", []),
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

    ya_existe = ListItem.query.filter_by(
    list_id=list_id,
    character_id=data["character_id"]
    ).first()
    if ya_existe:
        return jsonify({"error": "El personaje ya está en la lista"}), 409
    
    item = ListItem(list_id=list_id, character_id=data["character_id"], spells=data.get("spells", []))
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
    user = User.query.get(lista.user_id) 
    items = []

    for i in lista.items:
        if i.character_id:
            character = Character.query.get(i.character_id)
            items.append({
                "tipo": "character",
                "id": character.id,
                "name": character.name,
                "house": character.house,
                "image": character.image,
                "spells": i.spells or []
            })
    return jsonify({
        "id": lista.id,
        "title": lista.title,
        "description": lista.description,
        "is_public": lista.is_public,
        "user_id": lista.user_id,               
        "username": user.username if user else "Desconocido",
        "items": items
    }), 200

@app.route("/public-lists", methods=["GET"])
def get_public_lists():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 4, type=int)

    paginacion = List.query.filter_by(is_public=True).paginate(page=page, per_page=per_page)
    resultado = []
    for item in paginacion:
        user = User.query.get(item.user_id)
        d = item.to_dict()
        if user:
            d["username"] = user.username
        else:
            d["username"] = 'Desconocido'
        resultado.append(d)
    return jsonify({
        "listas": resultado,
        "total": paginacion.total,
        "pages": paginacion.pages
    }), 200

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

@app.route("/rating", methods=["POST"])
@jwt_required()
def crear_rating():
    user_id = get_jwt_identity()
    data = request.json

    character_id = data.get("character_id")
    rate = data.get("rate")
    is_favourite = data.get("is_favourite")

    if character_id:
        character = Character.query.get(character_id)
        if not character:
            character = Character(
                id=character_id,
                name=data.get("character_name"),
                house=data.get("character_house"),
                image=data.get("character_image"),
            )
            db.session.add(character)

    rating = Rating.query.filter_by(
        user_id=user_id, character_id=character_id
    ).first()

    if rating:
        if rate is not None:
            rating.rate = rate
        if is_favourite is not None:
            rating.is_favourite = is_favourite
    
    else:
        rating = Rating(user_id=user_id, character_id=character_id,  rate=rate, is_favorite=is_favourite or False)
        db.session.add(rating)
    db.session.commit()
    return jsonify(rating.to_dict()), 200

@app.route("/rating/character/<character_id>", methods=["GET"])
@jwt_required()
def get_rating_character(character_id):
    user_id = get_jwt_identity()
    rating = Rating.query.filter_by(user_id=user_id, character_id=character_id).first()
    if not rating:
        return jsonify(None), 200
    return jsonify(rating.to_dict()), 200

@app.route("/valoraciones/<int:rating_id>", methods=["PUT"])
@jwt_required()
def update_rating(rating_id):
    user_id = get_jwt_identity()
    rating = Rating.query.filter_by(id=rating_id, user_id=user_id).first()
    if not rating:
        return jsonify({"error": "Valoración no encontrada"}), 404

    data = request.get_json()
    rate = data.get("rate")
    if rate is not None:
        rating.rate = rate

    db.session.commit()
    return jsonify(rating.to_dict()), 200

@app.route("/valoraciones/<int:rating_id>", methods=["DELETE"])
@jwt_required()
def delete_rating(rating_id):
    user_id = get_jwt_identity()
    rating = Rating.query.filter_by(id=rating_id, user_id=user_id).first()
    if not rating:
        return jsonify({"error": "Valoración no encontrada"}), 404

    db.session.delete(rating)
    db.session.commit()
    return jsonify({"message": "Valoración eliminada"}), 200

@app.route("/listas/<int:lista_id>", methods=["DELETE"])
@jwt_required()
def delete_list(lista_id):
    user_id = get_jwt_identity()
    lista = List.query.filter_by(id=lista_id, user_id=user_id).first()
    if not lista:
        return jsonify({"error": "Lista no encontrada"}), 404

    db.session.delete(lista)
    db.session.commit()
    return jsonify({"message": "Lista eliminada"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)