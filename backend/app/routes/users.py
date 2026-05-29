from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.list import List
from app.models.rating import Rating

users_bp = Blueprint("users", __name__)


@users_bp.route("/perfil", methods=["GET"])
@jwt_required()
def get_my_profile():
    id_usuario = int(get_jwt_identity())
    user = User.query.get_or_404(id_usuario)
    listas = List.query.filter_by(user_id=id_usuario).all()
    valoraciones = Rating.query.filter_by(user_id=id_usuario).all()

    return jsonify({
        "usuario": user.to_dict(),
        "listas": [l.to_dict() for l in listas],
        "valoraciones": [v.to_dict() for v in valoraciones]
    }), 200


@users_bp.route("/<int:user_id>/perfil", methods=["GET"])
def get_public_profile(user_id):
    user = User.query.get_or_404(user_id)
    listas = List.query.filter_by(user_id=user_id, is_public=True).all()

    return jsonify({
        "usuario": user.to_dict(),
        "listas": [l.to_dict() for l in listas]
    }), 200