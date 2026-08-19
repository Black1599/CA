# PyCharm, Git y trabajo sin conexión - comandos rápidos

## Abrir la web

1. Abre la carpeta completa con **File > Open**.
2. Abre `public/index.html`.
3. Pulsa **Alt+F2** y elige Chrome o Edge.
4. Guarda con **Ctrl+S**.

PyCharm usa su servidor integrado, normalmente en el puerto `63342`. No hace
falta instalar Python, Node ni un servidor adicional para esta web estática.

## Git sin conexión

```bash
git status
git switch -c texto-portada
git add .
git commit -m "Actualiza el texto de portada"
```

Los commits y las ramas funcionan sin Internet. `push`, `pull` y `fetch`
necesitan conexión. Cuando vuelva Internet:

```bash
git push -u origin texto-portada
```

## Volver atrás antes de confirmar

```bash
git diff
git restore public/index.html
```

## Ver el historial

```bash
git log --oneline --decorate --graph --all
```
