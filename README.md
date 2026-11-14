# Time Travelers ⏳

Aplicación web educativa (mobile-first, en inglés) para aprender sobre las civilizaciones antiguas: **Egipto, Grecia y Roma**.

🔗 **App publicada:** https://efrainblancoduarte.github.io/time-travelers/

## ¿Qué hace?

1. El estudiante **se registra** (nombre, grado y contraseña) e **inicia sesión**.
2. En el **Travel Map** ve 3 misiones. Cada una se desbloquea al terminar la anterior.
3. Cada misión tiene un **contexto** (tarjetas cortas y, en Egipto, una infografía con zoom) y luego un **reto de 2 preguntas**.
4. Al terminar recibe **estrellas** (2 correctas = 4 ⭐, 1 correcta = 2 ⭐, 0 = 🙈) y una **retroalimentación** que explica por qué su respuesta estaba mal y cuál es la correcta.
5. En **My Journal** puede volver a ver sus misiones resueltas, su calificación y la retroalimentación.
6. En **Profile** ve su progreso, sus insignias y puede **cerrar sesión**.

## Tecnología

- **Angular 19** (componentes standalone y signals), sin backend.
- Los usuarios y puntajes se guardan en el navegador (**localStorage**). Se conservan al cerrar el navegador; se pierden si se borran los datos del sitio o en modo incógnito.
- Publicada en **GitHub Pages** (rama `gh-pages`). Para publicar cambios: `npm run deploy`.

## Estructura

```
src/app/
  data/missions.ts        ← todo el contenido educativo (lecciones, preguntas, explicaciones)
  services/               ← usuarios/sesión (auth) y progreso
  guards.ts               ← protege rutas (sesión iniciada, misión desbloqueada)
  layout/shell.component  ← menú inferior (Map, Journal, Profile)
  pages/                  ← login, signup, map, lesson, challenge, result, journal, profile
  shared/                 ← íconos, estrellas, lista de retroalimentación
```

## Ejecutar en local

```bash
npm install
npm start          # http://localhost:4200
npm run deploy     # compila y publica en GitHub Pages
```
