import { AuthService } from "./authService";

const BACKEND = "http://localhost:5000";

export class RatingService {
  static async getCharacterById(characterID: string) {
    const response = await fetch(`${BACKEND}/rating/character/${characterID}`, {
      headers: AuthService.authHeader(),
    });
    if (!response.ok) return null;

    return response.json();
  }

  static async rate(
    characterId: string,
    characterName: string,
    characterHouse: string | null,
    characterImage: string | null,
    rate: number,
  ) {
    const response = await fetch(`${BACKEND}/rating`, {
      method: "POST",
      headers: AuthService.jsonHeader(),
      body: JSON.stringify({
        character_id: characterId,
        character_name: characterName,
        character_house: characterHouse,
        character_image: characterImage,
        rate,
      }),
    });
    if (!response.ok) throw new Error("Error al valorar");
    return response.json();
  }

  static async updateRate(ratingId: number, rate: number) {
    const response = await fetch(`${BACKEND}/valoraciones/${ratingId}`, {
      method: "PUT",
      headers: AuthService.jsonHeader(),
      body: JSON.stringify({ rate }),
    });

    if (!response.ok) throw new Error("No se pudo actualizar la valoración");

    return response.json();
  }

  static async deleteRate(ratingId: number) {
    const response = await fetch(`${BACKEND}/valoraciones/${ratingId}`, {
      method: "DELETE",
      headers: AuthService.authHeader(),
    });

    if (!response.ok) throw new Error("No se pudo eliminar la valoración");

    return response.json();
  }
}
