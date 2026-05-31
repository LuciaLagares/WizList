const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export class AuthService {
  private static TOKEN = "token";

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN);
  }

  static isAuthenthicated(): boolean {
    return this.getToken() !== null;
  }

  static async logOut(): Promise<void> {
    try {
      await fetch(`${BACKEND}/logout`, {
        method: "POST",
        headers: this.authHeader(),
      });
    } finally {
      localStorage.removeItem(this.TOKEN);
    }
  }

  static async login(username: string, password: string): Promise<string> {
    const response = await fetch(`${BACKEND}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 401)
      throw new Error("Usuario o contraseña incorrectos");
    if (!response.ok) throw new Error("Error iniciando sesión");

    const data = await response.json();
    localStorage.setItem(this.TOKEN, data.access_token);
    return data.access_token;
  }

  static async register(username: string, password: string): Promise<string> {
    const response = await fetch(`${BACKEND}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 409)
      throw new Error("El nombre de usuario ya existe");
    if (!response.ok) throw new Error("Error al intentar registrar");

    const data = await response.json();
    localStorage.setItem(this.TOKEN, data.access_token);
    return data.access_token;
  }

  static authHeader(): Record<string, string> {
    return { Authorization: `Bearer ${this.getToken()}` };
  }

  static jsonHeader(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getToken()}`,
    };
  }
}
