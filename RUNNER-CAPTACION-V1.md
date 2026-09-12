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

Se mantienen los nombres de campos usados por `captacion-prueba.html`. No se modificó el Apps Script ni su despliegue. La lectura GET del endpoint devolvió `{"ok":true,"system":"RUNNER Captación v1"}`; tanto la redirección como la respuesta final GET incluyen `Access-Control-Allow-Origin: *`. Esto comprueba la disponibilidad y la lectura GET, pero no valida el contrato ni CORS de POST.

## Fallos y duplicados

El botón se bloquea durante la petición y tras una solicitud exitosa. Ante una respuesta rechazada, ilegible, un fallo de red o un tiempo de espera de 30 segundos, WhatsApp no se abre y se muestra el código para verificar con Runner. No hay reintentos automáticos ni copias de prospectos en localStorage/sessionStorage. Una escritura incierta queda bloqueada en esa página para no crear otra fila por doble clic o reenvío. La protección no persiste al recargar; la deduplicación entre sesiones requiere que el servidor compruebe el ID, y su implementación no se ha inspeccionado.

La política y el consentimiento explican que el CRM registra la solicitud antes de WhatsApp y aunque el visitante no envíe el mensaje. El registro de prospectos no confirma ni reserva citas.

## Respaldo y alcance

`backups/index-before-runner-captacion-v1.html.txt` es una copia exacta del `index.html` de main al iniciar el trabajo (blob `cd5b8af4a45409de989105ab86c7e9ebe541ec78`). La extensión `.txt` evita una segunda landing renderizable. Restaurarla permite revertir el formulario anterior.

No se cambiaron URL pública, canonical, robots, sitemap, verificación de Search Console, título, metadatos principales, imágenes, música, estilos existentes ni código de la demo. Se actualizó únicamente la pregunta de FAQ estructurada correspondiente a la captación, junto con su respuesta visible. La rama y `captacion-prueba.html` se conservan. `runner-captacion.css`, añadido previamente en la rama, permanece intacto y no se enlaza para no alterar el diseño existente.

## Validación y condición de fusión

- `node --test tests/captacion.test.cjs`: siete pruebas exitosas con CRM simulado. Cubren preservación, datos enviados, código compartido, orden de acciones, consentimiento, teléfonos, ventanas bloqueadas, errores y doble clic.
- El HTML se verifica para IDs únicos, destinos existentes de los CTA y los seis controles obligatorios.
- La lectura del CRM real confirmó el registro de prueba anterior. Este trabajo no creó nuevas filas.
- La vista previa local fue bloqueada por la política del navegador; no se completó QA visual de la edición.
- La revisión automática bloqueó la prueba POST con el teléfono de Runner por falta de autorización específica para el dato de prueba. No se fusionó a main.

Antes de fusionar, autorizar y efectuar una única solicitud identificada como prueba en el CRM real, leer la respuesta POST desde un origen web, verificar la fila con el mismo ID que WhatsApp, y comprobar el formulario en celular y escritorio. No enviar el mensaje por WhatsApp. Si todo es correcto, fusionar conservando la rama y comprobar la publicación de GitHub Pages en la URL existente.
