#Existen dos tipos de funciones
# Funciones puras (pure functions)
# Una función pura no tiene efectos secundarios y siempre produce el mismo resultado para los mismos argumentos.
# Devuelve siempre lo mismo con los mismo parametros
# No depende de otra cosa que no sean los parametros que reciben
# Estas son las funciones que nos encantan porque son predecibles y fáciles de razonar
# Se pueden probar fácilmente con diferentes entradas para verificar su comportamiento
def suma(a, b):
    return a + b

# Funciones que tienen efectos secundarios (side effects)
# Una función con efectos secundarios puede modificar el estado fuera de su alcance o interactuar con el mundo exterior.
def imprimir_mensaje(mensaje):
    print(mensaje)          

global_variable = 0
def incrementar_global():
    global global_variable
    global_variable += 1
    return global_variable


#

def num_mayor(lista):
  mayor = lista[0]
 
  for num in lista:
    if num > mayor:
       mayor = num
 
  return mayor