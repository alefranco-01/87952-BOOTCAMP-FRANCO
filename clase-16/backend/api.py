from datetime import date

from flask import Flask, jsonify, request

from models.alumno import Alumno
from services.alumno_service import AlumnoService


app = Flask(__name__)


@app.after_request
def agregar_cabeceras_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Accept"
    return response


@app.get("/alumnos")
def obtener_alumnos():
    servicio = AlumnoService()
    alumnos = servicio.obtener_alumnos()

    return jsonify([
        {
            "legajo": alumno.legajo,
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "fechaDeNacimiento": alumno.fecha_de_nacimiento.isoformat()
        }
        for alumno in alumnos
    ])


@app.get("/alumnos/<int:legajo>")
def obtener_alumno(legajo):
    servicio = AlumnoService()
    alumno = servicio.obtener_alumno_por_legajo(legajo)

    if alumno is None:
        return jsonify({
            "error": "Alumno no encontrado"
        }), 404

    return jsonify({
        "legajo": alumno.legajo,
        "nombre": alumno.nombre,
        "apellido": alumno.apellido,
        "fechaDeNacimiento": alumno.fecha_de_nacimiento.isoformat()
    })


@app.post("/alumnos")
def agregar_alumno():
    datos = request.get_json()

    alumno = Alumno(
        datos["legajo"],
        datos["nombre"],
        datos["apellido"],
        date.fromisoformat(datos["fechaDeNacimiento"])
    )

    servicio = AlumnoService()

    try:
        servicio.agregar_alumno(alumno)
    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 409

    return jsonify({
        "legajo": alumno.legajo,
        "nombre": alumno.nombre,
        "apellido": alumno.apellido,
        "fechaDeNacimiento": alumno.fecha_de_nacimiento.isoformat()
    }), 201


@app.delete("/alumnos/<int:legajo>")
def eliminar_alumno(legajo):
    servicio = AlumnoService()

    eliminado = servicio.eliminar_alumno(legajo)

    if not eliminado:
        return jsonify({
            "error": "Alumno no encontrado"
        }), 404

    return jsonify({
        "mensaje": "Alumno eliminado correctamente"
    }), 200


@app.put("/alumnos/<int:legajo>")
def modificar_alumno(legajo):
    datos = request.get_json()

    if not datos or "nombre" not in datos:
        return jsonify({
            "error": "Debe enviar el nombre"
        }), 400

    servicio = AlumnoService()

    try:
        alumno = servicio.modificar_nombre(
            legajo,
            datos["nombre"]
        )
    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    if alumno is None:
        return jsonify({
            "error": "Alumno no encontrado"
        }), 404

    return jsonify({
        "legajo": alumno.legajo,
        "nombre": alumno.nombre,
        "apellido": alumno.apellido,
        "fechaDeNacimiento": alumno.fecha_de_nacimiento.isoformat()
    }), 200


if __name__ == "__main__":
    app.run(debug=True)