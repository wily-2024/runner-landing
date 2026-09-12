const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const { test } = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const baseline = fs.readFileSync(path.join(root, 'backups/index-before-runner-captacion-v1.html.txt'), 'utf8');
const source = '// Captación real.' + html.split('// Captación real.')[1].split('// ------------------------------------------------------------------')[0];

function harness(reply = { ok: true }, popupBlocked = false) {
  const controls = new Map();
  const events = [];
  const writes = [];
  const node = (id, value = '') => {
    const control = { value, disabled: false, hidden: true, checked: true, dataset: {},
      textContent: '', className: '', listeners: {}, attributes: {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
      setAttribute(key, val) { this.attributes[key] = val; },
      focus() {}, reportValidity() { return true; }, querySelectorAll() { return fields; } };
    controls.set(id, control);
    return control;
  };
  const fields = [node('diagnosticName', 'Negocio de prueba'), node('diagnosticPhone', '900000000'),
    node('diagnosticSector', 'Comercio / tienda'), node('diagnosticService', 'CRM Google Sheets'),
    node('diagnosticGoal', 'Prueba local sin datos de un cliente real'), node('diagnosticConsent')];
  ['diagnosticSubmit', 'diagnosticStatus', 'diagnosticWhatsApp', 'diagnosticForm'].forEach(id => node(id));
  const cta = node('cta');
  cta.dataset = { captureCta: 'Precio: Landing + CRM', captureService: 'Landing + QR + WhatsApp + CRM' };
  const popup = { closed: false, location: { replace(url) { events.push(['whatsapp', url]); } },
    close() { this.closed = true; events.push(['close']); } };
  let timer;
  vm.runInNewContext(source, {
    document: { getElementById(id) { return controls.get(id); }, querySelectorAll() { return [cta]; } },
    window: { open(url) { events.push(['open', url]); return popupBlocked ? null : popup; } },
    location: { search: '?utm_source=qr&utm_campaign=lanzamiento&private=omit', origin: 'https://wily-2024.github.io', pathname: '/runner-landing/' },
    fetch: async (url, options) => {
      writes.push({ url, options, payload: JSON.parse(options.body) });
      events.push(['post']);
      if (reply instanceof Error) throw reply;
      const result = typeof reply === 'function' ? await reply(options) : reply;
      events.push(['confirmed']);
      return { ok: true, json: async () => result };
    },
    crypto: webcrypto, Intl, Date, Uint32Array, URLSearchParams, AbortController,
    setTimeout(fn) { timer = fn; return 1; }, clearTimeout() {}, Object
  });
  return { controls, fields, cta, events, writes, popup,
    submit() { return controls.get('diagnosticForm').listeners.submit({ preventDefault() {} }); } };
}

test('protect SEO principal, imágenes, estilos existentes y demo', () => {
  const head = s => s.split('<script type="application/ld+json">')[0];
  assert.equal(head(html), head(baseline));
  const professionalService = s => s.split('<script type="application/ld+json">')[1].split('</script>')[0];
  assert.equal(professionalService(html), professionalService(baseline));
  const images = s => [...s.matchAll(/<(?:img|source)\b[^>]*>/g)].map(m => m[0]);
  assert.deepEqual(images(html), images(baseline));
  const css = s => s.match(/<style>([\s\S]*?)<\/style>/)[1];
  const originalCSS = css(html).split('\n').filter(line =>
    !/^  (?:\.diagnostic-status|\.diagnostic-form \.btn:disabled|#diagnosticWhatsApp\[hidden\])/.test(line)
  ).join('\n');
  assert.equal(originalCSS, css(baseline));
  const demo = s => s.split('// SECCIÓN 5: DEMOSTRACIÓN INTERACTIVA DEL CRM')[1];
  assert.equal(demo(html), demo(baseline));
  const demoHTML = s => s.match(/<form id="demoForm">[\s\S]*?<\/form>/)[0];
  assert.equal(demoHTML(html), demoHTML(baseline));
  assert.equal(html.match(/data-capture-cta=/g).length, 10);
  assert.doesNotMatch(html, /<a\b[^>]*href="https:\/\/wa\.me/);
  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (m[1].includes('application/ld+json')) JSON.parse(m[2]);
    else new vm.Script(m[2]);
  }
});

test('POST único, ID igual, confirmación antes de WhatsApp y envío manual', async () => {
  const h = harness();
  h.cta.listeners.click();
  await h.submit();
  assert.equal(h.writes.length, 1);
  const { options, payload } = h.writes[0];
  assert.equal(options.mode, 'cors');
  assert.equal(options.headers['Content-Type'], 'text/plain;charset=utf-8');
  assert.match(payload.id, /^RUN-\d{8}-\d{6}-[A-Z0-9]+$/);
  assert.equal(payload.telefono, '51900000000');
  assert.equal(payload.servicio, 'Landing + QR + WhatsApp + CRM');
  assert.equal(payload.cta, 'Precio: Landing + CRM');
  assert.equal(payload.origen, 'qr');
  assert.equal(payload.campana, 'lanzamiento');
  assert.equal(payload.consentimiento, true);
  assert.equal(payload.urlOrigen, 'https://wily-2024.github.io/runner-landing/');
  const message = new URL(h.controls.get('diagnosticWhatsApp').href).searchParams.get('text');
  assert.ok(message.includes('Código: ' + payload.id));
  assert.ok(message.includes('presionar Enviar manualmente'));
  assert.ok(h.events.findIndex(e => e[0] === 'confirmed') < h.events.findIndex(e => e[0] === 'whatsapp'));
  assert.equal(h.popup.opener, null);
  await h.submit();
  assert.equal(h.writes.length, 1);
});

test('usa el código del servidor cuando está presente; funciona sin popup', async () => {
  const h = harness({ ok: true, id: 'RUN-SERVER-0001' }, true);
  await h.submit();
  assert.equal(h.controls.get('diagnosticWhatsApp').hidden, false);
  assert.ok(decodeURIComponent(h.controls.get('diagnosticWhatsApp').href).includes('RUN-SERVER-0001'));
  assert.equal(h.events.filter(e => e[0] === 'whatsapp').length, 0);
});

test('sin consentimiento, con blancos o teléfono inválido no escribe ni abre pestañas', async () => {
  for (const mutate of [h => h.controls.get('diagnosticConsent').checked = false,
    h => h.controls.get('diagnosticName').value = ' ',
    h => h.controls.get('diagnosticGoal').value = ' ',
    h => h.controls.get('diagnosticPhone').value = '987abc654321',
    h => h.controls.get('diagnosticPhone').value = '123456789']) {
    const h = harness(); mutate(h); await h.submit();
    assert.equal(h.writes.length, 0);
    assert.equal(h.events.length, 0);
  }
});

test('acepta formato local e internacional peruano', async () => {
  for (const phone of ['900000000', '+51 900 000 000', '(51) 900-000-000']) {
    const h = harness(); h.controls.get('diagnosticPhone').value = phone;
    await h.submit(); assert.equal(h.writes[0].payload.telefono, '51900000000');
  }
});

test('red/CORS, respuesta rechazada o ID inválido no abren WhatsApp ni reintentan', async () => {
  for (const reply of [new Error('CORS'), { ok: false }, null, { ok: true, id: 'invalid' }]) {
    const h = harness(reply); await h.submit(); await h.submit();
    assert.equal(h.writes.length, 1);
    assert.equal(h.events.filter(e => e[0] === 'whatsapp').length, 0);
    assert.equal(h.popup.closed, true);
    assert.equal(h.controls.get('diagnosticWhatsApp').hidden, true);
    assert.ok(h.controls.get('diagnosticStatus').textContent.includes('No reenvíes'));
    assert.equal(h.controls.get('diagnosticSubmit').disabled, true);
  }
});

test('doble clic durante la escritura crea una sola solicitud', async () => {
  let release;
  const h = harness(() => new Promise(resolve => { release = resolve; }));
  const first = h.submit(); await h.submit();
  assert.equal(h.writes.length, 1);
  release({ ok: true }); await first;
});
