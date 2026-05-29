
import requests


BASE_URL = "https://hp-api.onrender.com/api"

def fetch_characters():
    try:
        response = requests.get(f"{BASE_URL}/characters", timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        raise RuntimeError("La API de Harry Potter no respondió a tiempo")
    except requests.exceptions.HTTPError as e:
        raise RuntimeError(f"Error de la API externa: {e.response.status_code}")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Error de conexión con la API externa: {str(e)}")
 
def fetch_spells():
    try:
        response = requests.get(f"{BASE_URL}/spells", timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        raise RuntimeError("La API de Harry Potter no respondió a tiempo")
    except requests.exceptions.HTTPError as e:
        raise RuntimeError(f"Error de la API externa: {e.response.status_code}")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Error de conexión con la API externa: {str(e)}")