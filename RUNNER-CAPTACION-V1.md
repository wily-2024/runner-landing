# RUNNER Captación v1 — integración del formulario principal

La rama `runner-captacion-v1` conserva el diseño del formulario de diagnóstico y lo convierte en captación real. Los diez enlaces comerciales llevan a `#diagnosticForm`; los de landing y CRM seleccionan el servicio correspondiente. El botón de WhatsApp de las citas ficticias sigue siendo parte de la demo y no escribe en el CRM.

El formulario exige nombre/negocio, WhatsApp peruano, rubro, servicio, necesidad y consentimiento. Envía una sola petición JSON como `text/plain` al Apps Script ya desplegado. Solo una respuesta HTTP satisfactoria con JSON `ok: true` permite preparar y abrir WhatsApp. Una pestaña vacía se reserva durante el clic para evitar el bloqueo de ventanas; navega a WhatsApp después de la confirmación. Un enlace visible permite abrir el mismo mensaje si la ventana fue bloqueada. El visitante debe pulsar Enviar manualmente.

El cliente propone un código `RUN-fecha-hora-aleatorio`, con fecha y hora de Lima, siguiendo el formato del registro de prueba existente. Envía ese código en `id`. Si Apps Script devuelve `id`, el mensaje utiliza el código devuelto; si no lo devuelve, utiliza el enviado. El código y la respuesta de `doPost` deben comprobarse contra la fila creada antes de fusionar.

## Contrato de la petición

| Campo | Contenido |
| --- | --- |
| `id` | Código RUN de solicitud |
| `nombre` | Nombre o negocio |
| `telefono` | Celular peruano con 51, sin signos ni espacios |
| `rubro` | Rubro seleccionado |
| `servicio` | Servicio de interés |
| `objetivo` | Necesidad de la solicitud |
| `consentimiento` | `true`, solo tras aceptación explícita |
| `origen` | utm_source/source o Runner Landing |
| `campana` | utm_campaign/campaign o vacío |
| `cta` | Botón comercial que llevó al formulario |
| `urlOrigen` | Origen y ruta; no se transmite la cadena completa de parámetros |
| `version` | RUNNER Captación v1 |

Se mantienen los nombres de campos usados por `captacion-prueba.html`. No se modificó el Apps Script ni su despliegue. GET devuelve `{"ok":true,"system":"RUNNER Captación v1"}`. Tras autorización específica del titular, se realizó una única petición POST de prueba con Origin de GitHub Pages: respondió HTTP 200 en 21,38 segundos, con JSON `ok: true` e `id` idéntico al enviado. Tanto la redirección como la respuesta final POST incluyen `Access-Control-Allow-Origin: *`. La lectura del CRM confirmó una sola fila nueva y los campos esperados. Se comprobó el mensaje generado por el código del formulario utilizando esa respuesta real, sin repetir la petición ni enviar el mensaje. La petición real se efectuó mediante cliente HTTP; no se afirma que sea una prueba de envío desde la interfaz del navegador.

## Fallos y duplicados

El botón se bloquea durante la petición y tras una solicitud exitosa. Ante una respuesta rechazada, ilegible, un fallo de red o un tiempo de espera de 30 segundos, WhatsApp no se abre y se muestra el código para verificar con Runner. No hay reintentos automáticos ni copias de prospectos en localStorage/sessionStorage. Una escritura incierta queda bloqueada en esa página para no crear otra fila por doble clic o reenvío. La protección no persiste al recargar; la deduplicación entre sesiones requiere que el servidor compruebe el ID, y su implementación no se ha inspeccionado.

La política y el consentimiento explican que el CRM registra la solicitud antes de WhatsApp y aunque el visitante no envíe el mensaje. El registro de prospectos no confirma ni reserva citas.

## Respaldo y alcance

`backups/index-before-runner-captacion-v1.html.txt` es una copia exacta del `index.html` de main al iniciar el trabajo (blob `cd5b8af4a45409de989105ab86c7e9ebe541ec78`). La extensión `.txt` evita una segunda landing renderizable. Restaurarla permite revertir el formulario anterior.

No se cambiaron URL pública, canonical, robots, sitemap, verificación de Search Console, título, metadatos principales, imágenes, música, estilos existentes ni código de la demo. Se actualizó únicamente la pregunta de FAQ estructurada correspondiente a la captación, junto con su respuesta visible. La rama y `captacion-prueba.html` se conservan. `runner-captacion.css`, añadido previamente en la rama, permanece intacto y no se enlaza para no alterar el diseño existente.

## Validación

- `node --test tests/captacion.test.cjs`: siete pruebas exitosas con CRM simulado. Cubren preservación, datos enviados, código compartido, orden de acciones, consentimiento, teléfonos, ventanas bloqueadas, errores y doble clic.
- El HTML se verifica para IDs únicos, destinos existentes de los CTA y los seis controles obligatorios.
- La lectura del CRM real confirmó exactamente una nueva fila identificada como PRUEBA TÉCNICA — NO CONTACTAR. El titular autorizó específicamente el uso de su número. El registro permanece como evidencia; no se enviaron mensajes ni se eliminó información.
- El mensaje generado utiliza el ID confirmado en esa fila y recuerda que Enviar se pulsa manualmente.
- Los dos botones del formulario permiten saltos de línea para que su nuevo texto quepa en pantallas pequeñas. Los estilos y media queries originales permanecen intactos.
- La política del navegador bloqueó la vista previa local. La revisión visual de la página publicada se realiza después del despliegue; no se afirma una prueba visual del formulario en una vista previa ni una emulación móvil.

La prueba real, la validación del mensaje y las pruebas automáticas permiten fusionar la integración conservando la rama. Después se comprueba la publicación de GitHub Pages y el formulario en la URL existente, sin crear un segundo prospecto. Los fallos de red quedan cubiertos por pruebas simuladas; no se modifica ni se vuelve a desplegar Apps Script.
