from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.db import db 

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='normal') 
    
    
    lists = db.relationship('List', backref='owner', lazy=True)
    ratings = db.relationship('Rating', backref='user', lazy=True)

    def to_dict(self):
            return {
                "id": self.id,
                "username": self.username,
                "role": self.role,
            }