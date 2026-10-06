from flask import Flask, request, jsonify

from repositories.repositorio_persona import RepositorioPersonas
from services.servicio_personas import ServicioPersonas

app = Flask(__name__)

repositorio = RepositorioPersonas()
servicio = ServicioPersonas(repositorio)


def persona_a_dict(persona):

    return {
        "dni": persona.dni,
        "nombre": persona.nombre
    }


@app.get("/personas")
def obtener_personas():

    personas = servicio.obtener_todas()

    return jsonify([
        persona_a_dict(persona)
        for persona in personas
    ])


@app.get("/personas/<int:dni>")
def obtener_persona(dni):

    persona = servicio.obtener_por_dni(dni)

    if persona is None:
        return jsonify({
            "error": "Persona no encontrada"
        }), 404

    return jsonify(persona_a_dict(persona))


@app.post("/personas")
def crear_persona():

    datos = request.get_json()

    try:

        persona = servicio.crear(
            datos["dni"],
            datos["nombre"]
        )

        return jsonify(persona_a_dict(persona)), 201

    except KeyError:
        return jsonify({
            "error": "Faltan datos"
        }), 400

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


@app.put("/personas/<int:dni>")
def modificar_persona(dni):

    datos = request.get_json()

    try:

        persona = servicio.modificar(
            dni,
            datos["nombre"]
        )

        return jsonify(persona_a_dict(persona))

    except KeyError:
        return jsonify({
            "error": "Falta el nombre"
        }), 400

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400


@app.delete("/personas/<int:dni>")
def eliminar_persona(dni):

    try:

        servicio.eliminar(dni)

        return jsonify({
            "mensaje": "Persona eliminada correctamente"
        })

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 404


if __name__ == "__main__":
    app.run(debug=True)