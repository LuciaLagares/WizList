const BACKEND = "http://localhost:5000";

export class CharactersService {
  static async getAllCharacters(page = 1, perPage = 6, search = "") {
    const response = await fetch(
      `${BACKEND}/show-characters?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`,
    );

    if (!response.ok) throw new Error("Error al cargar los personajes");

    return response.json();
  }

  static async getCharacterById(characterId: string) {
    const response = await fetch(`${BACKEND}/character/${characterId}/spells`);
    if (!response.ok) throw new Error("Personaje no encontrado");
    return response.json();
  }
}
