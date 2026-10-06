from funciones import num_mayor

def test_num_mayor_con_numeros_positivos():
    assert num_mayor([1, 5, 3, 2]) == 5

def test_num_mayor_con_numeros_negativos():
    assert num_mayor([-8, -2, -10, -4]) == -2

def test_num_mayor_con_numeros_positivos_y_negativos():
    assert num_mayor([-3, 7, 0, -1, 4]) == 7

def test_num_mayor_con_numeros_repetidos():
    assert num_mayor([6, 6, 2, 6]) == 6

def test_num_mayor_con_un_solo_numero():
    assert num_mayor([9]) == 9

def test_num_mayor_lista_vacia():
    assert num_mayor([]) == None