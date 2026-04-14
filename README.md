# 🛰 Gracias Jeremy CLI — v2.0.0

> **Automatizador de Git & GitHub para gente que ya tiene suficiente con escribir código.**  
> by [Jeremy Sánchez](https://github.com/JeremySG31)

---

## ¿Qué hace?

Un CLI interactivo que te guía paso a paso para:

| Paso | Acción |
|------|--------|
| 1 | Verificar (o configurar) tu identidad de Git |
| 2 | Hacer `git init` + `git add .` + crear un commit |
| 3 | Detectar si ya tienes un remoto enlazado |
| 4 | Crear un repositorio nuevo en GitHub **o** enlazar uno existente |

Todo con colores, mensajes claros y un resumen al final de lo que se hizo.

---

## 📦 Instalación global

```bash
npm install -g gracias-jeremy
```

Luego úsalo desde cualquier proyecto:

```bash
gracias-jeremy
```

---

## 🧑‍💻 Uso local (sin instalar)

```bash
node index.js
```

---

## ✨ Lo que lo hace diferente

- **Banner único** con logo ASCII "GJ" propio
- **Paleta de colores 256** para terminales modernas (no el verde/rojo de siempre)
- **Tips originales** del autor que aparecen en cada arranque
- **Pasos numerados** con indicadores visuales claros
- **Resumen final** que muestra exactamente qué se hizo y a qué hora
- **Detección multiplataforma** — funciona en Windows, Linux y Mac
- **Auto-instalación de `gh`** (GitHub CLI) en Linux si no está presente

---

## 🔧 Requisitos

- Node.js 16+
- Git instalado
- *(Opcional)* [GitHub CLI](https://cli.github.com/) para crear repos sin salir de la terminal

---

## 📄 Licencia

ISC — Hecho con 💜 por **Jeremy Sánchez**
