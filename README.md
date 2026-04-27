# 🛰 Gracias Jeremy CLI — v2.1.0

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

## 🖥️ ¿Por qué un CLI y no solo botones en el IDE?

Es una observación común: *"Mi IDE ya tiene botones para subir a GitHub"*. Sin embargo, **Gracias Jeremy CLI** nace para cubrir necesidades que un botón no siempre resuelve:

*   **Flujo Ininterrumpido:** Ideal para desarrolladores que viven en la terminal (Vim, Nano, terminales de Linux) y quieren evitar el "context switch" de pasar al ratón.
*   **Guía paso a paso:** No es solo un botón de "Push"; es un asistente que verifica tu identidad Git, valida que tus mensajes de commit sean correctos y te ayuda a crear repositorios en GitHub sin salir de la consola.
*   **Seguridad y Validación:** Incluye reglas estrictas para evitar que subas correos mal formados o mensajes vacíos, algo que los botones genéricos a veces ignoran.
*   **Personalidad:** A diferencia de una interfaz gris de IDE, aquí tienes consejos de desarrollo, un diseño visual premium y un resumen detallado de tus acciones.

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

## 🔒 Seguridad

- **Sin inyección de shell** — todos los comandos usan `execFileSync` con argumentos en array, nunca strings interpolados
- **Validación de inputs** — email, nombre, URL de repositorio y nombre de repo tienen reglas estrictas
- **Límite de reintentos** — máximo 5 intentos por campo antes de abortar limpiamente
- **Sin dependencias inseguras** — solo `readline-sync` (auditado, 0 vulnerabilidades)

---

## 🔧 Requisitos

- Node.js 16+
- Git instalado
- *(Opcional)* [GitHub CLI](https://cli.github.com/) para crear repos sin salir de la terminal

---

## 📄 Licencia

ISC — Hecho con 💜 por **Jeremy Sánchez**

---

```
        💜  Jeremy Sánchez  💜

  ░░░░░░░░░░░░░░░░░░░░░░░█████████
  ░░███████░░░░░░░░░░███▒▒▒▒▒▒▒▒███
  ░░█▒▒▒▒▒▒█░░░░░░███▒▒▒▒▒▒▒▒▒▒▒▒▒███
  ░░░█▒▒▒▒▒▒█░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
  ░░░░█▒▒▒▒▒█░░░██▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒███
  ░░░░░█▒▒▒█░░░█▒▒▒▒▒▒████▒▒▒▒████▒▒▒▒▒▒██
  ░░░█████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
  ░░░█▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒██
  ░██▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██
  ██▒▒▒███████████▒▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒▒▒▒██
  █▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒████████▒▒▒▒▒▒▒██
  ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
  ░█▒▒▒███████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
  ░██▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█
  ░░████████████░░░█████████████████

        github.com/JeremySG31
```