from flask import Flask
from .db import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    
    db.init_app(app)
    
    with app.app_context():
        from . import models # Esto carga tus 5 entidades: usuarios, personajes, hechizos, listas y puntuaciones [cite: 39]
        db.create_all()
        
    return app