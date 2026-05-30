from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.db import db 


class Rating(db.Model):
    __tablename__ = 'rating'
    id = db.Column(db.Integer, primary_key=True)
    rate = db.Column(db.Integer) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    character_id = db.Column(db.String(100), db.ForeignKey('character.id'), nullable=True)
    spell_id = db.Column(db.String(100), db.ForeignKey('spell.id'), nullable=True)
    character = db.relationship("Character", backref="ratings", lazy=True)


    def to_dict(self):
            return {
                "id": self.id,
                "rate": self.rate,
                "character_id": self.character_id,
                "spell_id": self.spell_id,
                "character": self.character.to_dict() if self.character else None,
            }