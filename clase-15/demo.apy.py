from flask import Flask, jsonify
from dataclasses import asdict, dataclass
app = Flask(__name__)
@app.route("/")
def hola_mundo():
    return "Hola Mundo"
@app.route("/persona")
def persona():
    return {
        "nombre": "Esteban",
        "apellido": "Calabria",
        "edad": 44
    }
@dataclass
class Alumno:
    nombre : str
    apellido : str
    edad : int

@app.route("/alumno")
def alumno():
    alumno = Alumno("Juan", "Perez", 25)
    return jsonify(asdict(alumno))
    #return {
    #    "nombre": alumno.nombre,
    #    "apellido": alumno.apellido,
    #    "edad": alumno.edad
    #}

if __name__ == "__main__":
    app.run(debug=True)