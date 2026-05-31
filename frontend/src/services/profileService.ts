import { AuthService } from "./authService";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export class ProfileService {
  static async getOwnProfile() {
    const response = await fetch(`${BACKEND}/profile`, {
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
    const response = await fetch(`${BACKEND}/${userId}/profile`);

    if (!response.ok) throw new Error("Error al cargar este perfil");

    return response.json();
  }
}
