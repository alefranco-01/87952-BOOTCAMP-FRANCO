import tkinter as tk

# Crear la ventana principal
ventana : tk.Tk = tk.Tk()
ventana.title("Mi ventana")
ventana.geometry("640x480")          # Tamaño 640x480

# Label con texto
etiqueta = tk.Label(
    ventana,
    text="¡Hola! Esta es una ventana de 640x480",
    font=("Arial", 16)
)
etiqueta.pack(pady=50)               # Espacio arriba

boton = tk.Button(
    ventana,
    text="Salir",
    font=("Arial", 12),
    width=17,
    command=ventana.destroy                  # Al hacer clic llama a la función salir
)
boton.pack(pady=20)

# Iniciar el bucle de la aplicación
ventana.mainloop()
