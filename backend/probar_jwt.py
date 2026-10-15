from seguridad import crear_token_acceso, verificar_token_acceso

# Generar un token valido para el usuario de prueba
token_valido = crear_token_acceso(1)

# Verificar el token correcto
resultado_valido = verificar_token_acceso(token_valido)

# Verificar un token incorrecto
resultado_invalido = verificar_token_acceso("token_incorrecto")

# Verificar un token modificado
token_modificado = token_valido + "abc"
resultado_modificado = verificar_token_acceso(token_modificado)

print("Token valido - ID:", resultado_valido)
print("Token incorrecto:", resultado_invalido)
print("Token modificado:", resultado_modificado)