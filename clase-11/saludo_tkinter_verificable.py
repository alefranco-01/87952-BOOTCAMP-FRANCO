import tkinter as tk

def generar_saludo(nombre):
    return "¡Hola " + nombre + "!"

def saludar(campo_nombre, label_resultado):
    nombre = campo_nombre.get()
    label_resultado.config(text=generar_saludo(nombre)) 


def crear_interfaz(ventana):
    ventana.title("Saludo")
    ventana.geometry("640x480")

    # Texto de indicación
    label_nombre = tk.Label(ventana, text="Ingrese su nombre:")
    label_nombre.pack(pady=20)

    # Cuadro de texto
    entrada_nombre = tk.Entry(ventana)
    entrada_nombre.pack()

    # Label donde aparecerá el saludo
    label_saludo = tk.Label(ventana, text="")
    label_saludo.pack(pady=20)

    # Botón
    boton = tk.Button(ventana, text="Saludar", command=lambda: saludar(entrada_nombre, label_saludo))
    boton.pack()

    #Aca vemos que las funciones en python pueden retornar multiples valores, en este caso retornamos los elementos creados para poder manipularlos si es necesario fuera de la función.
    return entrada_nombre, label_saludo, boton

# Si es la funcion principal, ejecutar la interfaz
# Esto pasa cuando este archivo se ejecuta directamente desde la línea de comandos
# Si es importado por otro módulo, no ejecutar la interfaz automáticamente
if __name__ == "__main__":
    ventana = tk.Tk()
    crear_interfaz(ventana)
    ventana.mainloop()
