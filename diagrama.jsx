// ─────────────────────────────────────────────────────────────
// Diagramas interactivos de circuito por aplicación (v2)
// · Ruteo ortogonal: las líneas conectan nodo a nodo
// · Flechas de sentido de flujo + etiquetas + leyenda
// · Nodo en color = en cotización · gris = disponible
// ─────────────────────────────────────────────────────────────

const nodeImg2 = (cat, nombre) => (typeof prodImg === 'function' ? prodImg(cat, null, nombre) : null);

// Paleta de cañerías
const PIPE_COLORS = {
  warm:    { stroke: "#E07B39", label: "#A8541E" },  // líquido / descarga (alta presión)
  cool:    { stroke: "#5C9FD6", label: "#2C6BA8" },  // aspiración (baja presión)
  neutral: { stroke: "#9AA3AE", label: "#5F6B78" },  // señal / control / aire
};

// Grilla: columnas x = 2,16,30,44,58,72,86 · filas y = 2,29,56 · nodo w=10
// Anclajes (nodo w=10): left(x-.5, y+5) right(x+10.5, y+5) top(x+5, y-1) bottom(x+5, y+14)

const DIAG2 = {

  comercial: {
    titulo: "Refrigeración comercial — rack exhibidor", h: 78,
    nodes: [
      { id:"recibidor", nombre:"Recibidor",          x:2,  y:2,  static:true },
      { id:"filtro",    nombre:"Filtro DTG-E",       x:16, y:2,  cat:"filter",    codigo:"SH-DTG-E05020" },
      { id:"visor",     nombre:"Visor SYJ",          x:30, y:2,  cat:"service",   codigo:"SYJ12H51" },
      { id:"sole",      nombre:"Solenoide MDF",      x:44, y:2,  cat:"solenoid",  codigo:"MDF-A03" },
      { id:"txv",       nombre:"TXV RFGD03E",        x:58, y:2,  cat:"valve",     codigo:"RFGD03E-4.0" },
      { id:"eev",       nombre:"VEE LPF (Kit SEK)",  x:72, y:2,  cat:"valve",     codigo:"SEK14-01" },
      { id:"evap",      nombre:"Exhibidora",         x:86, y:2,  static:true },
      { id:"oilsep",    nombre:"Sep. de aceite",     x:2,  y:29, cat:"filter",    codigo:"SH-OIL-ACM" },
      { id:"check",     nombre:"Retención",          x:16, y:29, cat:"service",   codigo:"SH-CHECK" },
      { id:"reversing", nombre:"Válvula 4 vías",     x:30, y:29, cat:"reversing", codigo:"F(L)3H12U-52" },
      { id:"sec",       nombre:"SEC612",             x:58, y:29, cat:"valve",     codigo:"SEC612" },
      { id:"ycq",       nombre:"Transductor YCQC",   x:86, y:29, cat:"pressure",  codigo:"YCQC02L18" },
      { id:"comp",      nombre:"Compresor",          x:2,  y:56, static:true },
      { id:"llave",     nombre:"Llave SBV",          x:16, y:56, cat:"service",   codigo:"SBV(M)-JA5" },
      { id:"acm",       nombre:"Acumulador",         x:44, y:56, cat:"filter",    codigo:"SH-ACM" },
      { id:"tm",        nombre:"Transform. TM01",    x:58, y:56, cat:"solenoid",  codigo:"SH-TM01" },
      { id:"sp",        nombre:"SuperCap SP01",      x:72, y:56, cat:"solenoid",  codigo:"SH-SP01" },
    ],
    groups: [{ x:56, y:26.5, w:28, h:45, label:"Tablero" }],
    pipes: [
      { from:"comp",   fs:"top",    to:"oilsep", ts:"bottom", c:"warm", label:"descarga", arrow:true },
      { from:"oilsep", fs:"top",    to:"recibidor", ts:"bottom", c:"warm", arrow:true },
      { from:"oilsep", fs:"right",  to:"check",  ts:"left",   c:"warm" },
      { from:"check",  fs:"top",    to:"filtro", ts:"bottom", c:"warm" },
      { from:"check",  fs:"right",  to:"reversing", ts:"left", c:"neutral", dash:true, label:"desescarche" },
      { from:"recibidor", fs:"right", to:"filtro", ts:"left", c:"warm" },
      { from:"filtro", fs:"right",  to:"visor",  ts:"left",   c:"warm" },
      { from:"visor",  fs:"right",  to:"sole",   ts:"left",   c:"warm" },
      { from:"sole",   fs:"right",  to:"txv",    ts:"left",   c:"warm" },
      { from:"txv",    fs:"right",  to:"eev",    ts:"left",   c:"neutral", dash:true, label:"ó" },
      { from:"eev",    fs:"right",  to:"evap",   ts:"left",   c:"warm", arrow:true },
      { from:"evap",   fs:"bottom", to:"ycq",    ts:"top",    c:"cool", label:"aspiración", arrow:true },
      { from:"ycq",    fs:"bottom", to:"acm",    ts:"right",  c:"cool", via:[[91,74],[56,74],[56,61]] },
      { from:"acm",    fs:"left",   to:"llave",  ts:"right",  c:"cool" },
      { from:"llave",  fs:"left",   to:"comp",   ts:"right",  c:"cool", arrow:true },
      { from:"tm",     fs:"top",    to:"sec",    ts:"bottom", c:"neutral", dash:true, label:"24 Vdc" },
      { from:"sp",     fs:"left",   to:"tm",     ts:"right",  c:"neutral", dash:true },
      { from:"sec",    fs:"top",    to:"eev",    ts:"bottom", c:"neutral", dash:true, via:[[63,22],[77,22]], label:"comanda VEE" },
      { from:"ycq",    fs:"left",   to:"sec",    ts:"right",  c:"neutral", dash:true, label:"P-SENS" },
    ],
  },

  camaras: {
    titulo: "Cámara frigorífica — pump-down", h: 78,
    nodes: [
      { id:"recv",   nombre:"Recibidor",        x:2,  y:2,  static:true },
      { id:"filtro", nombre:"Filtro DTG-E",     x:16, y:2,  cat:"filter",   codigo:"SH-DTG-E05020" },
      { id:"visor",  nombre:"Visor SYJ",        x:30, y:2,  cat:"service",  codigo:"SYJ12H51" },
      { id:"sole",   nombre:"Solenoide MDF",    x:44, y:2,  cat:"solenoid", codigo:"MDF-A03" },
      { id:"txv",    nombre:"TXV RFGD03E",      x:58, y:2,  cat:"valve",    codigo:"RFGD03E-4.0" },
      { id:"sek",    nombre:"Kit SEK (VEE)",    x:72, y:2,  cat:"valve",    codigo:"SEK14-01" },
      { id:"evap",   nombre:"Evaporador",       x:86, y:2,  static:true },
      { id:"cond",   nombre:"Condensador",      x:2,  y:29, static:true },
      { id:"bobina", nombre:"Bobina MQ",        x:44, y:29, cat:"coil",     codigo:"MQ-A0622G-000001" },
      { id:"ntc",    nombre:"Sonda NTC",        x:72, y:29, cat:"sensor",   codigo:"Serie NTC" },
      { id:"comp",   nombre:"Compresor",        x:2,  y:56, static:true },
    ],
    pipes: [
      { from:"comp",   fs:"top",    to:"cond",   ts:"bottom", c:"warm", label:"descarga", arrow:true },
      { from:"cond",   fs:"top",    to:"recv",   ts:"bottom", c:"warm" },
      { from:"recv",   fs:"right",  to:"filtro", ts:"left",   c:"warm" },
      { from:"filtro", fs:"right",  to:"visor",  ts:"left",   c:"warm" },
      { from:"visor",  fs:"right",  to:"sole",   ts:"left",   c:"warm" },
      { from:"sole",   fs:"right",  to:"txv",    ts:"left",   c:"warm" },
      { from:"txv",    fs:"right",  to:"sek",    ts:"left",   c:"neutral", dash:true, label:"ó" },
      { from:"sek",    fs:"right",  to:"evap",   ts:"left",   c:"warm", arrow:true },
      { from:"bobina", fs:"top",    to:"sole",   ts:"bottom", c:"neutral", dash:true, label:"bobina" },
      { from:"sek",    fs:"bottom", to:"ntc",    ts:"top",    c:"neutral", dash:true, label:"incluida en kit" },
      { from:"ntc",    fs:"right",  toXY:[91,34], c:"neutral", dash:true },
      { from:"evap",   fs:"bottom", to:"comp",   ts:"right",  c:"cool", via:[[91,74],[14,74],[14,61]], label:"aspiración", arrow:true },
    ],
  },

  mochilas: {
    titulo: "Mochila / Unidad condensadora", h: 78,
    nodes: [
      { id:"cond",   nombre:"Condensador",      x:2,  y:2,  static:true },
      { id:"llave",  nombre:"Llave SBV",        x:16, y:2,  cat:"service",  codigo:"SBV(M)-JA5" },
      { id:"filtro", nombre:"Filtro DTG/HTG",   x:30, y:2,  cat:"filter",   codigo:"SH-DTG-E05020" },
      { id:"sole",   nombre:"Solenoide MDF",    x:44, y:2,  cat:"solenoid", codigo:"MDF-A03" },
      { id:"sek",    nombre:"Kit SEK / VEE",    x:58, y:2,  cat:"valve",    codigo:"SEK14-01" },
      { id:"evap",   nombre:"Evaporador",       x:86, y:2,  static:true },
      { id:"bobina", nombre:"Bobina MQ",        x:44, y:29, cat:"coil",     codigo:"MQ-A0622G-000001" },
      { id:"comp",   nombre:"Compresor",        x:2,  y:56, static:true },
      { id:"reg",    nombre:"Reguladora XTF",   x:44, y:56, cat:"pressure", codigo:"XTF15H01" },
    ],
    pipes: [
      { from:"comp",   fs:"top",   to:"cond",   ts:"bottom", c:"warm", label:"descarga", arrow:true },
      { from:"cond",   fs:"right", to:"llave",  ts:"left",   c:"warm" },
      { from:"llave",  fs:"right", to:"filtro", ts:"left",   c:"warm" },
      { from:"filtro", fs:"right", to:"sole",   ts:"left",   c:"warm" },
      { from:"sole",   fs:"right", to:"sek",    ts:"left",   c:"warm" },
      { from:"sek",    fs:"right", to:"evap",   ts:"left",   c:"warm", label:"línea de líquido", arrow:true },
      { from:"bobina", fs:"top",   to:"sole",   ts:"bottom", c:"neutral", dash:true, label:"bobina" },
      { from:"evap",   fs:"bottom", to:"reg",   ts:"right",  c:"cool", via:[[91,61]], label:"aspiración", arrow:true },
      { from:"reg",    fs:"left",  to:"comp",   ts:"right",  c:"cool", arrow:true },
    ],
  },

  heladeras: {
    titulo: "Heladera No Frost / Doble mando", h: 78,
    nodes: [
      { id:"cond",   nombre:"Condensador",       x:2,  y:2,  static:true },
      { id:"filtro", nombre:"Filtro BGQ/KGQ",    x:16, y:2,  cat:"filter",    codigo:"BGQ" },
      { id:"valv3v", nombre:"Válvula 3 vías",    x:30, y:2,  cat:"reversing", codigo:"KMV432" },
      { id:"evapfz", nombre:"Evap. Freezer",     x:58, y:2,  static:true },
      { id:"bdfm",   nombre:"Damper BDFM",       x:72, y:2,  cat:"solenoid",  codigo:"BDFM" },
      { id:"evapfr", nombre:"Evap. Frigorífico", x:86, y:2,  static:true },
      { id:"ddf",    nombre:"Válvula DDF",       x:30, y:29, cat:"valve",     codigo:"DDF-T" },
      { id:"zwf",    nombre:"Forzador ZWF26",    x:58, y:29, cat:"sensor",    codigo:"ZWF26" },
      { id:"jmk",    nombre:"Sensor puerta JMK", x:72, y:29, cat:"sensor",    codigo:"JMK" },
      { id:"comp",   nombre:"Compresor",         x:2,  y:56, static:true },
    ],
    pipes: [
      { from:"comp",   fs:"top",   to:"cond",   ts:"bottom", c:"warm", label:"descarga", arrow:true },
      { from:"cond",   fs:"right", to:"filtro", ts:"left",   c:"warm" },
      { from:"filtro", fs:"right", to:"valv3v", ts:"left",   c:"warm" },
      { from:"valv3v", fs:"right", to:"evapfz", ts:"left",   c:"warm", label:"capilar", arrow:true },
      { from:"valv3v", fs:"bottom", to:"ddf",   ts:"top",    c:"neutral", dash:true, label:"alternativa inverter" },
      { from:"evapfz", fs:"right", to:"bdfm",   ts:"left",   c:"neutral", label:"aire frío" },
      { from:"bdfm",   fs:"right", to:"evapfr", ts:"left",   c:"neutral", arrow:true },
      { from:"zwf",    fs:"top",   to:"evapfz", ts:"bottom", c:"neutral", dash:true, label:"forzador" },
      { from:"jmk",    fs:"top",   to:"bdfm",   ts:"bottom", c:"neutral", dash:true, label:"señal puerta" },
      { from:"evapfr", fs:"bottom", to:"comp",  ts:"right",  c:"cool", via:[[91,74],[14,74],[14,61]], label:"aspiración", arrow:true },
    ],
  },

  split: {
    titulo: "Split residencial frío/calor", h: 78,
    nodes: [
      { id:"cond",   nombre:"Condensador",      x:2,  y:2,  static:true, nota:"U. exterior" },
      { id:"filtro", nombre:"Filtro secador",   x:16, y:2,  cat:"filter",    codigo:"STGB" },
      { id:"llave",  nombre:"Llave SSV",        x:30, y:2,  cat:"service",   codigo:"SSV" },
      { id:"evap",   nombre:"Evaporador",       x:86, y:2,  static:true, nota:"U. interior" },
      { id:"v4v",    nombre:"Válvula 4 vías",   x:2,  y:29, cat:"reversing", codigo:"F(L)3H" },
      { id:"bobina", nombre:"Bobina",           x:16, y:29, cat:"coil",      codigo:"24 V · 220 V" },
      { id:"ntcext", nombre:"Sensor NTC ext.",  x:44, y:29, cat:"sensor",    codigo:"Serie NTC" },
      { id:"ntcint", nombre:"Sensor NTC int.",  x:86, y:29, cat:"sensor",    codigo:"Serie NTC" },
      { id:"comp",   nombre:"Compresor",        x:2,  y:56, static:true },
    ],
    pipes: [
      { from:"comp",   fs:"top",   to:"v4v",    ts:"bottom", c:"warm", label:"descarga", arrow:true },
      { from:"v4v",    fs:"top",   to:"cond",   ts:"bottom", c:"warm" },
      { from:"cond",   fs:"right", to:"filtro", ts:"left",   c:"warm" },
      { from:"filtro", fs:"right", to:"llave",  ts:"left",   c:"warm" },
      { from:"llave",  fs:"right", to:"evap",   ts:"left",   c:"warm", label:"línea de líquido · capilar", arrow:true },
      { from:"bobina", fs:"left",  to:"v4v",    ts:"right",  c:"neutral", dash:true, label:"bobina" },
      { from:"ntcint", fs:"top",   to:"evap",   ts:"bottom", c:"neutral", dash:true, label:"sensor" },
      { from:"ntcext", fs:"top",   toXY:[49,7], c:"neutral", dash:true, label:"sensor tubería" },
      { from:"evap",   fs:"right", to:"comp",   ts:"right",  c:"cool", via:[[98,7],[98,74],[14,74],[14,61]], label:"aspiración", arrow:true },
    ],
  },

  electricos: {
    titulo: "Tablero eléctrico — VEE, transductores y sensores", h: 78,
    nodes: [
      { id:"red",    nombre:"Red 220 VAC",        x:2,  y:29, static:true },
      { id:"tm01",   nombre:"Transform. TM01",    x:16, y:2,  cat:"solenoid", codigo:"SH-TM01" },
      { id:"tm02",   nombre:"Transform. TM02",    x:16, y:56, cat:"solenoid", codigo:"SH-TM02" },
      { id:"sp01",   nombre:"SuperCap SP01",      x:30, y:29, cat:"solenoid", codigo:"SH-SP01" },
      { id:"sec",    nombre:"Controlador SEC612", x:44, y:29, cat:"valve",    codigo:"SEC612-R4" },
      { id:"ycqb",   nombre:"Transductor YCQB",   x:58, y:2,  cat:"pressure", codigo:"YCQB02L12-1" },
      { id:"ycqc",   nombre:"Transductor YCQC",   x:58, y:56, cat:"pressure", codigo:"YCQC02L18" },
      { id:"ntc",    nombre:"Sensor NTC",         x:72, y:29, cat:"sensor",   codigo:"Serie NTC" },
      { id:"bobina", nombre:"Bobina solenoide",   x:86, y:29, cat:"coil",     codigo:"24 V · 220 V" },
    ],
    pipes: [
      { from:"red",  fs:"top",    to:"tm01", ts:"left",   c:"warm", via:[[7,7]], label:"220 VAC" },
      { from:"red",  fs:"bottom", to:"tm02", ts:"left",   c:"warm", via:[[7,61]] },
      { from:"tm01", fs:"right",  to:"sp01", ts:"top",    c:"warm", via:[[35,7]], label:"24 Vdc" },
      { from:"tm02", fs:"right",  to:"sp01", ts:"bottom", c:"warm", via:[[35,61]], label:"24 Vdc" },
      { from:"sp01", fs:"right",  to:"sec",  ts:"left",   c:"warm", label:"respaldo" },
      { from:"ycqb", fs:"bottom", to:"sec",  ts:"top",    c:"neutral", dash:true, via:[[63,20],[49,20]], label:"0.5–3.5 V" },
      { from:"ycqc", fs:"top",    to:"sec",  ts:"bottom", c:"neutral", dash:true, via:[[63,49],[49,49]], label:"4–20 mA" },
      { from:"ntc",  fs:"left",   to:"sec",  ts:"right",  c:"neutral", dash:true, label:"T-SENS" },
      { from:"red",  fs:"top", fdx:3, to:"bobina", ts:"top", c:"warm", via:[[10,24],[91,24]], label:"220 V" },
    ],
  },

  industria: {
    titulo: "Industria / Grandes superficies — aislamiento por sectores", h: 78,
    nodes: [
      { id:"rack",   nombre:"Rack compresores", x:2,  y:29, static:true },
      { id:"llaveA", nombre:"Llave esférica",   x:23, y:2,  cat:"service", codigo:"SBV" },
      { id:"visorA", nombre:"Visor líquido",    x:44, y:2,  cat:"service", codigo:"SYJ12H51" },
      { id:"corteA", nombre:"Corte sector A",   x:65, y:2,  cat:"service", codigo:"SBV" },
      { id:"secA",   nombre:"Sector A",         x:86, y:2,  static:true },
      { id:"llaveB", nombre:"Llave esférica",   x:23, y:56, cat:"service", codigo:"SBV" },
      { id:"visorB", nombre:"Visor líquido",    x:44, y:56, cat:"service", codigo:"SYJ12H51" },
      { id:"corteB", nombre:"Corte sector B",   x:65, y:56, cat:"service", codigo:"SBV" },
      { id:"secB",   nombre:"Sector B",         x:86, y:56, static:true },
    ],
    pipes: [
      { from:"rack",   fs:"top",    to:"llaveA", ts:"left", c:"warm", via:[[7,7]], label:"troncal A", arrow:true },
      { from:"llaveA", fs:"right",  to:"visorA", ts:"left", c:"warm" },
      { from:"visorA", fs:"right",  to:"corteA", ts:"left", c:"warm" },
      { from:"corteA", fs:"right",  to:"secA",   ts:"left", c:"warm", arrow:true },
      { from:"rack",   fs:"bottom", to:"llaveB", ts:"left", c:"warm", via:[[7,61]], label:"troncal B", arrow:true },
      { from:"llaveB", fs:"right",  to:"visorB", ts:"left", c:"warm" },
      { from:"visorB", fs:"right",  to:"corteB", ts:"left", c:"warm" },
      { from:"corteB", fs:"right",  to:"secB",   ts:"left", c:"warm", arrow:true },
    ],
  },

  mantenimiento: {
    titulo: "Mantenimiento / Service general", h: 66,
    nodes: [
      { id:"manif",  nombre:"Manómetros / vacío", x:58, y:2,  static:true },
      { id:"comp",   nombre:"Compresor",          x:2,  y:29, static:true },
      { id:"filtro", nombre:"Filtro secador",     x:30, y:29, cat:"filter",  codigo:"STGB" },
      { id:"llave",  nombre:"Llave de carga SSV", x:58, y:29, cat:"service", codigo:"SSV" },
      { id:"evap",   nombre:"Evaporador",         x:86, y:29, static:true },
    ],
    pipes: [
      { from:"comp",   fs:"right", to:"filtro", ts:"left",   c:"warm", label:"línea de líquido", arrow:true },
      { from:"filtro", fs:"right", to:"llave",  ts:"left",   c:"warm" },
      { from:"llave",  fs:"right", to:"evap",   ts:"left",   c:"warm", arrow:true },
      { from:"llave",  fs:"top",   to:"manif",  ts:"bottom", c:"neutral", dash:true, label:"carga / vacío" },
      { from:"evap",   fs:"bottom", to:"comp",  ts:"bottom", c:"cool", via:[[91,60],[7,60]], label:"aspiración", arrow:true },
    ],
  },

  criticas: {
    titulo: "Reparación crítica — compresor quemado", h: 66,
    nodes: [
      { id:"comp",   nombre:"Compresor nuevo",      x:2,  y:29, static:true },
      { id:"antiac", nombre:"Filtro antiácido",     x:30, y:29, cat:"filter", codigo:"DTGH" },
      { id:"nucleo", nombre:"Núcleo cerámico SH48", x:58, y:29, cat:"filter", codigo:"SH48" },
      { id:"resto",  nombre:"Circuito saneado",     x:86, y:29, static:true },
    ],
    pipes: [
      { from:"resto",  fs:"left",   to:"nucleo", ts:"right",  c:"cool", label:"aspiración", arrow:true },
      { from:"nucleo", fs:"left",   to:"antiac", ts:"right",  c:"cool" },
      { from:"antiac", fs:"left",   to:"comp",   ts:"right",  c:"cool", arrow:true },
      { from:"comp",   fs:"bottom", to:"resto",  ts:"bottom", c:"warm", via:[[7,60],[91,60]], label:"descarga", arrow:true },
    ],
  },
};

