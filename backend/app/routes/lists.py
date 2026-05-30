from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import db
from app.models.list import List
from app.models.list_item import ListItem
from app.models.character import Character
from app.models.user import User
from app.validations import validates

lists_bp = Blueprint("lists", __name__)


@lists_bp.route("/list", methods=["POST"])
@jwt_required()
def create_list():
    id_usuario = int(get_jwt_identity())
    data = request.get_json() or {}

    err, status = validates({
        "title":       {"required": True,  "type": str,  "min_length": 1, "max_length": 100},
        "description": {"required": False, "type": str,  "max_length": 255},
        "is_public":   {"required": False, "allowed": [True, False]},
    }, data)

    if err:
        return err, status

    new_list = List(
        title=data.get("title"),
        description=data.get("description", ""),
        is_public=data.get("is_public", True),
        user_id=id_usuario
    )
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.to_dict()), 201


@lists_bp.route("/my-lists", methods=["GET"])
@jwt_required()
def get_my_lists():
    user_id = int(get_jwt_identity())
    lists = List.query.filter_by(user_id=user_id).all()
    result = []
    for l in lists:
        result.append(l.to_dict())
    return jsonify(result), 200


@lists_bp.route("/list/<int:list_id>", methods=["GET"])
@jwt_required()
def show_list(list_id):
    list = List.query.get_or_404(list_id)
    user = User.query.get(list.user_id)
    items = []

    for i in list.items:
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
        "id": list.id,
        "title": list.title,
        "description": list.description,
        "is_public": list.is_public,
        "user_id": list.user_id,
        "username": user.username if user else "Desconocido",
        "items": items
    }), 200


@lists_bp.route("/list/<int:list_id>/add-character", methods=["POST"])
@jwt_required()
def add_to_list(list_id):
    user_id = int(get_jwt_identity())
    list = List.query.filter_by(id=list_id, user_id=user_id).first()
    if not list:
        return jsonify({"error": "Lista no encontrada"}), 404

    data = request.get_json() or {}

    err, status = validates({
        "character_id":   {"required": True, "type": str},
        "character_name": {"required": True, "type": str, "max_length": 100},
    }, data)

    if err:
        return err, status
    
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


@lists_bp.route("/lists/<int:list_id>", methods=["PUT"])
@jwt_required()
def update_list(list_id):
    user_id = int(get_jwt_identity())
    list = List.query.filter_by(id=list_id, user_id=user_id).first()
    if not list:
        return jsonify({"error": "Lista no encontrada"}), 404

    data = request.get_json() or {}

    err, status = validates({
        "title": {"required": False, "type": str, "min_length": 1, "max_length": 100},
    }, data)

    if err:
        return err, status

    title = data.get("title")
    if title is not None:
        list.title = title

    items = data.get("items")
    if items is not None:
        list.items.clear()
        for item_data in items:
            list.items.append(ListItem(
                list_id=list_id,
                character_id=item_data.get("character_id"),
                spells=item_data.get("spells")
            ))

    db.session.commit()
    return jsonify(list.to_dict()), 200


@lists_bp.route("/lists/<int:list_id>", methods=["DELETE"])
@jwt_required()
def delete_list(list_id):
    user_id = int(get_jwt_identity())
    list = List.query.filter_by(id=list_id, user_id=user_id).first()
    if not list:
        return jsonify({"error": "Lista no encontrada"}), 404

    db.session.delete(list)
    db.session.commit()
    return jsonify({"message": "Lista eliminada"}), 200


@lists_bp.route("/public-lists", methods=["GET"])
def get_public_lists():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 4, type=int)

    paginacion = List.query.filter_by(is_public=True).paginate(page=page, per_page=per_page)
    result = []
    for item in paginacion:
        user = User.query.get(item.user_id)
        d = item.to_dict()
        d["username"] = user.username if user else "Desconocido"
        result.append(d)

    return jsonify({
        "lists": result,
        "total": paginacion.total,
        "pages": paginacion.pages
    }), 200

@lists_bp.route("/list/<int:list_id>/favorite", methods=["PATCH"])
@jwt_required()
def toggle_favorite(list_id):
    user_id = int(get_jwt_identity())
    list = List.query.filter_by(id=list_id, user_id=user_id).first()
    if not list:
        return jsonify({"error": "Lista no encontrada"}), 404

    list.is_favorite = not list.is_favorite
    db.session.commit()
    return jsonify(list.to_dict()), 200