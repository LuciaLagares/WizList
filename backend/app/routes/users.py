from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.list import List
from app.models.rating import Rating
from app.models.character import Character

users_bp = Blueprint("users", __name__)


@users_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_my_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    lists = List.query.filter_by(user_id=user_id).all()
    ratings = Rating.query.filter_by(user_id=user_id).all()
    
    items_lists = []
    
    for l in lists:
        items = []
        for i in l.items:
            if i.character_id:
                character = Character.query.get(i.character_id) 
                if character:
                    items.append({"house": character.house})
        d = l.to_dict()
        d['items'] = items
        items_lists.append(d)
    valoracion_array = []
    for v in ratings:
        valoracion_array.append(v.to_dict())
    return jsonify({
        "user": user.to_dict(),
        "lists":items_lists,
        "ratings": valoracion_array,
    }), 200


@users_bp.route("/<int:user_id>/profile", methods=["GET"])
def get_public_profile(user_id):
    user = User.query.get_or_404(user_id)
    lists = List.query.filter_by(user_id=user_id, is_public=True).all()
    resul = []
    
    for l in lists:
        resul.append(l.to_dict())
    return jsonify({
        "usuuserario": user.to_dict(),
        "lists": resul,
    }), 200