// ── Geometría ─────────────────────────────────────────────────
const NODE_W = 10;
function anchor2(n, side, d = 0) {
  const w = n.w || NODE_W;
  switch (side) {
    case "left":   return { x: n.x - 0.5,     y: n.y + w/2 + d, h: true  };
    case "right":  return { x: n.x + w + 0.5, y: n.y + w/2 + d, h: true  };
    case "top":    return { x: n.x + w/2 + d, y: n.y - 1,       h: false };
    default:       return { x: n.x + w/2 + d, y: n.y + w + 4,   h: false }; // bottom (debajo de la etiqueta)
  }
}

function routePts(a, b) {
  if (a.h && b.h) {
    if (Math.abs(a.y - b.y) < 1) return [a, b];
    const mx = (a.x + b.x) / 2;
    return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
  }
  if (!a.h && !b.h) {
    if (Math.abs(a.x - b.x) < 1) return [a, b];
    const my = (a.y + b.y) / 2;
    return [a, { x: a.x, y: my }, { x: b.x, y: my }, b];
  }
  if (a.h) return [a, { x: b.x, y: a.y }, b];
  return [a, { x: a.x, y: b.y }, b];
}

function roundedPath(pts, r = 1.6) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i], prev = pts[i-1], next = pts[i+1];
    const v1 = { x: p.x - prev.x, y: p.y - prev.y }, v2 = { x: next.x - p.x, y: next.y - p.y };
    const l1 = Math.hypot(v1.x, v1.y) || 1, l2 = Math.hypot(v2.x, v2.y) || 1;
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const p1 = { x: p.x - v1.x / l1 * rr, y: p.y - v1.y / l1 * rr };
    const p2 = { x: p.x + v2.x / l2 * rr, y: p.y + v2.y / l2 * rr };
    d += ` L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Q ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

// Punto medio del segmento más largo (para colocar la etiqueta)
function labelPos(pts) {
  let best = 0, bestLen = -1;
  for (let i = 0; i < pts.length - 1; i++) {
    const len = Math.hypot(pts[i+1].x - pts[i].x, pts[i+1].y - pts[i].y);
    if (len > bestLen) { bestLen = len; best = i; }
  }
  const p1 = pts[best], p2 = pts[best + 1];
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  const vertical = Math.abs(p2.y - p1.y) > Math.abs(p2.x - p1.x);
  if (vertical) {
    const anchorRight = mid.x > 82;
    return { x: mid.x + (anchorRight ? -1.6 : 1.6), y: mid.y + 0.7, anchor: anchorRight ? "end" : "start" };
  }
  return { x: mid.x, y: mid.y - 1.4, anchor: "middle" };
}

// ── Componente ────────────────────────────────────────────────
function DiagramaApp({ appId, appNombre, carrito, onToggle }) {
  const diag = DIAG2[appId];
  if (!diag) return null;
  const byId = {};
  diag.nodes.forEach(n => { byId[n.id] = n; });

  const inCartByCode = (codigo) => {
    if (!codigo) return false;
    const parts = codigo.split(" · ").map(p => p.split(" ")[0].trim());
    return carrito.some(c => {
      const cs = c.item.codigoSanhua || "";
      return parts.some(p => p.length > 2 && cs.includes(p));
    });
  };

  const nSel = diag.nodes.filter(n => !n.static && inCartByCode(n.codigo)).length;
  const nTot = diag.nodes.filter(n => !n.static).length;
  const H = diag.h || 78;

  return (
    <div className="diag-block">
      <div className="diag-head">
        <div style={{display:"flex", alignItems:"baseline", gap:"10px", flexWrap:"wrap"}}>
          <h3 className="compat-title" style={{margin:0}}>{diag.titulo}</h3>
          {nSel > 0 && <span style={{fontSize:"12px", color:"var(--accent)", fontWeight:600}}>{nSel} de {nTot} seleccionados</span>}
        </div>
        <p className="compat-sub" style={{marginTop:"4px"}}>
          Tocá un componente para sumarlo a la cotización · <span style={{color:"var(--accent)"}}>color = seleccionado</span> · gris = disponible
        </p>
      </div>

      <div className="diag-canvas" style={{aspectRatio: `100 / ${H}`}}>
        <svg className="diag-pipes" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {Object.entries(PIPE_COLORS).map(([k, v]) => (
              <marker key={k} id={"arr2-" + k} viewBox="0 0 6 6" refX="5" refY="3"
                markerWidth="2.6" markerHeight="2.6" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                <path d="M 0 0.4 L 6 3 L 0 5.6 z" fill={v.stroke} />
              </marker>
            ))}
          </defs>

          {(diag.groups || []).map((g, i) => (
            <g key={"g" + i}>
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="1.6"
                fill="rgba(150,160,175,.07)" stroke="#9AA3AE" strokeWidth="0.28" strokeDasharray="1.4 1.1" />
              <text x={g.x + 1.4} y={g.y + 3} fontSize="2.1" fontWeight="700" fill="#5F6B78"
                style={{textTransform:"uppercase", letterSpacing:".08em"}}>{g.label}</text>
            </g>
          ))}

          {diag.pipes.map((p, i) => {
            const a = anchor2(byId[p.from], p.fs, p.fdx || 0);
            const bEnd = p.toXY
              ? { x: p.toXY[0], y: p.toXY[1], h: a.h }
              : anchor2(byId[p.to], p.ts, p.tdx || 0);
            let pts;
            if (p.via && p.via.length) {
              pts = [a, ...p.via.map(v => ({ x: v[0], y: v[1] })), bEnd];
            } else {
              pts = routePts(a, bEnd);
            }
            const col = PIPE_COLORS[p.c] || PIPE_COLORS.neutral;
            const lp = p.label ? labelPos(pts) : null;
            return (
              <g key={i}>
                <path d={roundedPath(pts)} fill="none"
                  stroke={col.stroke}
                  strokeWidth={p.dash ? 0.55 : 0.9}
                  strokeDasharray={p.dash ? "1.6 1.2" : "none"}
                  strokeLinecap="round"
                  opacity={p.dash ? 0.75 : 0.95}
                  markerEnd={p.arrow ? `url(#arr2-${p.c})` : "none"} />
                {lp && (
                  <text x={lp.x} y={lp.y} textAnchor={lp.anchor} fontSize="2.2" fontWeight="600"
                    fill={col.label} stroke="#FFFFFF" strokeWidth="0.55" opacity="0.95"
                    style={{paintOrder:"stroke"}}>{p.label}</text>
                )}
              </g>
            );
          })}
        </svg>

        {diag.nodes.map((n) => {
          const sel = !n.static && inCartByCode(n.codigo);
          const img = n.static ? null : nodeImg2(n.cat, n.nombre);
          const w = n.w || NODE_W;
          return (
            <button key={n.id}
              className={"diag-node" + (sel ? " sel" : "") + (n.static ? " static" : "")}
              style={{ left: n.x + "%", top: (n.y / H * 100) + "%", width: w + "%" }}
              onClick={() => !n.static && onToggle(n)}
              title={n.nota || (n.static ? n.nombre : ((sel ? "Quitar: " : "Agregar: ") + n.nombre))}>
              <span className="diag-img-wrap">
                {img
                  ? <img src={img} alt="" className="diag-img" />
                  : <span className={"diag-img diag-img--ph" + (n.static ? " static-ph" : "")}>{n.static ? "⚙" : "＋"}</span>}
                {sel && <span className="diag-check">✓</span>}
              </span>
              <span className="diag-label">{n.nombre}</span>
            </button>
          );
        })}
      </div>

      <div className="diag-legend">
        <span className="diag-leg-item"><i className="diag-leg-line" style={{background:PIPE_COLORS.warm.stroke}}></i> Líquido / descarga (alta presión)</span>
        <span className="diag-leg-item"><i className="diag-leg-line" style={{background:PIPE_COLORS.cool.stroke}}></i> Aspiración (baja presión)</span>
        <span className="diag-leg-item"><i className="diag-leg-line diag-leg-dash"></i> Señal eléctrica · control · alternativas</span>
      </div>
      <p className="compat-note">Esquema ilustrativo del circuito — no representa la posición física exacta de cada componente.</p>
    </div>
  );
}

function DiagramaComercial({ carrito, onToggle }) {
  return React.createElement(DiagramaApp, { appId:"comercial", appNombre:"Refrigeración comercial", carrito, onToggle });
}

Object.assign(window, { DiagramaApp, DiagramaComercial, DIAG_CONFIGS: DIAG2 });
