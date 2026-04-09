import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app)
 
@app.route("/api/characters")
def get_characters():
    response = requests.get('https://hp-api.onrender.com/api/characters')
    return jsonify(response.json())

@app.route("/api/spells")
def get_spells():
    response = requests.get('https://hp-api.onrender.com/api/spells')
    return jsonify(response.json())

@app.route("/detail/<string:id>/")
def get_details(id):
    response = requests.get('https://hp-api.onrender.com/api/character/'+id)
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)