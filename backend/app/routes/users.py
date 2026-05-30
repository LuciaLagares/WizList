from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.list import List
from app.models.rating import Rating
from app.models.character import Character

users_bp = Blueprint("users", __name__)


@users_bp.route("/perfil", methods=["GET"])
@jwt_required()
def get_my_profile():
    id_usuario = int(get_jwt_identity())
    user = User.query.get_or_404(id_usuario)
    listas = List.query.filter_by(user_id=id_usuario).all()
    valoraciones = Rating.query.filter_by(user_id=id_usuario).all()
    
    listas_items = []
    
    for l in listas:
        items = []
        for i in l.items:
            if i.character_id:
                character = Character.query.get(i.character_id) 
                if character:
                    items.append({"house": character.house})
        d = l.to_dict()
        d['items'] = items
        listas_items.append(d)
    valoracion_array = []
    for v in valoraciones:
        valoracion_array.append(v.to_dict())
    return jsonify({
        "usuario": user.to_dict(),
        "listas":listas_items,
        "valoraciones": valoracion_array,
    }), 200


@users_bp.route("/<int:user_id>/perfil", methods=["GET"])
def get_public_profile(user_id):
    user = User.query.get_or_404(user_id)
    listas = List.query.filter_by(user_id=user_id, is_public=True).all()
    resul = []
    
    for l in listas:
        resul.append(l.to_dict())
    return jsonify({
        "usuario": user.to_dict(),
        "listas": resul,
    }), 200