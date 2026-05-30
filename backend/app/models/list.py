from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.db import db 


class List(db.Model):
    __tablename__ = 'list'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    is_public = db.Column(db.Boolean, default=True)
    is_favorite = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    items = db.relationship('ListItem', backref='parent_list', cascade="all, delete-orphan")

    def to_dict(self):
            return {
                "id": self.id,
                "title": self.title,
                "description": self.description,
                "is_public": self.is_public,
                "is_favorite": self.is_favorite,
                "user_id": self.user_id
            }