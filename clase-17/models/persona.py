from dataclasses import dataclass


@dataclass(frozen=True, init=False)
class Persona:

    __dni: int
    __nombre: str

    def __init__(self, dni: int, nombre: str):

        self.__validar_dni(dni)
        self.__validar_nombre(nombre)

        object.__setattr__(self, "_Persona__dni", dni)
        object.__setattr__(self, "_Persona__nombre", nombre)

    @property
    def dni(self):
        return self.__dni

    @property
    def nombre(self):
        return self.__nombre

    def __validar_dni(self, dni):

        if not isinstance(dni, int):
            raise ValueError("El DNI debe ser un número entero")

        if dni <= 0:
            raise ValueError("El DNI debe ser mayor a 0")

    def __validar_nombre(self, nombre):

        if not isinstance(nombre, str):
            raise ValueError("El nombre debe ser un texto")

        if len(nombre) == 0:
            raise ValueError("El nombre no puede estar vacío")

        if len(nombre) > 30:
            raise ValueError("El nombre no puede tener más de 30 caracteres")

        if not nombre[0].isupper():
            raise ValueError("El nombre debe comenzar con mayúscula")

        if nombre[1:] and not nombre[1:].islower():
            raise ValueError("Las demás letras deben estar en minúscula")