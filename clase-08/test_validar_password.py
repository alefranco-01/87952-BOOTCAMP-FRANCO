import re


def validar_password(password):
    # No debe tener espacios
    if " " in password:
        return {
            "valid": False,
            "message": "Password must not contain spaces"
        }

    # Longitud mínima
    if len(password) < 10:
        return {
            "valid": False,
            "message": "Password must have at least 10 characters"
        }

    # Longitud máxima
    if len(password) > 20:
        return {
            "valid": False,
            "message": "Password must have at most 20 characters"
        }

    # Debe tener letras
    if not re.search(r"[a-zA-Z]", password):
        return {
            "valid": False,
            "message": "Password must contain letters"
        }

    # Debe tener números
    if not re.search(r"[0-9]", password):
        return {
            "valid": False,
            "message": "Password must contain numbers"
        }

    # Debe tener mayúsculas
    if not re.search(r"[A-Z]", password):
        return {
            "valid": False,
            "message": "Password must contain uppercase letters"
        }

    # Debe tener minúsculas
    if not re.search(r"[a-z]", password):
        return {
            "valid": False,
            "message": "Password must contain lowercase letters"
        }

    # Debe tener un símbolo especial
    if not re.search(r"[^a-zA-Z0-9\s]", password):
        return {
            "valid": False,
            "message": "Password must contain a special symbol"
        }

    return {
        "valid": True,
        "message": "Password is valid"
    }


# =========================
# TESTS
# =========================

def test_password_valido():
    resultado = validar_password("Abcdefghi1!")
    assert resultado["valid"] is True


def test_password_debe_tener_letras():
    resultado = validar_password("1234567890!")
    assert resultado["valid"] is False


def test_password_debe_tener_numeros():
    resultado = validar_password("Abcdefghijk!")
    assert resultado["valid"] is False


def test_password_minimo_10_caracteres():
    resultado = validar_password("Abcdefg1!")
    assert resultado["valid"] is False


def test_password_maximo_20_caracteres():
    resultado = validar_password("Abcdefghijk123456789!A")
    assert resultado["valid"] is False


def test_password_debe_tener_simbolo_especial():
    resultado = validar_password("Abcdefghi12")
    assert resultado["valid"] is False


def test_password_debe_tener_mayusculas():
    resultado = validar_password("abcdefghi1!")
    assert resultado["valid"] is False


def test_password_debe_tener_minusculas():
    resultado = validar_password("ABCDEFGHI1!")
    assert resultado["valid"] is False


def test_password_no_debe_tener_espacios():
    resultado = validar_password("Abc defghi1!")
    assert resultado["valid"] is False