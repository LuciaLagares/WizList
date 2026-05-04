from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.db import db 
from .character_spell import character_spells

class Character(db.Model):
    __tablename__ = 'character'

    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    house = db.Column(db.String(50))
    image = db.Column(db.String(260))

    spells = db.relationship('Spell', secondary=character_spells, backref='wizards')