# Runner Automatizaciones — Landing Page

Sitio comercial de Runner para negocios de belleza, estética, bienestar y otros servicios por cita en Lima. Ofrece dos soluciones relacionadas: captación digital (landing, QR, WhatsApp) y un CRM semiautomático (Google Sheets + WhatsApp sin API).

## Estructura de la página (`index.html`)

1. Portada — propuesta principal y dos llamadas a la acción.
2. Problemas que Runner resuelve.
3. Landing para captar clientes (con ejemplos por especialidad).
4. CRM semiautomático — límites explícitos: sin API, sin chatbot, sin envío automático.
5. Demostración interactiva del CRM — datos ficticios, en memoria, se reinicia al recargar.
6. Sectores atendidos.
7. Caso real: Serenity Springs.
8. Planes: Landing Esencial (S/390), Landing Profesional (S/790), Landing + CRM Runner (S/1,490).
9. Cómo funciona (3 etapas).
10. Preguntas frecuentes + confianza y privacidad.
11. Contacto final con diagnóstico guiado que prepara una solicitud en WhatsApp.

## Reglas de contenido que debe respetar cualquier edición futura

- El CRM se presenta **siempre** como semiautomático (Google Sheets), nunca como IA, chatbot o automatización total.
- WhatsApp funciona con enlaces `wa.me` (app normal o WhatsApp Business). **Nunca** anunciar WhatsApp Business API, envíos automáticos ni campañas masivas.
- Los mensajes de WhatsApp se preparan; el envío siempre lo confirma la persona encargada.
- Precios solo en soles, marcados como referenciales.
- La demostración del CRM (sección 5) usa exclusivamente datos ficticios y no debe conectarse a información real de clientes.

## Archivos principales

- `index.html` — página completa con estilos, secciones y la demo interactiva del CRM.
- `assets/runner-hero-profesional.webp` y versión `-4k` — portada profesional optimizada.
- `assets/runner-peluqueria.webp`, `runner-maquillaje.webp` y `runner-spa-bienestar.webp` — fotografías propias para las especialidades, cada una con versión 4K.
- `assets/runner-gestion-profesional.webp` y versión `-4k` — fotografía de gestión para el bloque del CRM.
- `assets/runner-og.jpg` — imagen social 1200 × 630 para Open Graph y redes.
- `Runner_Hero_QR_Animado_Web.webp` — recurso animado conservado como material alternativo.
- `assets/runner-gestion-automatizada.webp` — recurso anterior conservado como respaldo.
- `assets/runner-ambiente.mp3` — música ambiental (no autoplay con sonido; el visitante decide).
- `runner-hero-qrmaps.jpg` — imagen alternativa del encabezado.
- `runner-qr.png` — QR flotante (oculto en móvil; solo se muestra el botón de WhatsApp).
- `robots.txt` y `sitemap.xml` — indexación en buscadores.

## Publicación

GitHub Pages publica la rama `main` desde la raíz:

https://wily-2024.github.io/runner-landing/

## Nota para consultorios

La propuesta de Runner cubre agenda y seguimiento administrativo. No sustituye la historia clínica ni un sistema médico especializado.

## Música

La música ya **no** intenta reproducirse automáticamente. El botón flotante permite activarla o pausarla; si estuvo activa, la página recuerda durante la sesión que puede reanudarse, pero exige una nueva acción del visitante después de recargar.

## Demostración segura

- La agenda demostrativa funciona solo en la memoria del navegador y se reinicia al recargar.
- El bloqueo considera profesional, fecha, hora y duración.
- Cancelar libera el horario; una cita cancelada no puede reactivarse si otra cita ya ocupó ese espacio.
- El botón de WhatsApp abre únicamente el número comercial de Runner con un ejemplo de mensaje; nunca intenta contactar números ficticios.

## Diagnóstico por WhatsApp

El formulario final no almacena ni transmite datos por sí solo. Construye un mensaje con el nombre del negocio, rubro y necesidad, y abre `wa.me` para que la persona lo revise y presione **Enviar** manualmente.
