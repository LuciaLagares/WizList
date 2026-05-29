from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import db
from app.models.rating import Rating
from app.models.character import Character

ratings_bp = Blueprint("ratings", __name__)


@ratings_bp.route("/rating", methods=["POST"])
@jwt_required()
def create_or_update_rating():
    user_id = get_jwt_identity()
    data = request.get_json()

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

    rating = Rating.query.filter_by(user_id=user_id, character_id=character_id).first()
    if rating:
        if rate is not None:
            rating.rate = rate
        if is_favourite is not None:
            rating.is_favourite = is_favourite
    else:
        rating = Rating(
            user_id=user_id,
            character_id=character_id,
            rate=rate,
            is_favorite=is_favourite or False
        )
        db.session.add(rating)

    db.session.commit()
    return jsonify(rating.to_dict()), 200


@ratings_bp.route("/rating/character/<string:character_id>", methods=["GET"])
@jwt_required()
def get_rating_by_character(character_id):
    user_id = get_jwt_identity()
    rating = Rating.query.filter_by(user_id=user_id, character_id=character_id).first()
    if not rating:
        return jsonify(None), 200
    return jsonify(rating.to_dict()), 200


@ratings_bp.route("/valoraciones/<int:rating_id>", methods=["PUT"])
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


@ratings_bp.route("/valoraciones/<int:rating_id>", methods=["DELETE"])
@jwt_required()
def delete_rating(rating_id):
    user_id = get_jwt_identity()
    rating = Rating.query.filter_by(id=rating_id, user_id=user_id).first()
    if not rating:
        return jsonify({"error": "Valoración no encontrada"}), 404

    db.session.delete(rating)
    db.session.commit()
    return jsonify({"message": "Valoración eliminada"}), 200