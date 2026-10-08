from models.alumno import Alumno
from repositories.alumno_repository import RepositorioAlumnos


class AlumnoService:
    def __init__(self):
        self.repo = RepositorioAlumnos()

    def agregar_alumno(self, alumno: Alumno) -> None:
        if self.repo.obtener_por_legajo(alumno.legajo) is not None:
            raise ValueError("Ya existe un alumno con ese legajo.")

        self.repo.guardar(alumno)

    def obtener_alumnos(self) -> list[Alumno]:
        return self.repo.obtener_todos()

    def obtener_alumno_por_legajo(self, legajo: int) -> Alumno | None:
        return self.repo.obtener_por_legajo(legajo)

    def eliminar_alumno(self, legajo: int) -> bool:
        return self.repo.eliminar(legajo)

    def modificar_nombre(self, legajo: int, nombre: str) -> Alumno | None:
        if self.repo.obtener_por_legajo(legajo) is None:
            return None

        return self.repo.modificar_nombre(legajo, nombre)