from models.persona import Persona


class RepositorioPersonas:

    def __init__(self):
        self.__personas = []

    def obtener_todas(self):
        return self.__personas

    def obtener_por_dni(self, dni):

        for persona in self.__personas:
            if persona.dni == dni:
                return persona

        return None

    def guardar(self, persona: Persona):

        self.__personas.append(persona)

    def eliminar(self, dni):

        persona = self.obtener_por_dni(dni)

        if persona is not None:
            self.__personas.remove(persona)
            return True

        return False