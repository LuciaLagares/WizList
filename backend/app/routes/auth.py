from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app.db import db
from app.models.user import User
from app.validations import validates

auth_bp = Blueprint("auth", __name__)
 
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    err, status = validates({
        "username": {"required": True, "type": str, "min_length": 3, "max_length": 80},
        "password": {"required": True, "type": str, "min_length": 3, "max_length": 256},
    }, data)

    if err:
        return err, status
    
    username = data['username'].strip()
    password = data['password']
 
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "El nombre ya es de un usuario"}), 409
 
    new_user = User(
        username=username,
        password=generate_password_hash(password),
        role="normal"
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({"message": "Registro exitoso", "access_token": access_token}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al registrar", "error": str(e)}), 500
 
 
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    err, status = validates({
        "username": {"required": True, "type": str},
        "password": {"required": True, "type": str},
    }, data)
    if err:
        return err, status
    
    username = data['username'].strip()
    password = data['password']
 
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401
 
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Login exitoso", "access_token": access_token}), 200
 
 
@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Sesión cerrada correctamente"}), 200