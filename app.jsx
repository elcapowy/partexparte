// ─────────────────────────────────────────────────────────────
// SANHUA YA — App principal
// Flujo: Tipo de equipo → Marca → Serie/Modelo → Componentes (carrito) → Cotización → Listo
// Catálogo real en window.CATALOGO (catalogo.js)
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Motor de recomendaciones inteligentes para el carrito
// ─────────────────────────────────────────────────────────────
// ── Helpers de códigos ──────────────────────────────────────────────────────
// Divide "SH-F(L)3H12U-52 (V.4 vías) / SH-DTG-E05020 (filtro)" en chips
function parseCodigos(raw) {
  if (!raw) return [];
  return raw.split(' / ').map(part => {
    const m = part.trim().match(/^(.*)\s+\(([^)]+)\)$/);
    return m ? { codigo: m[1].trim(), label: m[2].trim() } : { codigo: part.trim(), label: null };
  });
}

function CodigosSh({ raw }) {
  const partes = parseCodigos(raw);
  return partes.map((p, i) => (
    <span key={i} className="code code-sh">
      <span className="code-k">{p.label || 'Sanhua'}</span>{p.codigo}
    </span>
  ));
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Inferir categoría desde etiqueta del código ────────────────────────────
function inferCategoria(label, fallback) {
  const l = (label || '').toLowerCase();
  if (/filtro|filter|strainer|deshidratador|dtg|stgb/.test(l)) return 'filter';
  if (/solenoid/.test(l)) return 'solenoid';
  if (/4 v[ií]as|v\.4|4-way|inversora/.test(l)) return 'reversing';
  if (/vee|válvula exp|electronic exp|eev|dpf|lpf/.test(l)) return 'valve';
  if (/llave|serv\.|service|stop valve|ball/.test(l)) return 'service';
  if (/bobina|coil|pq-m/.test(l)) return 'coil';
  if (/sensor|ntc|termistor/.test(l)) return 'sensor';
  return fallback;
}

// ── Separar ítems combinados (filtro + solenoide, etc.) en cards individuales ──
function splitItem(it) {
  const partes = parseCodigos(it.codigoSanhua);
  const shouldSplit = partes.length >= 2 && partes.every(p => p.label);
  if (!shouldSplit) return [it];
  return partes.map(p => ({
    ...it,
    componente: p.label,
    codigoSanhua: p.codigo,
    categoria: inferCategoria(p.label, it.categoria),
    _parentComponente: it.componente,
    _isSplit: true,
  }));
}

function getRecomendaciones(carrito) {
  // No aplica para heladeras ni aplicaciones no-HVAC
  const esNoHVAC = carrito.every(c => /heladera|freezer|frig|lavarrop|lavavajill/i.test(c.marca));
  if (esNoHVAC) return [];

  // El Kit SEK ya incluye NTC — no sugerirlo
  const tieneSEK = carrito.some(c => /sek/i.test(c.item.codigoSanhua || '') || /kit\s*sek/i.test(c.item.componente || ''));
  const cats = new Set(carrito.map(c => c.item.categoria));
  const comps = carrito.map(c => [c.item.componente, c.item.codigoSanhua, c.item.nota || ''].join(' ')).join(' ').toLowerCase();
  const inCart = (re) => re.test(comps);
  const recs = [];

  // Válvula 4 vías → bobina obligatoria
  if (cats.has('reversing') && !cats.has('coil') && !inCart(/bobina|coil/)) {
    recs.push({
      key: 'coil-reversing', urgencia: 'alta',
      nombre: 'Bobina para válvula inversora',
      codigo: 'SHF-4-10S · AC 220V · 4.5/3.5 W',
      categoria: 'coil',
      icono: '🔌',
      razon: 'La bobina es el actuador eléctrico que mueve la válvula. Si la válvula falló por falta de señal o por corriente alta, la bobina suele estar quemada. Cambiarlas juntas evita volver al equipo.',
    });
  }

  // Filtro deshidratador → SIEMPRE con cualquier reemplazo
  const yaHayFiltro = cats.has('filter') || inCart(/filtro|deshidratador|dtg|stgb|bgq|kgq/);
  const abreCircuito = ['reversing', 'valve', 'solenoid'].some(c => cats.has(c));
  if (!yaHayFiltro && carrito.length > 0) {
    recs.push({
      key: 'filter-circuit', urgencia: abreCircuito ? 'alta' : 'media',
      nombre: 'Filtro deshidratador',
      codigo: 'DTG-E / STGB bidireccional · R32 / R410A / R22',
      categoria: 'filter',
      icono: '⚠️',
      razon: abreCircuito
        ? 'Regla de oro: cada vez que se abre el circuito de gas, el filtro deshidratador se reemplaza. La humedad que entra destruye el compresor en pocas horas de operación. Es la pieza más barata de la reparación.'
        : 'Con cualquier intervención en la unidad, es buena práctica renovar el filtro deshidratador. Si tiene más de 2 años de uso puede estar cerca de su límite de absorción.',
    });
  }

  // BDFM damper → ZWF26 forzador (trabajan juntos)
  if (inCart(/bdfm|damper|compuerta/) && !inCart(/zwf26|forzador|brushless/)) {
    recs.push({
      key: 'fan-with-damper', urgencia: 'media',
      nombre: 'Forzador DC Brushless',
      codigo: 'ZWF26',
      categoria: 'sensor',
      icono: '💡',
      razon: 'Damper y forzador trabajan en el mismo circuito de distribución de aire. Con el equipo ya abierto, es el momento de revisarlo — si el motor está ruidoso o lento, cuesta el mismo viaje cambiarlo ahora.',
    });
  }

  // ZWF26 forzador → BDFM damper (la compuerta pudo forzarse)
  if (inCart(/zwf26|forzador|brushless/) && !inCart(/bdfm|damper|compuerta/)) {
    recs.push({
      key: 'damper-with-fan', urgencia: 'media',
      nombre: 'Damper motorizado (compuerta de aire)',
      codigo: 'BDFM (Single)',
      categoria: 'solenoid',
      icono: '💡',
      razon: 'Si el forzador falló por sobrecarga, puede que la compuerta esté trabada o el motor forzado. Revisarla en la misma visita evita que el forzador nuevo vuelva a sobrecargarse.',
    });
  }

  // Válvula de expansión → sensor NTC (no si ya hay SEK kit que lo incluye)
  if (cats.has('valve') && !cats.has('sensor') && !inCart(/sensor|termistor|ntc/) && !tieneSEK) {
    recs.push({
      key: 'sensor-with-valve', urgencia: 'media',
      nombre: 'Sensor NTC de tubería',
      codigo: 'Serie NTC · sonda metálica abrazadera',
      categoria: 'sensor',
      icono: '🌡️',
      razon: 'Con la válvula de expansión nueva, vale la pena verificar el termistor de tubería. Si está fuera de rango, la placa no va a regular bien el recalentamiento y la válvula no va a rendir.',
    });
  }

  // VEE/DPF → sugerir bobina correcta según tamaño
  const dpfCodes = carrito.map(c => c.item.codigoSanhua || '').join(' ').toLowerCase();
  const hasDPF = /dpf/.test(dpfCodes);
  if (hasDPF && !inCart(/dpf-5800[12]|pq-m10|pq-m03/)) {
    const hasBig   = /dpf\(s03\)/.test(dpfCodes);
    const hasSmall = /dpf\((t01|ts1)\)/.test(dpfCodes) || (hasDPF && !hasBig);
    if (hasBig) recs.push({
      key: 'coil-dpf-s03', urgencia: 'alta',
      nombre: 'Bobina PQ-M03 — VEE DPF(S03)',
      codigo: 'DPF-58002',
      categoria: 'coil', icono: '🔌',
      razon: 'La válvula DPF(S03) de 4.0–6.5C requiere la bobina PQ-M03 (DPF-58002). 5 hilos: naranja A, rojo B, amarillo Ā, negro B̄, gris COM.',
    });
    if (hasSmall) recs.push({
      key: 'coil-dpf-ts1', urgencia: 'alta',
      nombre: 'Bobina PQ-M10 — VEE DPF(T01/TS1)',
      codigo: 'DPF-58001',
      categoria: 'coil', icono: '🔌',
      razon: 'La válvula DPF(T01/TS1) de 1.3–3.2C requiere la bobina PQ-M10 (DPF-58001). 5 hilos: naranja A, rojo B, amarillo Ā, negro B̄, gris COM.',
    });
  }

  // Kit SEK → ofrecer sonda NTC adicional y filtro como accesorios
  if (tieneSEK) {
    const sekItem = carrito.find(c => /sek/i.test(c.item.codigoSanhua || '') || /kit\s*sek/i.test(c.item.componente || ''));
    const accesorios = (sekItem?.item?.kitAccesorios) || [];
    accesorios.forEach((a, i) => {
      if (!inCart(new RegExp(a.codigoSanhua.split('/')[0].trim(), 'i')))
        recs.push({
          key: 'sek-acc-' + i, urgencia: i === 1 ? 'alta' : 'media',
          nombre: a.componente, codigo: a.codigoSanhua, categoria: a.categoria, icono: i === 0 ? '🌡️' : '⚠️',
          razon: i === 0
            ? 'Sonda NTC de repuesto para el Kit SEK. La sonda viene incluida en el kit original; tener una extra evita paradas si se daña o necesita reubicarse.'
            : 'Al instalar el Kit SEK se abre el circuito de gas — regla de oro: cambiar el filtro deshidratador para proteger el compresor.',
        });
    });
  }

  return recs.slice(0, 4);
}

function RecomendacionesSection({ carrito, onAgregar }) {
  const recs = getRecomendaciones(carrito);
  if (recs.length === 0) return null;
  return (
    <div className="rec-block">
      <div className="rec-header">
        <span className="rec-title">También te recomendamos</span>
        <span className="rec-sub">Piezas relacionadas con tu pedido — para no volver al equipo dos veces</span>
      </div>
      <div className="rec-list">
        {recs.map((r) => (
          <div key={r.key} className={"rec-card rec-card--" + r.urgencia}>
            <div className="rec-card-top">
              <span className="rec-ico">{r.icono}</span>
              <div className="rec-card-body">
                <span className="rec-nombre">{r.nombre}</span>
                <span className="codes"><CodigosSh raw={r.codigo} /></span>
              </div>
              <button className="rec-add-btn" onClick={() => onAgregar(r)}>
                <IconPlus size={14} /> Agregar
              </button>
            </div>
            <p className="rec-razon">{r.razon}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { getRecomendaciones, RecomendacionesSection });

const { useState, useMemo, useEffect } = React;

function App() {
  const [step, setStep] = useState(0); // 0 home · 1 tipo · 2 marca · 3 serie · 4 comp · 5 datos · 6 ok
  const [tipo, setTipo] = useState("todos");
  const [marca, setMarca] = useState(null);
  const [serie, setSerie] = useState(null);
  const [filtroCat, setFiltroCat] = useState("Todos");
  const [appSel, setAppSel] = useState(null); // aplicación elegida (flujo por aplicación)
  const [appFrom, setAppFrom] = useState(0); // a dónde vuelve el back del detalle de aplicación
  const [cablesFrom, setCablesFrom] = useState(4); // a dónde vuelve el back de la guía de cables
  const [carrito, setCarrito] = useState([]); // [{ marca, serie, modelos, item, cantidad }]
  const [pedido, setPedido] = useState({ nombre: "", tel: "", confirmTel: "", direccion: "", ciudad: "", nota: "" });
  const [touched, setTouch] = useState({ nombre: false, tel: false, confirmTel: false, ciudad: false });
  const touch = (f) => setTouch(p => ({ ...p, [f]: true }));

  const mt = (s, it) => matchTipo(tipo, s, it);
  const tipoNombre = (TIPOS.find((t) => t.id === tipo) || {}).nombre;

  const marcas = useMemo(() => CATALOGO
    .map((b) => ({ b, n: b.series.reduce((a, s) => a + s.items.filter((it) => mt(s, it)).length, 0) }))
    .filter((x) => x.n > 0), [tipo]);

  const series = useMemo(() => !marca ? [] : marca.series
    .map((s) => ({ s, n: s.items.filter((it) => mt(s, it)).length }))
    .filter((x) => x.n > 0), [marca, tipo]);

  const cats = useMemo(() => {
    if (!serie) return ["Todos"];
    return ["Todos", ...new Set(serie.items.filter((it) => mt(serie, it)).map((i) => CAT_LABEL[i.categoria] || "Otros"))];
  }, [serie, tipo]);

  const items = useMemo(() => !serie ? [] : serie.items
    .filter((it) => mt(serie, it) && (filtroCat === "Todos" || CAT_LABEL[it.categoria] === filtroCat)), [serie, filtroCat, tipo]);

  // ── Carrito ──
  const totalUnidades = carrito.reduce((a, c) => a + c.cantidad, 0);
  // Identidad de ítem por VALOR (no por referencia): splitItem regenera objetos
  // en cada render, por lo que comparar por === hacía que el botón volviera a "Agregar".
  const itemKey = (it) => (it.componente || '') + '|' + (it.codigoSanhua || '');
  const sameItem = (a, b) => itemKey(a) === itemKey(b);
  const inCart = (it) => carrito.some((c) => sameItem(c.item, it));
  const toggleCartCtx = (it, ctx) => {
    setCarrito((prev) => prev.some((c) => sameItem(c.item, it))
      ? prev.filter((c) => !sameItem(c.item, it))
      : [...prev, { marca: ctx.marca, serie: ctx.serie || "", modelos: ctx.modelos || "", item: it, cantidad: 1 }]);
  };
  const toggleCart = (it) => toggleCartCtx(it, { marca: marca.marca, serie: serie.serie, modelos: serie.modelos || "" });
  const setQty = (it, d) => setCarrito((prev) => prev.map((c) =>
    sameItem(c.item, it) ? { ...c, cantidad: Math.max(1, c.cantidad + d) } : c));
  const removeCart = (it) => setCarrito((prev) => prev.filter((c) => !sameItem(c.item, it)));

  // ── Helpers tecnología de expansión (exclusión mutua SEK / TXV / NTC) ──
  const isKitSEK  = (it) => /SEK\d|Kit SEK|LPF.*kit|kit.*LPF/i.test([it.componente, it.codigoSanhua||''].join(' '));
  const isTXV     = (it) => /RFGD|RFKH|termostat.*expan|expan.*termostat/i.test([it.componente, it.codigoSanhua||''].join(' '));
  const isNTCSola = (it) => /sonda.*NTC|NTC.*sonda|Sonda NTC/i.test(it.componente) && !isKitSEK(it) && !isTXV(it);

  const smartToggleCartCtx = (it, ctx) => {
    if (inCart(it)) { removeCart(it); return; }
    setCarrito(prev => {
      let next = prev;
      if (isKitSEK(it))  next = prev.filter(c => !isTXV(c.item) && !isNTCSola(c.item));
      else if (isTXV(it)) next = prev.filter(c => !isKitSEK(c.item));
      else if (isNTCSola(it) && prev.some(c => isKitSEK(c.item))) return prev;
      return [...next, { marca: ctx.marca, serie: ctx.serie||'', modelos: ctx.modelos||'', item: it, cantidad: 1 }];
    });
  };

  // Validación teléfono argentino (10 dígitos locales)
  const normalizarTel = (t) => {
    let d = t.replace(/\D/g, '');
    if (d.startsWith('549')) d = d.slice(3);
    else if (d.startsWith('54')) d = d.slice(2);
    else if (d.startsWith('0')) d = d.slice(1);
    return d;
  };
  const validarTel = (t) => normalizarTel(t).length === 10;
  const validarNombre = (n) => n.trim().length >= 3 && !/^\d+$/.test(n.trim());
  const validarCiudad = (c) => c.trim().length >= 2;

  const errNombre    = touched.nombre    && !validarNombre(pedido.nombre)    ? 'Ingresá tu nombre completo (mín. 3 letras)' : null;
  const errTel       = touched.tel       && pedido.tel       && !validarTel(pedido.tel)       ? 'Número inválido — debe tener 10 dígitos (ej: 11 5555-5555)' : null;
  const errConfirm   = touched.confirmTel && pedido.confirmTel && pedido.confirmTel !== pedido.tel ? 'Los números no coinciden' : null;
  const errCiudad    = touched.ciudad    && !validarCiudad(pedido.ciudad)    ? 'Indicá tu ciudad o localidad' : null;

  const okNombre  = validarNombre(pedido.nombre);
  const okTel     = validarTel(pedido.tel);
  const okConfirm = pedido.confirmTel === pedido.tel && okTel;
  const okCiudad  = validarCiudad(pedido.ciudad);

  const formValido = okNombre && okTel && okConfirm && okCiudad && carrito.length > 0;

  const reset = () => {
    setStep(0); setTipo("todos"); setMarca(null); setSerie(null); setFiltroCat("Todos"); setAppSel(null);
    setCarrito([]); setPedido({ nombre: "", tel: "", confirmTel: "", direccion: "", ciudad: "", nota: "" }); setTouch({ nombre: false, tel: false, confirmTel: false, ciudad: false });
  };

  // Abrir una aplicación: las que dependen de marca van al flujo de marcas (part-to-part);
  // el resto abre su detalle de repuestos.
  const cotizarKit = (kit) => {
    const nuevos = kit.componentes.map(c => ({
      marca: kit.nombre,
      serie: kit.escenario,
      modelos: "",
      item: {
        componente: c.componente,
        categoria: c.categoria,
        codigoSanhua: c.codigoSanhua,
        confirmado: false,
        nota: kit.tip || "",
      },
      cantidad: 1,
    }));
    setCarrito(prev => {
      const combined = [...prev];
      nuevos.forEach(n => {
        if (!combined.some(c => c.item.componente === n.item.componente))
          combined.push(n);
      });
      return combined;
    });
    setStep(5);
  };

  const openApp = (a, from = 0) => {
    if (a.marcaFlow) { setTipo(a.tipo || "todos"); setMarca(null); setSerie(null); setStep(2); return; }
    setAppSel(a); setAppFrom(from); setStep(11);
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const wppMsg = () => {
    const L = ["Hola SANHUA YA, quiero cotizar estos repuestos:", ""];
    carrito.forEach((c, i) => {
      L.push(`${i + 1}) ${c.item.componente}${c.cantidad > 1 ? `  ×${c.cantidad}` : ""}`);
      parseCodigos(c.item.codigoSanhua).forEach(p => {
        L.push(`   • Sanhua${p.label ? ' (' + p.label + ')' : ''}: ${p.codigo}`);
      });
      if (c.item.codigoOEM) L.push(`   • ${c.marca}: ${c.item.codigoOEM}`);

      const eq = [c.marca, c.serie].filter(Boolean).join(" · ");
      if (eq) L.push(`   • ${c.serie ? "Equipo" : "Aplicación"}: ${eq}`);
    });
    L.push("");
    if (pedido.nombre) L.push(`Cliente: ${pedido.nombre}`);
    if (pedido.tel) L.push(`Tel: ${pedido.tel}`);
    if (pedido.ciudad || pedido.direccion) L.push(`Entrega: ${[pedido.direccion, pedido.ciudad].filter(Boolean).join(", ")}`);
    if (pedido.nota) L.push(`Nota: ${pedido.nota}`);
    return L.join("\n");
  };

  // El carrito flotante se muestra mientras se navega el catálogo
  // ── Registro de solicitudes ──────────────────────────────────────────────
  const guardarSolicitud = () => {
    const registro = {
      id: Date.now(),
      fecha: new Date().toLocaleString('es-AR'),
      cliente: { ...pedido },
      carrito: carrito.map(c => ({
        componente: c.item.componente,
        codigoSanhua: c.item.codigoSanhua,
        codigoOEM: c.item.codigoOEM || '',
        marca: c.marca,
        serie: c.serie,
        cantidad: c.cantidad,
      })),
    };
    try {
      const prev = JSON.parse(localStorage.getItem('sanhua_ya_solicitudes') || '[]');
      prev.unshift(registro);
      localStorage.setItem('sanhua_ya_solicitudes', JSON.stringify(prev.slice(0, 200)));
    } catch(e) {}
    return registro;
  };

  const FORMSPREE = 'https://formspree.io/f/mlgkwvby';

  const enviarSolicitud = () => {
    const reg = guardarSolicitud();

    // Enviar a Formspree (email)
    const repuestosTexto = carrito.map((c, i) =>
      `${i+1}) ${c.item.componente} ×${c.cantidad}\n   Sanhua: ${c.item.codigoSanhua}${c.item.codigoOEM ? `\n   ${c.marca}: ${c.item.codigoOEM}` : ''}\n   Equipo: ${[c.marca, c.serie].filter(Boolean).join(' · ')}`
    ).join('\n\n');

    fetch(FORMSPREE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `🔧 Nueva solicitud SANHUA YA — ${pedido.nombre} (${pedido.ciudad})`,
        Nombre:      pedido.nombre,
        WhatsApp:    pedido.tel,
        Ciudad:      pedido.ciudad,
        Dirección:   pedido.direccion || '—',
        Nota:        pedido.nota || '—',
        Repuestos:   repuestosTexto,
        Fecha:       reg.fecha,
      }),
    }).catch(() => {}); // silencioso si falla

    // Abrir WhatsApp con todos los datos
    const url = 'https://wa.me/5491134696124?text=' + encodeURIComponent(wppMsg());
    window.open(url, '_blank', 'noopener');
    setStep(6);
  };

  const showCart = carrito.length > 0 && ((step >= 1 && step <= 4) || step === 10 || step === 11);

  return (
    <div className="app">
      <Header onLogo={reset} cartCount={totalUnidades} onCart={() => carrito.length && setStep(5)} />

      {step > 0 && step < 6 && (
        <div className="stepper-wrap"><div className="container"><Stepper step={step} /></div></div>
      )}

      <main className={"container main" + (showCart ? " with-cart" : "")}>
        {step === 0 && <Home go={() => setStep(1)} goApp={() => setStep(10)} openApp={(a) => openApp(a, 0)} goKits={() => setStep(20)} goAI={() => setStep(30)} />}

        {/* STEP 1 — TIPO DE EQUIPO */}
        {step === 1 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(0)} />
            <h2 className="screen-title">¿Qué tipo de equipo es?</h2>
            <p className="screen-sub">Filtrá por aplicación para ver solo los componentes Sanhua que correspondan.</p>
            <div className="grid grid-equipos">
              {TIPOS.map((t) => {
                const TIcon = ICONS[t.icon] || IconWrench;
                return (
                  <button key={t.id} className={"tipo-card" + (tipo === t.id ? " sel" : "")}
                    onClick={() => { setTipo(t.id); setMarca(null); setSerie(null); setStep(2); }}>
                    <span className="tipo-ico"><TIcon size={26} /></span>
                    <span className="tipo-body">
                      <span className="tipo-name">{t.nombre}</span>
                      <span className="tipo-desc">{t.desc}</span>
                    </span>
                    <span className="tipo-arrow"><IconArrowRight size={18} /></span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 2 — MARCA */}
        {step === 2 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(1)} />
            <h2 className="screen-title">¿De qué marca es tu equipo?</h2>
            <p className="screen-sub">
              {tipo === "todos" ? "Marcas más instaladas en Argentina" : <React.Fragment>Tipo: <b>{tipoNombre}</b></React.Fragment>}
              {" "}— el componente Sanhua original de cada una.
            </p>
            <div className="grid grid-marcas-big">
              {marcas.map(({ b, n }) => (
                <button key={b.marca} className={"mk-card" + (marca?.marca === b.marca ? " sel" : "")}
                  onClick={() => { setMarca(b); setSerie(null); setStep(3); }}>
                  <span className="mk-avatar" style={{ "--hue": (BRAND_HUE[b.marca] || 210) }}>{b.marca.slice(0, 2)}</span>
                  <span className="mk-body">
                    <span className="mk-name">{b.marca}</span>
                    <span className="mk-tag">{b.tag}</span>
                  </span>
                  <span className="mk-meta">{n} repuestos <IconArrowRight size={15} /></span>
                </button>
              ))}
              {marcas.length === 0 && <div className="empty">No hay marcas para este tipo de equipo.</div>}
            </div>
            <p className="hint"><IconShield size={15} /> Las marcas se citan solo a fines de compatibilidad. SANHUA es el componente original de fábrica.</p>
          </section>
        )}

        {/* STEP 3 — SERIE / MODELO */}
        {step === 3 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(2)} />
            <h2 className="screen-title">{marca?.marca} · elegí tu serie</h2>
            <p className="screen-sub">Seleccioná la línea o serie de tu equipo para ver sus componentes Sanhua.</p>
            <div className="grid grid-series">
              {series.map(({ s, n }, i) => {
                const slotId = `sr-${(marca?.marca||'').toLowerCase().replace(/[^a-z0-9]/g,'-')}-${i}`;
                return (
                <button key={i} className={"sr-card" + (serie === s ? " sel" : "")}
                  onClick={() => { setSerie(s); setFiltroCat("Todos"); setStep(4); }}>
                  <div className="sr-inner">
                    <div className="sr-img-wrap" onClick={e => e.stopPropagation()}>
                      <image-slot id={slotId} class="sr-img-slot" shape="rounded" radius="8" fit="contain"
                        src={typeof acImg !== 'undefined' ? acImg(s.serie) : ''}
                        placeholder="foto del equipo"></image-slot>
                    </div>
                    <div className="sr-text">
                      <div className="sr-top">
                        <span className="sr-name">{s.serie}</span>
                        {s.refrigerante && <span className="rfr">{s.refrigerante}</span>}
                      </div>
                      {s.modelos && <div className="sr-models">{s.modelos}</div>}
                      <div className="sr-foot">
                        {s.btu && <span className="sr-btu">{s.btu}</span>}
                        <span className="sr-go">{n} repuesto{n === 1 ? "" : "s"} <IconArrowRight size={14} /></span>
                      </div>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 4 — COMPONENTES (carrito) */}
        {step === 4 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(3)} />
            <h2 className="screen-title">Componentes Sanhua</h2>
            <p className="screen-sub">{marca?.marca} · <b>{serie?.serie}</b>{serie?.modelos ? ` — ${serie.modelos}` : ""}</p>
            <p className="add-tip"><IconClipboard size={15} /> Agregá todos los repuestos que necesites — podés sumar de varias marcas y cotizarlos juntos.</p>

            {cats.length > 2 && (
              <div className="chips">
                {cats.map((t) => (
                  <button key={t} className={"chip" + (filtroCat === t ? " on" : "")} onClick={() => setFiltroCat(t)}>{t}</button>
                ))}
              </div>
            )}

            {items.some(it => /dpf|vee|válvula electrónica|electronic/i.test([it.codigoSanhua, it.componente, it.categoria].join(' '))) && (
              <div className="hint" style={{marginBottom:'16px', cursor:'pointer'}} onClick={() => { setCablesFrom(4); setStep(12); }}>
                <IconWrench size={15} /> <span>Esta serie incluye válvulas electrónicas — <b>ver guía de cables DPF</b></span>
              </div>
            )}

            <div className="list">
              {items.flatMap(splitItem).map((it, i) => {
                const added = inCart(it);
                return (
                  <div key={i} className={"prod" + (added ? " sel" : "")}>
                    <span className="prod-ico">
                      {prodImg(it.categoria, it.tipoLabel, it.componente)
                        ? <img className="prod-ico-img" src={prodImg(it.categoria, it.tipoLabel, it.componente)} alt="" />
                        : <PartIcon categoria={it.categoria} size={26} />}
                    </span>
                    <span className="prod-body">
                      <span className="prod-top">
                        <span className="cat-pill">{CAT_LABEL[it.categoria] || "Componente"}</span>
                        {it.confirmado
                          ? <span className="ver ver-ok"><IconCheck size={12} /> Código confirmado</span>
                          : <span className="ver">Equivalencia</span>}
                      </span>
                      <span className="prod-name">{it.componente}</span>
                      <span className="codes">
                        <CodigosSh raw={it.codigoSanhua} />
                        {it.codigoOEM && <span className="code"><span className="code-k">{marca?.marca}</span>{it.codigoOEM}</span>}

                      </span>
                      {it.kitContenido && (
                        <div className="kit-includes">
                          <span className="kit-includes-label">📦 Kit incluye:</span>
                          <ul className="kit-includes-list">
                            {it.kitContenido.map((k, i) => <li key={i}>{k}</li>)}
                          </ul>
                        </div>
                      )}
                      {it.nota && <span className="prod-note">{it.nota}</span>}
                    </span>
                    <span className="prod-right">
                      <button className={"add-btn" + (added ? " on" : "")} onClick={() => toggleCart(it)}>
                        {added ? <React.Fragment><IconCheck size={15} /> Agregado</React.Fragment>
                               : <React.Fragment><IconPlus size={15} /> Agregar</React.Fragment>}
                      </button>
                    </span>
                  </div>
                );
              })}
              {items.length === 0 && <div className="empty">No hay componentes para este filtro.</div>}
            </div>
          </section>
        )}

        {/* STEP 5 — DATOS + RESUMEN CARRITO */}
        {step === 5 && (
          <section className="fade screen narrow">
            <BackBtn onClick={() => setStep(4)} />
            <h2 className="screen-title">Tu cotización</h2>
            <p className="screen-sub">{carrito.length} repuesto{carrito.length === 1 ? "" : "s"} · te pasamos precio y disponibilidad por WhatsApp.</p>

            <div className="cart-list">
              {carrito.map((c, i) => (
                <div key={i} className="cart-item">
                  <span className="cart-ico"><PartIcon categoria={c.item.categoria} size={22} /></span>
                  <span className="cart-text">
                    <span className="cart-name">{c.item.componente}</span>
                    <span className="cart-meta">{[c.item.codigoSanhua, [c.marca, c.serie].filter(Boolean).join(" ")].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="qty">
                    <button className="qty-b" onClick={() => setQty(c.item, -1)} aria-label="Menos">−</button>
                    <span className="qty-n">{c.cantidad}</span>
                    <button className="qty-b" onClick={() => setQty(c.item, +1)} aria-label="Más">+</button>
                  </span>
                  <button className="cart-x" onClick={() => removeCart(c.item)} aria-label="Quitar"><IconX size={16} /></button>
                </div>
              ))}
              <button className="btn btn-ghost btn-add-more" onClick={() => setStep(1)}>
                <IconPlus size={16} /> Agregar otro repuesto
              </button>
            </div>

            <RecomendacionesSection carrito={carrito} onAgregar={(r) => {
              const item = { componente: r.nombre, categoria: r.categoria, codigoSanhua: r.codigo, nota: r.razon };
              if (!carrito.some(c => c.item.componente === item.componente)) {
                setCarrito(prev => [...prev, { marca: 'Recomendado', serie: '', modelos: '', item, cantidad: 1 }]);
              }
            }} />

            <div className="form">
              <Field
                label="Nombre / Razón social" required
                value={pedido.nombre} onChange={(v) => setPedido({ ...pedido, nombre: v })}
                placeholder="Ej: Refrigeración del Sur SRL"
                onBlur={() => touch('nombre')} error={errNombre} success={okNombre}
              />
              <div className="form-2">
                <Field
                  label="WhatsApp" required
                  value={pedido.tel} onChange={(v) => setPedido({ ...pedido, tel: v })}
                  placeholder="11 5555-5555" inputMode="tel"
                  onBlur={() => touch('tel')} error={errTel} success={okTel}
                  hint="10 dígitos sin el 0 ni el 15 (ej: 11 5555-5555)"
                />
                <Field
                  label="Ciudad / Localidad" required
                  value={pedido.ciudad} onChange={(v) => setPedido({ ...pedido, ciudad: v })}
                  placeholder="San Isidro, BA"
                  onBlur={() => touch('ciudad')} error={errCiudad} success={okCiudad}
                />
              </div>
              <Field
                label="Confirmar WhatsApp" required
                value={pedido.confirmTel} onChange={(v) => setPedido({ ...pedido, confirmTel: v })}
                placeholder="Repetí tu número de WhatsApp" inputMode="tel"
                onBlur={() => touch('confirmTel')} error={errConfirm} success={okConfirm}
                hint="Asegurate de escribirlo igual para recibir la cotización"
              />
              <Field label="Dirección de entrega (opcional)" value={pedido.direccion} onChange={(v) => setPedido({ ...pedido, direccion: v })} placeholder="Calle y número" />
              <div className="field">
                <label className="field-label">Nota (opcional)</label>
                <textarea className="field-input" rows={3} value={pedido.nota}
                  onChange={(e) => setPedido({ ...pedido, nota: e.target.value })}
                  placeholder="Cantidad, urgencia, modelo exacto del equipo…" />
              </div>
            </div>

            <p className="hint"><IconWhatsApp size={15} /> Coordinamos precio, pago y entrega por WhatsApp.</p>

            <button className="btn btn-primary btn-block" disabled={!formValido} onClick={enviarSolicitud}>
              Enviar solicitud <IconArrowRight size={18} />
            </button>
          </section>
        )}

        {/* STEP 6 — CONFIRMACIÓN */}
        {step === 6 && (
          <section className="fade screen narrow center">
            <div className="done-badge"><IconCheck size={40} /></div>
            <h2 className="screen-title big">¡Solicitud enviada!</h2>
            <p className="screen-sub center-sub">
              {pedido.nombre}, recibimos tu pedido de <b>{carrito.length} repuesto{carrito.length === 1 ? "" : "s"}</b>.
              Te contactamos por WhatsApp al <b>{pedido.tel}</b> con precio y disponibilidad{pedido.ciudad ? ` para ${pedido.ciudad}` : ""}.
            </p>

            <div className="recap">
              {carrito.map((c, i) => (
                <div key={i} className="recap-item">
                  <span className="recap-q">{c.cantidad}×</span>
                  <span className="recap-body">
                    <span className="recap-name">{c.item.componente}</span>
                    <span className="recap-codes">
                      <CodigosSh raw={c.item.codigoSanhua} />
                      {c.item.codigoOEM && <span className="code"><span className="code-k">{c.marca}</span>{c.item.codigoOEM}</span>}
                    </span>
                    <span className="recap-eq">{[c.marca, c.serie].filter(Boolean).join(" · ")}</span>
                  </span>
                </div>
              ))}
            </div>

            <WppButton text="Adelantar consulta por WhatsApp" msg={wppMsg()} className="btn btn-wpp btn-block" />

            {/* Accesorios sugeridos para kits */}
            {(() => {
              const comps = carrito.map(c => [c.item.codigoSanhua, c.item.componente].join(' ')).join(' ').toLowerCase();
              const tieneSEK = /sek|lpf|vee|válvula.*electr|eev/i.test(comps);
              const tieneTM  = /sh-tm0[12]|transformador.*24/i.test(comps);
              const tieneSP  = /sh-sp01|supercap/i.test(comps);
              if (!tieneSEK && !tieneTM) return null;
              const accs = [];
              if (!tieneTM) {
                accs.push({ ...TM_TRANSFORMERS[0], img: (window.__resources||{}).prodTm01 || 'assets/prod-tm01.jpg', razon: 'El Kit SEK requiere 24 Vdc. El TM01 alimenta el controlador SEC612 en instalaciones de hasta 15 W.' });
                accs.push({ ...TM_TRANSFORMERS[1], img: (window.__resources||{}).prodTm01 || 'assets/prod-tm01.jpg', razon: 'Para instalaciones más grandes o múltiples módulos (hasta 36 W / 1.5 A).' });
              }
              if (!tieneSP) {
                accs.push({ modelo: SP01.modelo, codigo: SP01.codigo, salida: SP01.entrada, img: (window.__resources||{}).prodSp01 || 'assets/prod-sp01.jpg', razon: SP01.uso });
              }
              if (accs.length === 0) return null;
              return (
                <div className="rec-block" style={{textAlign:'left',marginTop:'24px'}}>
                  <div className="rec-header">
                    <span className="rec-title">Accesorios para tu kit</span>
                    <span className="rec-sub">Completá la instalación — coordinamos todo en el mismo pedido</span>
                  </div>
                  <div className="rec-list">
                    {accs.map((a, i) => (
                      <div key={i} className="rec-card rec-card--alta">
                        <div className="rec-card-top">
                          <span className="rec-ico" style={{padding:0,width:'52px',height:'52px',flexShrink:0}}>
                            <img src={a.img} alt={a.modelo} style={{width:'52px',height:'52px',objectFit:'contain',borderRadius:'6px'}} />
                          </span>
                          <div className="rec-card-body">
                            <span className="rec-nombre">{a.modelo === 'SP01' ? 'SuperCap Module SP01' : 'Transformador ' + a.modelo}</span>
                            <span className="codes"><CodigosSh raw={a.codigo} /></span>
                          </div>
                          <a
                            className="rec-add-btn"
                            href={'https://wa.me/5491134696124?text=' + encodeURIComponent('Hola SANHUA YA, quiero agregar a mi pedido:\n• ' + (a.modelo === 'SP01' ? 'SuperCap Module SP01' : 'Transformador ' + a.modelo) + ' — ' + a.codigo)}
                            target="_blank" rel="noopener noreferrer"
                            style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'4px'}}
                          >
                            <IconWhatsApp size={14} /> Pedir
                          </a>
                        </div>
                        <p className="rec-razon">{a.razon}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <button className="btn btn-ghost btn-block" style={{marginTop:'12px'}} onClick={reset}>Hacer otra consulta</button>
          </section>
        )}

        {/* STEP 99 — PANEL DE SOLICITUDES */}
        {step === 99 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(0)} />
            <h2 className="screen-title">Solicitudes recibidas</h2>
            <p className="screen-sub">Registro local de cotizaciones enviadas desde este dispositivo.</p>
            <SolicitudesPanel />
          </section>
        )}
        {step === 10 && (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(0)} />
            <h2 className="screen-title">Buscar por aplicación</h2>
            <p className="screen-sub">¿No sabés el modelo exacto? Elegí dónde se usa el repuesto y te mostramos las opciones Sanhua.</p>
            <div className="grid grid-marcas-big">
              {APLICACIONES.map((a) => {
                const AIcon = ICONS[a.icon] || IconWrench;
                const n = a.repuestos.length;
                return (
                  <button key={a.id} className={"mk-card" + (appSel?.id === a.id ? " sel" : "")}
                    onClick={() => openApp(a, 10)}>
                    <span className="mk-avatar app-av"><AIcon size={26} /></span>
                    <span className="mk-body">
                      <span className="mk-name app-name">{a.nombre}</span>
                      <span className="mk-tag">{a.desc}</span>
                    </span>
                    <span className="mk-meta">
                      {a.marcaFlow
                        ? <React.Fragment>Elegí tu marca <IconArrowRight size={15} /></React.Fragment>
                        : <React.Fragment>{n} repuesto{n === 1 ? "" : "s"} <IconArrowRight size={15} /></React.Fragment>}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="hint"><IconShield size={15} /> Repuestos Sanhua originales. Las marcas y modelos se citan solo a fines de compatibilidad.</p>
          </section>
        )}

        {/* STEP 11 — REPUESTOS DE UNA APLICACIÓN (detalle) */}
        {step === 11 && (() => {
          const AIcon = ICONS[appSel?.icon] || IconWrench;
          const n = (appSel?.repuestos || []).length;
          return (
          <section className="fade screen">
            <BackBtn onClick={() => setStep(appFrom)} />
            <div className="appd-hero">
              <span className="appd-hero-ico"><AIcon size={30} /></span>
              <div className="appd-hero-body">
                <span className="appd-kicker">Buscar por aplicación</span>
                <h2 className="screen-title appd-title">{appSel?.nombre}</h2>
                <p className="appd-intro">{appSel?.intro || appSel?.desc}</p>
                <span className="appd-count"><IconClipboard size={15} /> {n} repuesto{n === 1 ? "" : "s"} Sanhua para esta aplicación</span>
              </div>
            </div>

            <div className="appd-list">
              {(() => {
                const _reps = appSel?.repuestos || [];
                const _hasBoth = _reps.some(isKitSEK) && _reps.some(isTXV);
                let _hdShown = false;
                return _reps.map((it, i) => {
                  const added = inCart(it);
                  const _isExp = isKitSEK(it) || isTXV(it);
                  const _showHd = _hasBoth && _isExp && !_hdShown && (_hdShown = true);
                  return (<React.Fragment key={i}>
                    {_showHd && (<div className="tech-choice-header">
                      <span className="tech-choice-label">Tecnología de expansión — elegí una</span>
                      <span className="tech-choice-sub">Kit SEK (electrónica) y TXV (termostática) son alternativas · no se usan juntas · <b>la electrónica ahorra 30–45 %</b></span>
                    </div>)}
                    <article className={"appd-card" + (added ? " sel" : "") + (isKitSEK(it) ? " card--sek" : "")}>
                    <div className={"appd-iso" + (prodImg(it.categoria, it.tipoLabel, it.componente) ? " appd-iso--photo" : "")} role="img" aria-label={it.iso || it.componente}>
                      {prodImg(it.categoria, it.tipoLabel, it.componente)
                        ? <img className="appd-iso-img" src={prodImg(it.categoria, it.tipoLabel, it.componente)} alt={it.componente} />
                        : <React.Fragment>
                            <span className="appd-iso-ico"><PartIcon categoria={it.categoria} size={30} /></span>
                            <span className="appd-iso-label">{it.iso || it.componente}</span>
                          </React.Fragment>
                      }
                    </div>
                    <div className="appd-content">
                      <div className="appd-top">
                        <span className="cat-pill">{it.tipoLabel || CAT_LABEL[it.categoria] || "Componente"}</span>
                        {(it.gases || []).map((g) => <span key={g} className="gas-chip">{g}</span>)}
                      </div>
                      <h3 className="appd-name">{it.componente}</h3>
                      {it.codigoSanhua && (
                        <span className="codes">
                          <CodigosSh raw={it.codigoSanhua} />
                        </span>
                      )}
                      <div className="appd-block">
                        <span className="comp-k">Función principal</span>
                        <p className="comp-t">{it.aplicacion}</p>
                      </div>
                      {it.ubicacion && (
                        <div className="appd-block comp-loc">
                          <span className="comp-k"><IconMapPin size={14} /> Ubicación</span>
                          <p className="comp-t">{it.ubicacion}</p>
                        </div>
                      )}
                      {isKitSEK(it) && (
                        <div className="sek-savings-banner">
                          <span className="sek-sav-ico">⚡</span>
                          <span><b>Ahorro 30–45 %</b> en consumo vs TXV termostática · recalentamiento electrónico preciso · mayor vida útil del compresor</span>
                        </div>
                      )}
                      {(isTXV(it) || isNTCSola(it)) && carrito.some(c => isKitSEK(c.item)) && (
                        <div className="sek-excl-note">{isNTCSola(it) ? 'La sonda NTC ya viene incluida en el Kit SEK.' : 'Con Kit SEK ya no necesitás TXV — seleccionarlo la reemplaza.'}</div>
                      )}
                      <button className={"add-btn appd-add" + (added ? " on" : "")}
                        onClick={() => smartToggleCartCtx(it, { marca: appSel.nombre, serie: "" })}>
                        {added ? <React.Fragment><IconCheck size={15} /> Agregado a la cotización</React.Fragment>
                               : <React.Fragment><IconPlus size={15} /> Agregar a la cotización</React.Fragment>}
                      </button>
                    </div>
                    </article>
                  </React.Fragment>);
                });
              })()}
            </div>

            {/* Guía de cables DPF — acceso directo desde sección Eléctricos */}
            {appSel?.id === 'electricos' && (
              <div className="hint" style={{marginBottom:'16px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}}
                onClick={() => { setCablesFrom(11); setStep(12); }}>
                <IconWrench size={15} />
                <span>Válvula electrónica DPF (heladeras) — <b>ver guía de cables y secuencia de excitación</b></span>
              </div>
            )}

            {/* Diagrama interactivo del circuito (demo — todas las aplicaciones) */}
            {typeof DiagramaApp !== 'undefined' && typeof DIAG_CONFIGS !== 'undefined' && DIAG_CONFIGS[appSel?.id] && (
              <DiagramaApp
                appId={appSel.id}
                appNombre={appSel.nombre}
                carrito={carrito}
                onToggle={(n) => {
                  const existente = carrito.find(c => {
                    const cs = c.item.codigoSanhua || '';
                    return (n.codigo || '').split(' · ').some(p => p.length > 2 && cs.includes(p.split(' ')[0]));
                  });
                  if (existente) { removeCart(existente.item); return; }
                  const it = { componente: n.nombre, categoria: n.cat, codigoSanhua: n.codigo };
                  smartToggleCartCtx(it, { marca: appSel.nombre, serie: '' });
                }}
              />
            )}

            {/* Tabla de marcas compatibles (solo cuando la aplicación la tiene) */}
            {appSel?.marcas && appSel.marcas.length > 0 && (
              <div className="compat-block">
                <h3 className="compat-title">Marcas compatibles</h3>
                <p className="compat-sub">Modelos que usan componentes Sanhua en el mercado argentino.</p>
                <div className="compat-table-wrap">
                  <table className="compat-table">
                    <thead>
                      <tr>
                        <th>Marca</th>
                        <th>Líneas / Modelos</th>
                        <th>Gama</th>
                        <th>Códigos Sanhua</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appSel.marcas.map((m, i) => (
                        <tr key={i}>
                          <td><b>{m.nombre}</b></td>
                          <td className="compat-td-lineas">{m.lineas}</td>
                          <td><span className={"compat-gama" + (m.gama.includes("Inverter") ? " gama-hi" : m.gama.includes("No Frost") ? " gama-mid" : " gama-lo")}>{m.gama}</span></td>
                          <td className="compat-td-codes">{m.componentes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="compat-note">Las marcas se citan solo a fines de compatibilidad técnica y no implican afiliación con SANHUA.</p>
              </div>
            )}
            <p className="hint"><IconShield size={15} /> Repuestos Sanhua originales. Las marcas y modelos se citan solo a fines de compatibilidad.</p>
          </section>
          );
        })()}

        {/* STEP 12 — GUÍA DE CABLES DPF */}
        {step === 12 && (
          <section className="fade screen narrow">
            <BackBtn onClick={() => setStep(cablesFrom)} />
            <h2 className="screen-title">Guía de cables — Bobinas DPF</h2>
            <p className="screen-sub">Motor paso a paso de 5 hilos · series PQ-M10 y PQ-M03</p>

            <div className="cables-section">
              <h3 className="cables-h3">Compatibilidad válvula → bobina</h3>
              <div className="cables-compat-table">
                <div className="cables-compat-head">
                  <span>Válvula</span><span>Serie bobina</span><span>Part number</span>
                </div>
                {DPF_COILS.map((c, i) => (
                  <div key={i} className="cables-compat-row">
                    <span className="cables-valve-range">{c.rango}</span>
                    <span className="cables-coil-serie">{c.coilSerie}</span>
                    <span className="code code-sh" style={{fontSize:'12px'}}><span className="code-k">Sanhua</span>{c.codigo}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cables-section">
              <h3 className="cables-h3">Color de cables</h3>
              <div className="cables-color-list">
                {DPF_CABLES.map((cable, i) => (
                  <div key={i} className="cables-color-row">
                    <span className="cables-terminal">
                      {cable.barred ? <span style={{textDecoration:'overline'}}>{cable.terminal}</span> : cable.terminal}
                    </span>
                    <span className="cables-swatch" style={{background: cable.hex, border: cable.hex === '#1a1a1a' ? '1px solid #555' : 'none'}}></span>
                    <span className="cables-color-name">{cable.color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cables-section">
              <h3 className="cables-h3">Secuencia de excitación (8 pasos)</h3>
              <div className="cables-exc-wrap">
                <table className="cables-exc-table">
                  <thead>
                    <tr>
                      <th>Cable</th>
                      {[1,2,3,4,5,6,7,8].map(n => <th key={n}>{n}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {DPF_EXCITACION.map((row, i) => (
                      <tr key={i}>
                        <td className="cables-exc-terminal">{row.terminal}</td>
                        {row.pasos.map((p, j) => (
                          <td key={j} className={"cables-exc-cell" + (p ? " on" : " off")}>{p ? "ON" : "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="cables-note">COM = polo común compartido por ambas bobinas. No conectar a tierra.</p>
            </div>

            <div className="cables-section">
              <h3 className="cables-h3">Agregar bobina a la cotización</h3>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                {DPF_COILS.map((c, i) => (
                  <button key={i} className="btn btn-outline"
                    onClick={() => {
                      const it = { componente:'Bobina ' + c.coilSerie + ' para VEE DPF', categoria:'coil', codigoSanhua:c.codigo, nota:c.rango };
                      if (!carrito.some(x => x.item.codigoSanhua === c.codigo))
                        setCarrito(prev => [...prev, { marca:'Bobina DPF', serie:'', modelos:'', item:it, cantidad:1 }]);
                      setStep(5);
                    }}>
                    Agregar {c.codigo}
                  </button>
                ))}
              </div>
            </div>

            <div className="cables-section">
              <h3 className="cables-h3">Transformadores 24 Vdc — TM01 / TM02</h3>
              <p className="cables-note" style={{marginBottom:'12px'}}>Fuente de alimentación para el controlador SEC612 y compatibles. Entrada universal 85–264 VAC.</p>
              <div className="cables-compat-table">
                <div className="cables-compat-head" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
                  <span>Modelo</span><span>Salida</span><span>Código</span><span>Uso típico</span>
                </div>
                {TM_TRANSFORMERS.map((t, i) => (
                  <div key={i} className="cables-compat-row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
                    <span className="cables-valve-range"><b>{t.modelo}</b> · {t.dim}</span>
                    <span className="cables-coil-serie">{t.salida}</span>
                    <span className="code code-sh" style={{fontSize:'12px'}}><span className="code-k">Sanhua</span>{t.codigo}</span>
                    <span style={{fontSize:'12px',color:'var(--fg-soft)'}}>{t.uso}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'14px'}}>
                {TM_TRANSFORMERS.map((t, i) => (
                  <button key={i} className="btn btn-outline"
                    onClick={() => {
                      const it = { componente:'Transformador ' + t.modelo + ' — 24 Vdc ' + t.salida, categoria:'solenoid', codigoSanhua:t.codigo, nota:t.uso };
                      if (!carrito.some(x => x.item.codigoSanhua === t.codigo))
                        setCarrito(prev => [...prev, { marca:'Accesorio VEE', serie:'', modelos:'', item:it, cantidad:1 }]);
                      setStep(5);
                    }}>
                    Agregar {t.codigo}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* STEP 30 — ASISTENTE IA */}
        {step === 30 && (
          <AIScreen
            onBack={() => setStep(0)}
            onCotizarKit={(kit) => cotizarKit(kit)}
          />
        )}

        {/* STEP 20 — KITS FRECUENTES */}
        {step === 20 && (
          <KitsSection
            onCotizar={cotizarKit}
            onBack={() => setStep(0)}
          />
        )}
      </main>

      {/* Barra flotante de carrito */}
      {showCart && (
        <div className="cart-bar">
          <div className="container cart-bar-in">
            <div className="cart-bar-info">
              <span className="cart-badge">{totalUnidades}</span>
              <span>{carrito.length} repuesto{carrito.length === 1 ? "" : "s"} en tu cotización</span>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(5)}>
              Pedir cotización <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      <Footer onAdmin={() => setStep(99)} />
    </div>
  );
}

Object.assign(window, { App });
