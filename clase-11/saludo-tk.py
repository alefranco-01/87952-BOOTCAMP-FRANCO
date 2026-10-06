
import tkinter as tk


def saludar() -> None:
    """Obtiene el nombre ingresado y muestra un saludo."""
    nombre = entrada_nombre.get().strip()

    if nombre:
        etiqueta_saludo.config(text=f"¡Hola, {nombre}!")
    else:
        etiqueta_saludo.config(text="Por favor, ingresá tu nombre.")


# Ventana principal
ventana = tk.Tk()
ventana.title("Saludo")
ventana.geometry("640x480")
ventana.resizable(False, False)

# Texto de indicación
etiqueta_nombre = tk.Label(
    ventana,
    text="Ingresá tu nombre:"
)
etiqueta_nombre.pack(pady=(40, 10))

# Cuadro de texto
entrada_nombre = tk.Entry(
    ventana,
    width=30
)
entrada_nombre.pack()

# Botón
boton_saludar = tk.Button(
    ventana,
    text="Saludar",
    command=saludar
)
boton_saludar.pack(pady=10)

# Label donde aparecerá el saludo
etiqueta_saludo = tk.Label(
    ventana,
    text=""
)
etiqueta_saludo.pack(pady=10)

# Iniciar la aplicación
ventana.mainloop()

