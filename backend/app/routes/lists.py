from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import db
from app.models.list import List
from app.models.list_item import ListItem
from app.models.character import Character
from app.models.user import User

lists_bp = Blueprint("lists", __name__)


@lists_bp.route("/list", methods=["POST"])
@jwt_required()
def create_list():
    id_usuario = int(get_jwt_identity())
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


@lists_bp.route("/my-lists", methods=["GET"])
@jwt_required()
def get_my_lists():
    id_usuario = int(get_jwt_identity())
    listas = List.query.filter_by(user_id=id_usuario).all()
    return jsonify([l.to_dict() for l in listas]), 200


@lists_bp.route("/list/<int:list_id>", methods=["GET"])
@jwt_required()
def show_list(list_id):
    lista = List.query.get_or_404(list_id)
    user = User.query.get(lista.user_id)
    items = []

    for i in lista.items:
        if i.character_id:
            character = Character.query.get(i.character_id)
            if character:
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


@lists_bp.route("/list/<int:list_id>/add-character", methods=["POST"])
@jwt_required()
def add_to_list(list_id):
    id_usuario = int(get_jwt_identity())
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

    if ListItem.query.filter_by(list_id=list_id, character_id=data["character_id"]).first():
        return jsonify({"error": "El personaje ya está en la lista"}), 409

    item = ListItem(
        list_id=list_id,
        character_id=data["character_id"],
        spells=data.get("spells", [])
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Personaje añadido"}), 201


@lists_bp.route("/listas/<int:list_id>", methods=["PUT"])
@jwt_required()
def update_list(list_id):
    id_usuario = int(get_jwt_identity())
    lista = List.query.filter_by(id=list_id, user_id=id_usuario).first()
    if not lista:
        return jsonify({"error": "Lista no encontrada"}), 404

    data = request.get_json()

    title = data.get("title")
    if title is not None:
        lista.title = title

    items = data.get("items")
    if items is not None:
        lista.items.clear()
        for item_data in items:
            lista.items.append(ListItem(
                list_id=list_id,
                character_id=item_data.get("character_id"),
                spells=item_data.get("spells")
            ))

    db.session.commit()
    return jsonify(lista.to_dict()), 200


@lists_bp.route("/listas/<int:lista_id>", methods=["DELETE"])
@jwt_required()
def delete_list(lista_id):
    id_usuario = int(get_jwt_identity())
    lista = List.query.filter_by(id=lista_id, user_id=id_usuario).first()
    if not lista:
        return jsonify({"error": "Lista no encontrada"}), 404

    db.session.delete(lista)
    db.session.commit()
    return jsonify({"message": "Lista eliminada"}), 200


@lists_bp.route("/public-lists", methods=["GET"])
def get_public_lists():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 4, type=int)

    paginacion = List.query.filter_by(is_public=True).paginate(page=page, per_page=per_page)
    resultado = []
    for item in paginacion:
        user = User.query.get(item.user_id)
        d = item.to_dict()
        d["username"] = user.username if user else "Desconocido"
        resultado.append(d)

    return jsonify({
        "listas": resultado,
        "total": paginacion.total,
        "pages": paginacion.pages
    }), 200