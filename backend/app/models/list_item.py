from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.db import db 


class ListItem(db.Model):
    __tablename__ = 'list_item'
    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    character_id = db.Column(db.String(100), db.ForeignKey('character.id'), nullable=True)
    spell_id = db.Column(db.String(100), db.ForeignKey('spell.id'), nullable=True)