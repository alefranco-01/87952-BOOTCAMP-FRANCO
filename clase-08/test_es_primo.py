from es_primo import es_primo


def test_numero_no_primo_devuelve_false():
    assert es_primo(4) == False


def test_numeros_primos_devuelven_true():
    assert es_primo(2) == True
    assert es_primo(7) == True


def test_string_devuelve_false():
    assert es_primo("hola") == False