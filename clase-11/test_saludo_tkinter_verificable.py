from saludo_tkinter_verificable import crear_interfaz, generar_saludo, saludar
import tkinter as tk

# Prueba Unitaria del metodo generar_saludo
def test_generar_saludo():
    assert generar_saludo("Juan") == "¡Hola Juan!"
    assert generar_saludo("") == "¡Hola !"
    assert generar_saludo("Ana") == "¡Hola Ana!"

# Prueba de integracion del saludar sin crear_interfaz, creando una ventana de prueba
'''
def tst_saludar():
    # Crea una ventana de prueba que nunca se muestra
    ventana = tk.Tk()

    entrada_nombre = tk.Entry(ventana)
    label_saludo = tk.Label(ventana, text="")

    entrada_nombre.insert(0, "Juan")
    saludar(entrada_nombre, label_saludo)
    assert label_saludo.cget("text") == "¡Hola Juan!"
    ventana.destroy()
'''
# Verificar la creación de la interfaz y que el saludo anda bien simulando lo que hace el usuario
def test_crear_interfaz():
    ventana = tk.Tk()
    entrada_nombre, label_saludo, boton = crear_interfaz(ventana)

    # Simular la acción del usuario
    entrada_nombre.insert(0, "Juan")
    boton.invoke()  # Simula el clic en el botón
    assert label_saludo.cget("text") == "¡Hola Juan!"

    ventana.destroy()

