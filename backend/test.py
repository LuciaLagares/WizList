from app import create_app
from app.db import db
from app.models import User, Character, Spell, List

app = create_app()

with app.app_context():
    # 1. Limpiar y crear base de datos (¡Cuidado! Borra lo anterior)
    db.drop_all()
    db.create_all()

    # 2. Crear un Hechizo (Spell)
    expelliarmus = Spell(id="spell-1", name="Expelliarmus", description="Desarma al oponente")
    db.session.add(expelliarmus)

    # 3. Crear un Personaje y asignarle el hechizo (Superpersonaje)
    harry = Character(
        id="char-1", 
        name="Harry Potter", 
        house="Gryffindor", 
        image="http://example.com/harry.jpg"
    )
    # Aquí probamos la relación Muchos a Muchos
    harry.spells.append(expelliarmus) 
    db.session.add(harry)

    # 4. Crear un Usuario y una Lista
    lucia = User(username="Lucia", email="lucia@wizlist.com", password_hash="1234")
    db.session.add(lucia)
    db.session.commit() # Guardamos para obtener el ID de usuario

    mi_lista = List(title="Mis Favoritos", user_id=lucia.id, is_public=True)
    db.session.add(mi_lista)
    
    db.session.commit()

    print("--- VERIFICACIÓN ---")
    # Prueba de consulta del "Superpersonaje"
    personaje = Character.query.filter_by(name="Harry Potter").first()
    print(f"Personaje: {personaje.name}")
    print(f"Hechizos conocidos: {[s.name for s in personaje.spells]}")
    
    # Prueba de casa (para tus estadísticas) [cite: 28, 29]
    print(f"Casa del personaje: {personaje.house}")