from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.db import db 


class Spell(db.Model):
    __tablename__ = 'spell'
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)