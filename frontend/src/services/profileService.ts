import { AuthService } from "./authService";

const BACKEND = "http://localhost:5000";

export class ProfileService {
  static async getOwnProfile() {
    const response = await fetch(`${BACKEND}/perfil`, {
      headers: AuthService.jsonHeader(),
    });

    if (response.status === 401 || response.status === 422) {
      AuthService.logOut();
      throw new Error("No estás registrado");
    }

    if (!response.ok) throw new Error("Error al cargar el perfil");

    return response.json();
  }

  static async getOthersProfile(userId: number) {
    const response = await fetch(`${BACKEND}/${userId}/perfil`);

    if (!response.ok) throw new Error("Error al cargar este perfil");

    return response.json();
  }
}
