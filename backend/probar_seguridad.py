from seguridad import generar_hash, verificar_contrasena
contrasena = "PruebaSegura123!"
hash_generado = generar_hash(contrasena)
print("Hash generado:", hash_generado)
print(
    "Contraseña correcta:",
    verificar_contrasena(contrasena, hash_generado)
)
print(
    "Contraseña incorrecta:",
    verificar_contrasena("ClaveIncorrecta", hash_generado)
)