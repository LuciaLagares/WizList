import random
from flask import Blueprint, jsonify, request
from app.clients.hp_client import fetch_characters, fetch_spells

characters_bp = Blueprint("characters", __name__)

@characters_bp.route("/show-characters", methods=["GET"])
def characters_spells():
    try:
        characters = fetch_characters()
        spells = fetch_spells()
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502
    
    search = request.args.get("search", "", type=str).strip().lower()
    if search:
        filtered = []
        for c in characters:
            if search in c.get("name", "").lower():
                filtered.append(c)
        characters = filtered
            
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 6, type=int)
 
    total = len(characters)
    start = (page - 1) * per_page
    end = start + per_page
    characters_page = characters[start:end]
    
    result = []

    for c in characters_page:
        object_formatted = {
                "id": c.get("id"),
                "name": c.get("name"),
                "house": c.get("house"),
                "image": c.get("image"),
                "spells": random.sample(spells, min(5, len(spells)))
            }
        result.append(object_formatted)
 
    return jsonify({
        "characters": result,
        "total": total,
        "pages": -(-total // per_page),
        "current_page": page,
        "has_next": end < total,
        "has_prev": page > 1
    }), 200
 
 
@characters_bp.route("/character/<string:character_id>/spells", methods=["GET"])
def character_detail(character_id):
    try:
        characters = fetch_characters()
        spells = fetch_spells()
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502
 
    character_formatted = None
    for character in characters:
        if character.get('id') == character_id:
            character_formatted = character
            break

    if not character_formatted:
        return jsonify({"error": f"Personaje '{character_id}' no encontrado"}), 404
 
    return jsonify({
        "id": character_formatted.get("id"),
        "name": character_formatted.get("name"),
        "house": character_formatted.get("house"),
        "image": character_formatted.get("image"),
        "alternate_names": character_formatted.get("alternate_names", []),
        "spells": random.sample(spells, min(3, len(spells)))
    }), 200