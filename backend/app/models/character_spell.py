from app.db import db 

character_spells = db.Table('character_spells',
    db.Column('character_id', db.String(100), db.ForeignKey('character.id'), primary_key=True),
    db.Column('spell_id', db.String(100), db.ForeignKey('spell.id'), primary_key=True)
)