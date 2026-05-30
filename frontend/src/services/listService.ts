import { AuthService } from "./authService";

const BACKEND = "http://localhost:5000";

export class ListService {
  static async getMyLists() {
    const response = await fetch(`${BACKEND}/my-lists`, {
      headers: AuthService.authHeader(),
    });

    if (response.status === 401) throw new Error("No estas registrado");
    if (!response.ok) throw new Error("Error al cargar tus listas");

    return response.json();
  }

  static async getListById(listId: number) {
    const response = await fetch(`${BACKEND}/list/${listId}`, {
      headers: AuthService.jsonHeader(),
    });

    if (!response.ok) throw new Error("Error al cargar la lista");
    return response.json();
  }

  static async getAllPublicLists(page: number, perPage = 3) {
    const response = await fetch(
      `${BACKEND}/public-lists?page=${page}&per_page=${perPage}`,
    );
    if (!response.ok) throw new Error("Error al cargar las listas");

    return response.json();
  }

  static async createList(title: string, description = "", isPublic = true) {
    const response = await fetch(`${BACKEND}/list`, {
      method: "POST",
      headers: AuthService.jsonHeader(),
      body: JSON.stringify({ title, description, isPublic: isPublic }),
    });

    if (!response.ok) throw new Error("Error creando la lista");

    return response.json();
  }

  static async deleteList(listId: number) {
    const response = await fetch(`${BACKEND}/listas/${listId}`, {
      method: "DELETE",
      headers: AuthService.authHeader(),
    });

    if (!response.ok) throw new Error("No se pudo eliminar la lista");

    return response.json();
  }

  static async addCharacter(
    listId: number,
    characterId: string,
    characterName: string,
    characterHouse: string | null,
    characterImage: string | null,
    spells: any[],
  ) {
    const response = await fetch(`${BACKEND}/list/${listId}/add-character`, {
      method: "POST",
      headers: AuthService.jsonHeader(),
      body: JSON.stringify({
        character_id: characterId,
        character_name: characterName,
        character_house: characterHouse,
        character_image: characterImage,
        spells,
      }),
    });
    if (!response.ok && response.status !== 409)
      throw new Error("Error al añadir personaje");
    return response.json();
  }

  static async selectFavorites(listId: number) {
    const response = await fetch(`${BACKEND}/list/${listId}/favorite`, {
      method: "PATCH",
      headers: AuthService.authHeader(),
    });
    if (!response.ok) throw new Error("Error al actualizar la lista favorita");
    return response.json();
  }
}
