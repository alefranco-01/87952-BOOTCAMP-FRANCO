from models.persona import Persona
from repositories.repositorio_persona import RepositorioPersonas


class ServicioPersonas:

    def __init__(self, repositorio: RepositorioPersonas):
        self.__repositorio = repositorio

    def obtener_todas(self):
        return self.__repositorio.obtener_todas()

    def obtener_por_dni(self, dni):
        return self.__repositorio.obtener_por_dni(dni)

    def crear(self, dni, nombre):

        persona_existente = self.__repositorio.obtener_por_dni(dni)

        if persona_existente is not None:
            raise ValueError("Ya existe una persona con ese DNI")

        persona = Persona(dni, nombre)

        self.__repositorio.guardar(persona)

        return persona

    def modificar(self, dni, nombre):

        persona_existente = self.__repositorio.obtener_por_dni(dni)

        if persona_existente is None:
            raise ValueError("No existe una persona con ese DNI")

        persona_nueva = Persona(dni, nombre)

        self.__repositorio.eliminar(dni)
        self.__repositorio.guardar(persona_nueva)

        return persona_nueva

    def eliminar(self, dni):

        eliminado = self.__repositorio.eliminar(dni)

        if not eliminado:
            raise ValueError("No existe una persona con ese DNI")