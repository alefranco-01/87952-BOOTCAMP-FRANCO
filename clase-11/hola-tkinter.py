import tkinter as tk

ventana = tk.Tk()
ventana.title("Hola Mundo")

etiqueta = tk.Label(ventana, text="¡Hola Mundo!")
etiqueta.pack()

ventana.mainloop()