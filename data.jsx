// ─────────────────────────────────────────────────────────────
// Datos de marca SANHUA + metadatos del catálogo (data real en catalogo.js)
// ─────────────────────────────────────────────────────────────

// Fabricantes (OEM) — lista corta para chips
const OEM = [
  "Daikin", "Samsung", "Carrier", "LG", "Gree", "Midea", "Hisense",
  "Hitachi", "Panasonic", "Trane", "Mitsubishi E.", "BGH", "Philco", "RCA",
];

// Tabla OEM detallada (fuente: catálogo Bellini + documentación pública Sanhua)
const OEM_DETALLE = [
  { marca:"Gree",         ini:"GR", hue:150, componentes:"Válvulas 4 vías, VEE, sensores, filtros (100 % del mercado), VRF y rooftop",              segmento:"Residencial, comercial, industrial", tipo:"directo"    },
  { marca:"Daikin",       ini:"DA", hue:210, componentes:"Válvulas 4 vías, VEE, termistores, filtros",                                               segmento:"Residencial, comercial, VRF",        tipo:"directo"    },
  { marca:"Samsung",      ini:"SA", hue:232, componentes:"Válvulas 4 vías, VEE, bobinas — citado en listas oficiales de partes",                     segmento:"Residencial, comercial",             tipo:"directo"    },
  { marca:"LG",           ini:"LG", hue:358, componentes:"Válvulas 4 vías, EEV, bobinas, sensores — códigos OEM confirmados",                        segmento:"Residencial, comercial",             tipo:"directo"    },
  { marca:"Carrier",      ini:"CA", hue:8,   componentes:"Válvulas 4 vías, filtros, componentes de línea residencial y comercial",                   segmento:"Residencial, comercial, VRF, industrial", tipo:"directo" },
  { marca:"Midea",        ini:"MI", hue:200, componentes:"Plataforma Sanhua OEM en splits inverter; válvulas 4 vías, VEE",                           segmento:"Residencial, comercial",             tipo:"directo"    },
  { marca:"Hisense",      ini:"HI", hue:350, componentes:"Sanhua OEM en válvulas 4 vías; grupo Haier, >60 % del mercado",                            segmento:"Residencial",                        tipo:"directo"    },
  { marca:"Hitachi",      ini:"HT", hue:38,  componentes:"Válvulas 4 vías, EEV — relación OEM confirmada globalmente por Sanhua",                    segmento:"Residencial, comercial",             tipo:"global"     },
  { marca:"Panasonic",    ini:"PA", hue:26,  componentes:"Válvulas 4 vías, EEV — partner estratégico Sanhua a nivel global",                        segmento:"Residencial, comercial",             tipo:"global"     },
  { marca:"Trane / York", ini:"TR", hue:32,  componentes:"Válvulas, solenoides, componentes de línea — clientes Sanhua confirmados",                 segmento:"Comercial, industrial",              tipo:"global"     },
  { marca:"Mitsubishi E.",ini:"ME", hue:195, componentes:"Válvulas 4 vías, EEV — relación OEM documentada por Sanhua",                              segmento:"Residencial, comercial, VRF",        tipo:"global"     },
  { marca:"BGH",          ini:"BG", hue:260, componentes:"Válvulas 4 vías, EEV — plataforma base Haier/Hisense ensamblada en Tierra del Fuego",     segmento:"Residencial, comercial",             tipo:"plataforma" },
  { marca:"Philco",       ini:"PH", hue:270, componentes:"Componentes Sanhua heredados del OEM chino fabricante (Midea / Gree según modelo)",       segmento:"Residencial masivo",                 tipo:"plataforma" },
  { marca:"RCA",          ini:"RC", hue:280, componentes:"Componentes Sanhua heredados del OEM chino fabricante (Midea / Gree según modelo)",       segmento:"Residencial masivo",                 tipo:"plataforma" },
  { marca:"Surrey",       ini:"SU", hue:290, componentes:"Marca de licencia sobre plataforma china; componentes Sanhua probables según modelo",     segmento:"Residencial masivo",                 tipo:"plataforma" },
  { marca:"Fedders",      ini:"FE", hue:300, componentes:"Marca de licencia; splits y equipos de ventana sobre plataforma china — Sanhua probable", segmento:"Residencial, ventana",               tipo:"plataforma" },
];

// Datos corporativos verificados de SANHUA.
const SANHUA_FACTS = [
  { n: ">60%", t: "del mercado mundial de válvulas reversibles de 4 vías" },
  { n: "Nº1", t: "mundial en válvulas de 4 vías y de expansión electrónica" },
  { n: "+100M", t: "válvulas producidas por año en sus plantas" },
  { n: "1984", t: "más de 40 años abasteciendo a la industria HVAC/R" },
];

// Certificaciones reales asociadas a la fabricación SANHUA.
const CERTS = ["ISO 9001", "ISO 14001", "UL", "TÜV", "VDE", "CE", "RoHS"];

// Etiqueta legible por categoría técnica de componente.
const CAT_LABEL = {
  reversing: "Válvula 4 vías",
  valve: "Válvula de expansión",
  coil: "Bobina",
  solenoid: "Solenoide",
  filter: "Filtro / Deshidratador",
  sensor: "Sensor / Termistor",
  service: "Llave de servicio",
  pressure: "Presostato",
};

// Acento de color por marca (solo para el avatar tipográfico, no es el logo oficial).
const BRAND_HUE = {
  DAIKIN: 210, GREE: 150, SAMSUNG: 232, LG: 358, CARRIER: 8, MIDEA: 200, HISENSE: 350,
};

// Prefiltro por tipo de aplicación (primer paso del flujo).
const TIPOS = [
  { id: "todos", nombre: "Todos los equipos", desc: "Ver el catálogo completo", icon: "wrench" },
  { id: "heladeras", nombre: "Heladeras", desc: "Familiares, No Frost e Inverter", icon: "fridge" },
  { id: "split", nombre: "Split residencial", desc: "Alta pared, inverter y on/off", icon: "wind" },
  { id: "vrf", nombre: "VRF / Multisplit", desc: "Caudal variable, Multi V, cassette y ducto", icon: "gauge" },
  { id: "comercial", nombre: "Comercial / Refrigeración", desc: "Cámaras, vitrinas, equipo de paquete", icon: "snowflake" },
];

// Clasifica un componente por tipo de aplicación según texto de serie/modelo/nota.
function itemTipos(serie, modelos, comp, nota) {
  const c = [serie, modelos, comp, nota].join(" ").toLowerCase();
  const t = new Set();
  if (/heladera|no.frost|c[ií]clic|freezer|twin.cool|family.hub|instaview|door.in.door|linear.inv|khd|kgd|hsi|phnf|dfx|efficient|gourmet|sexto.sentido|wro|wrm|wrw|no.frost.bio|black.edition|hre|m230|m320|m410|eurosystem|hgf|bdfm|zwf26|damper|forzador.dc|pasos.el[eé]ctrica|ddf|bgq|kgq|deshidratador.*cobre/.test(c)) t.add("heladeras");
  if (/vrf|vrv|multi ?v\b|multi v|multisplit|multi-split|cassette|ducto/.test(c)) t.add("vrf");
  if (/comercial|c[áa]mara|g[óo]ndola|vitrina|bohn|heatcraft|copeland|manitowoc|paquete|packaged|\brack\b|condensad/.test(c)) t.add("comercial");
  if (/split|alta pared|residencial|9\.000|12\.000|18\.000|24\.000|\b9k\b|\b12k\b|\b18k\b|\b24k\b/.test(c)) t.add("split");
  if (t.size === 0) t.add("split");
  return t;
}
function matchTipo(tipoId, serie, item) {
  if (!tipoId || tipoId === "todos") return true;
  return itemTipos(serie.serie, serie.modelos || "", item.componente, item.nota || "").has(tipoId);
}

// ─────────────────────────────────────────────────────────────
// Guía de componentes — qué hace cada pieza y dónde se ubica.
// "iso" es el slot para la imagen isométrica (dónde se aplica / cambia).
// ─────────────────────────────────────────────────────────────
const COMPONENTES_INFO = [
  {
    id: "service", categoria: "service", emoji: "🔧", nombre: "Llave de servicio",
    funcion: "Son los puntos de acceso seguro al sistema sellado. Actúan como una canilla que permite conectar manómetros y bombas de vacío para medir presiones, extraer el aire del circuito o cargar gas refrigerante sin que se escape a la atmósfera.",
    ubicacion: "Fijadas en el lateral de la unidad exterior, donde se enroscan las tuercas de los caños de cobre que conectan con el interior.",
    iso: "Llave de servicio · lateral de la unidad exterior",
  },
  {
    id: "reversing", categoria: "reversing", emoji: "🔄", nombre: "Válvula 4 vías",
    funcion: "Es la pieza clave de los equipos frío/calor. Invierte físicamente el sentido en que circula el gas refrigerante impulsado por el compresor: absorbe calor de la calle y lo lleva al interior en invierno, o al revés en verano.",
    ubicacion: "Dentro de la unidad exterior, soldada a la tubería de descarga del compresor.",
    iso: "Válvula 4 vías · soldada a la descarga del compresor",
  },
  {
    id: "valve", categoria: "valve", emoji: "🎛️", nombre: "Válvula de expansión",
    funcion: "Genera una caída brusca de presión. Recibe el líquido refrigerante a alta presión y lo obliga a pasar por un orificio muy pequeño; al expandirse, su temperatura cae drásticamente. Las electrónicas (VEE) ajustan el flujo milimétricamente, ahorrando energía.",
    ubicacion: "En los splits modernos suele alojarse dentro de la unidad exterior, justo antes del viaje del refrigerante hacia la unidad interior.",
    iso: "Válvula de expansión · interior de la unidad exterior",
  },
  {
    id: "sensor", categoria: "sensor", emoji: "🌡️", nombre: "Sensor / Termistor",
    funcion: "Son los \"sentidos\" del aire acondicionado: resistencias que cambian su valor según el calor que reciben. La placa de control lee esos valores para saber la temperatura del ambiente o de los caños, y decide si acelerar o detener el compresor.",
    ubicacion: "Varios distribuidos: el de ambiente va detrás de los filtros de la unidad interior; otros metálicos van pegados a las tuberías, adentro y afuera.",
    iso: "Sensor / termistor · detrás de los filtros y en tuberías",
  },
  {
    id: "coil", categoria: "coil", emoji: "🧲", nombre: "Bobina",
    funcion: "Es el \"músculo\" eléctrico que acciona las válvulas a distancia. Un electroimán (solenoide) que, al recibir corriente de la placa, genera un campo magnético y mueve un pistón interno para abrir o cambiar la posición de la válvula.",
    ubicacion: "Se acopla por fuera del cuerpo de bronce de las válvulas, fijada con un tornillo, dentro de la unidad exterior.",
    iso: "Bobina solenoide · acoplada al cuerpo de la válvula",
  },
  {
    id: "filter", categoria: "filter", emoji: "💧", nombre: "Filtro / Deshidratador",
    funcion: "Protege al compresor y evita que el sistema se tape. Una malla metálica retiene partículas sólidas (virutas de cobre, suciedad) y un material desecante absorbe la humedad del circuito, letal para el motor y el aceite.",
    ubicacion: "Va soldado en la línea de refrigerante líquido, generalmente dentro de la unidad exterior.",
    iso: "Filtro deshidratador · soldado en la línea de líquido",
  },
];

// ─────────────────────────────────────────────────────────────
// Fotos de producto — usa window.__resources (bundle) con fallback a ruta local
// ─────────────────────────────────────────────────────────────
const _WR = window.__resources || {};
const _A = {
  filterStg:   _WR.prodFilterStg   || "assets/prod-filter-stg.jpg",
  filterDtge:  _WR.prodFilterDtge  || "assets/prod-filter-dtge.jpg",
  tobera:      _WR.prodTobera      || "assets/prod-tobera.webp",
  reversing:   _WR.prodReversing   || "assets/prod-reversing.png",
  valve:       _WR.prodValve       || "assets/prod-valve.png",
  solenoid:    _WR.prodSolenoid    || "assets/prod-solenoid.png",
  bobina:      _WR.prodBobina      || "assets/prod-bobina-inversora.jpg",
  jmk:         _WR.prodJmk         || "assets/prod-jmk.png",
  bdfmSingle:  _WR.prodBdfmSingle  || "assets/prod-bdfm-single.png",
  bdfmDouble:  _WR.prodBdfmDouble  || "assets/prod-bdfm-double.png",
  zwf26:       _WR.prodZwf26       || "assets/prod-zwf26.png",
  bgq:         _WR.prodBgq         || "assets/prod-bgq.png",
  ddf:         _WR.prodDdf         || "assets/prod-ddf.jpg",
  filter:      _WR.prodFilter      || "assets/prod-filter.png",
  sensor:      _WR.prodSensor      || "assets/prod-sensor.png",
  pressure:    _WR.prodPressure    || "assets/prod-pressure.png",
  service:     _WR.prodService     || "assets/prod-service.png",
  sight:       _WR.prodSight       || "assets/prod-sight.png",
  serviceBall: _WR.prodServiceBall || "assets/prod-service-ball.png",
  threeWay:    _WR.prod3way        || "assets/prod-3way.png",
  sek:         _WR.prodSek         || "assets/prod-sek.png",
  eev:         _WR.prodEev         || "assets/prod-eev.png",
  core:        _WR.prodCore        || "assets/prod-core.png",
  sec612:      _WR.prodSec612      || "assets/prod-sec612.webp",
  bobinaMq:    _WR.prodBobinaMq    || "assets/prod-bobina-mq.webp",
  ycqc:       _WR.prodYcqc       || "assets/prod-ycqc.png",
  ycqb:        _WR.prodYcqb        || "assets/prod-ycqb.png",
  tm01:        _WR.prodTm01        || "assets/prod-tm01.jpg",
  sp01:        _WR.prodSp01        || "assets/prod-sp01.jpg",
};

const PRODUCT_IMAGES = {
  reversing: _A.reversing,
  valve:     _A.valve,
  coil:      _A.bobina,
  solenoid:  _A.solenoid,
  filter:    _A.filter,
  sensor:    _A.sensor,
  pressure:  _A.pressure,
  service:   _A.service,
  // tipoLabel overrides
  "Visor de líquido":   _A.sight,
  "Llave esférica":     _A.serviceBall,
  "Llave de servicio":  _A.serviceBall,
  "Válvula 3 vías":     _A.threeWay,
  "VEE / Kit SEK":      _A.sek,
  "Orificio / tobera":  _A.tobera,
  "Núcleo recambiable": _A.core,
  "Núcleo / cartucho":  _A.core,
};

// Reglas por nombre de componente (más específicas que categoría)
const PROD_IMG_RULES = [
  { re: /\bSP01\b|supercap|supercapacitor/i,               img: _A.sp01       },
  { re: /\bTM01\b|\bTM02\b|transformador.*24v|24v.*transform/i, img: _A.tm01    },
  { re: /SEC61[0-9]|controlador.*recalent|superheat.*control/i, img: _A.sec612  },
  { re: /\bMQ-[AD]|bobina.*mdf|mdf.*bobina|bobina.*solen/i,    img: _A.bobinaMq },
  { re: /YCQC|transductor.*4.20|4.20.*mA/i,                 img: _A.ycqc       },
  { re: /YCQB|transductor.*0.5|voltaje.*trans/i,             img: _A.ycqb       },
  { re: /bobina|coil/i,                                   img: _A.bobina      },
  { re: /JMK|TSA|magn[eé]tico.*puerta|puerta.*magn[eé]t/i, img: _A.jmk         },
  { re: /ZWF|[Ff]orzador|[Bb]rushless|[Vv]entilador.*DC|DC.*[Vv]entilador/i, img: _A.zwf26      },
  { re: /BGQ|KGQ|deshidratador.*cobre|filtro.*cobre|capilar/i, img: _A.bgq         },
  { re: /DDF|pasos el[eé]ctrica|stepper/i,                   img: _A.ddf         },
  { re: /BDFM.*[Dd]ouble|[Dd]ouble.*BDFM|damper.*doble|doble.*damper/i, img: _A.bdfmDouble  },
  { re: /BDFM|damper|compuerta.*aire|aire.*compuerta/i,    img: _A.bdfmSingle  },
  { re: /kit\s*SEK|SEK\d/i,                               img: _A.sek         },
  { re: /núcleo|cartucho|SH48|HTG-A80/i,                  img: _A.core        },
  { re: /3 vías|3vias|KMV|doble mando/i,                  img: _A.threeWay    },
  { re: /electr[oó]nica|VEE|EEV/i,                        img: _A.eev         },
  { re: /tobera|orificio|nozzle|RFKH/i,                  img: _A.tobera      },
  { re: /termostática|TXV/i,                              img: _A.valve       },
  { re: /4 vías|inversora|reversing/i,                    img: _A.reversing   },
  { re: /solenoide|solenoid/i,                            img: _A.solenoid    },
  { re: /visor|sight/i,                                   img: _A.sight       },
  { re: /transductor|presostato/i,                        img: _A.pressure    },
  { re: /llave esférica|llave de bola|ball valve/i,       img: _A.serviceBall },
  { re: /llave.*servicio|service valve|stop valve/i,      img: _A.service     },
  { re: /válvula de servicio|válvula servicio/i,          img: _A.service     },
  { re: /DTGE|DTG-E/i,                                   img: _A.filterDtge  },
  { re: /\bSTG\b|STG[BEF]|DTG-L/i,                        img: _A.filterStg   },
  { re: /deshidratador|filter drier|secador/i,            img: _A.filter      },
  { re: /filtro|filter|strainer/i,                        img: _A.filter      },
  { re: /sensor|termistor|NTC|thermistor/i,               img: _A.sensor      },
];

// Helper: nombre > tipoLabel > categoría
function prodImg(categoria, tipoLabel, nombre) {
  if (nombre) {
    const hit = PROD_IMG_RULES.find((r) => r.re.test(nombre));
    if (hit) return hit.img;
  }
  if (tipoLabel && PRODUCT_IMAGES[tipoLabel]) return PRODUCT_IMAGES[tipoLabel];
  return PRODUCT_IMAGES[categoria] || null;
}

// ── SuperCap Module SP01 ──────────────────────────────────────────
const SP01 = {
  modelo: "SP01",
  codigo: "SH-SP01",
  nombre: "SuperCap Module SP01",
  entrada: "24 Vdc · 40–80 mA",
  salida: "24 Vdc · 500 mA",
  cap: "2.5 F (supercapacitor interno)",
  op: "-20 a +60 °C",
  uso: "Mantiene la válvula de expansión electrónica en posición segura (o la cierra) ante un corte de tensión. Imprescindible en instalaciones críticas: cámaras, góndolas y rack con VEE LPF.",
  ubicacion: "En paralelo con la salida del transformador TM01/TM02, antes del controlador SEC612.",
};

// ── Transformadores TM01 / TM02 — fuente 24 Vdc para controladores VEE ────────
const TM_TRANSFORMERS = [
  {
    modelo: "TM01",
    codigo: "SH-TM01",
    salida: "24 Vdc · 0.63 A · 15.2 W",
    entrada: "85–264 VAC · 47–63 Hz",
    dim: "18 × 58.4 × 90 mm",
    corrienteAC: "0.5 A / 115 VAC · 0.25 A / 230 VAC",
    cable: "18–24 AWG (0.2–0.8 mm²)",
    op: "-30 a +70 °C · 20–90 % HR",
    uso: "Alimenta controladores SEC612 y similares en instalaciones de hasta ~15 W (1 VEE LPF pequeña o media)."
  },
  {
    modelo: "TM02",
    codigo: "SH-TM02",
    salida: "24 Vdc · 1.5 A · 36 W",
    entrada: "85–264 VAC · 47–63 Hz",
    dim: "35 × 58.4 × 90 mm",
    corrienteAC: "0.5 A / 115 VAC · 0.25 A / 230 VAC",
    cable: "18–24 AWG (0.2–0.8 mm²)",
    op: "-30 a +70 °C · 20–90 % HR",
    uso: "Alimenta controladores SEC612 en instalaciones más grandes o cuando se alimentan varios módulos desde una sola fuente (hasta 36 W)."
  },
];

// ── Bobinas y cables para válvulas DPF ──────────────────────────────────────
const DPF_COILS = [
  { rango: "DPF(T01) / DPF(TS1)  ·  1.3C a 3.2C", re: /DPF\((T01|TS1)\)/i, coilSerie: "PQ-M10", codigo: "DPF-58001",
    dimVal: { F:82, G:40, H:30, d:"6.35–7.94", N:17.3 }, dimBob: { A:38.5, B:26.4, C:25.6, D:700, E:600 } },
  { rango: "DPF(S03)  ·  4.0C a 6.5C",             re: /DPF\(S03\)/i,       coilSerie: "PQ-M03", codigo: "DPF-58002",
    dimVal: { F:148, G:64.7, H:63.4, d:15.88,    N:35.3 }, dimBob: { A:67.5, B:42.4, C:33,   D:700, E:600 } },
];
const DPF_CABLES = [
  { terminal:"A",   barred:false, color:"Naranja",  hex:"#E07820" },
  { terminal:"B",   barred:false, color:"Rojo",     hex:"#CC1010" },
  { terminal:"A",   barred:true,  color:"Amarillo", hex:"#E8C800" },
  { terminal:"B",   barred:true,  color:"Negro",    hex:"#1a1a1a" },
  { terminal:"COM", barred:false, color:"Gris",     hex:"#888888" },
];
const DPF_EXCITACION = [
  { terminal:"A",  pasos:[1,1,0,0,0,0,0,1] },
  { terminal:"B",  pasos:[0,1,1,1,0,0,0,0] },
  { terminal:"Ā",  pasos:[0,0,0,1,1,1,0,0] },
  { terminal:"B̄",  pasos:[0,0,0,0,0,1,1,1] },
];

Object.assign(window, { OEM, OEM_DETALLE, SANHUA_FACTS, CERTS, CAT_LABEL, BRAND_HUE, TIPOS, itemTipos, matchTipo, COMPONENTES_INFO, PRODUCT_IMAGES, PROD_IMG_RULES, prodImg, SP01, TM_TRANSFORMERS, DPF_COILS, DPF_CABLES, DPF_EXCITACION });

// ─────────────────────────────────────────────────────────────
// Catálogo por APLICACIÓN — repuestos Sanhua agrupados por dónde se usan.
// Vía de búsqueda paralela al flujo por marca; alimenta el mismo carrito.
// ─────────────────────────────────────────────────────────────
const APLICACIONES = [
  {
    id: "heladeras", nombre: "Heladeras", icon: "snowflake",
    desc: "Familiares, No Frost, Inverter y cíclicas",
    intro: "Repuestos Sanhua para heladeras nacionales e importadas: válvula de 3 vías de doble mando, válvulas DDF, forzadores ZWF26, dampers BDFM y filtros BGQ/KGQ. Los mismos componentes que montan de fábrica Samsung, LG, Whirlpool, Bosch, Mabe, Electrolux, Philco/Noblex, Koh-i-noor, Gafa y más.",
    repuestos: [
      { componente: "Válvula de 3 vías (doble mando)", categoria: "reversing", tipoLabel: "Válvula 3 vías",
        codigoSanhua: "KMV432 · KHG41D/8", gases: ["R600", "R134a"],
        aplicacion: "Deriva el gas para apagar la heladera y dejar el freezer funcionando (o viceversa). Es el corazón del sistema de doble mando en heladeras familiares cíclicas.",
        ubicacion: "Soldada en la línea de gas, dentro del compartimento del compresor, parte trasera inferior de la heladera.",
        iso: "Válvula 3 vías · línea de gas en el compresor" },
      { componente: "Válvula de pasos eléctrica (stepper valve)",
        categoria: "valve", tipoLabel: "Válvula 3 vías",
        codigoSanhua: "DDF-T · DDF-S · DDF-L · DDF-G · DDF-D", gases: ["R600", "R134a"],
        aplicacion: "Gestiona el flujo de refrigerante entre los dos compartimentos (heladera / freezer) en equipos No Frost inverter de alta gama. Permite frío independiente por zona y ciclos de descongelado selectivos.",
        ubicacion: "Soldada en la línea de refrigerante, dentro del compartimento del compresor, parte trasera inferior de la heladera.",
        iso: "Válvula DDF · línea de refrigerante" },
      { componente: "Forzador DC Brushless",
        categoria: "sensor",
        codigoSanhua: "ZWF26", gases: [],
        aplicacion: "Motor de ventilador sin escobillas para la circulación forzada del aire frío dentro del gabinete. Compatible con señal PWM del módulo inverter. Presente en todas las líneas No Frost.",
        ubicacion: "Montado sobre el evaporador interno, dentro del gabinete del freezer.",
        iso: "Forzador ZWF26 · sobre el evaporador interno" },
      { componente: "Damper motorizado (compuerta de aire)",
        categoria: "solenoid", tipoLabel: "Damper motorizado",
        codigoSanhua: "BDFM (Single) · BDFM (Double — doble compartimento)", gases: [],
        aplicacion: "Compuerta motorizada que controla el paso de aire frío del freezer al refrigerador. El modelo Double gestiona dos zonas de temperatura independientes (0 °C en zona gourmet / cajón biológico).",
        ubicacion: "En el conducto de distribución de aire entre el freezer y el compartimento de refrigeración.",
        iso: "Damper BDFM · conducto de distribución de aire" },
      { componente: "Sensor / interruptor magnético de puerta",
        categoria: "sensor",
        codigoSanhua: "JMK · TSA series", gases: [],
        aplicacion: "Detecta apertura y cierre de puertas para activar iluminación LED progresiva, ajustar el forzador y disparar alarmas en modelos de alta gama.",
        ubicacion: "Embutido en el marco de la puerta o en el gabinete, a la altura del cierre magnético.",
        iso: "Sensor JMK/TSA · marco de puerta" },
      { componente: "Filtro deshidratador de cobre",
        categoria: "filter",
        codigoSanhua: "BGQ / KGQ series", gases: ["R600", "R134a"],
        aplicacion: "Retiene humedad e impurezas del circuito sellado. Soldado al tubo capilar, es el componente de reposición básico en todo service de heladera — cíclica, No Frost o dinámica.",
        ubicacion: "Soldado en la línea de líquido, a la salida del condensador y antes del tubo capilar.",
        iso: "Filtro BGQ/KGQ · salida del condensador" },
    ],
    marcas: [
      { nombre: "Samsung",         lineas: "Twin Cooling, Family Hub, Evolution",       gama: "Inverter / No Frost Alta Gama",  componentes: "DDF, ZWF26, BDFM (Double), JMK/TSA, BGQ/KGQ" },
      { nombre: "LG",              lineas: "InstaView, Door-in-Door, Linear Inverter",  gama: "Inverter / No Frost Alta Gama",  componentes: "DDF, ZWF26, BDFM (Single), JMK/TSA, BGQ/KGQ" },
      { nombre: "Whirlpool AG",    lineas: "Gourmet, Sexto Sentido, WRO Side by Side",  gama: "Inverter / No Frost Alta Gama",  componentes: "DDF, ZWF26, BDFM (Double), BGQ/KGQ" },
      { nombre: "Bosch",           lineas: "Serie 4, Serie 6 Inverter",                 gama: "Inverter / No Frost Alta Gama",  componentes: "DDF, ZWF26, BGQ/KGQ" },
      { nombre: "Mabe / Patrick",  lineas: "No Frost Bio, Black Edition, HRE",          gama: "No Frost Regional / Estándar",   componentes: "ZWF26, BDFM (Single), BGQ/KGQ" },
      { nombre: "Whirlpool",       lineas: "WRM (No Frost), WRW Inverter",              gama: "No Frost Regional / Estándar",   componentes: "ZWF26, BDFM (Single), BGQ/KGQ" },
      { nombre: "Electrolux",      lineas: "Líneas DFX, Efficient AutoSense",           gama: "No Frost Regional / Estándar",   componentes: "ZWF26, BDFM (Single), BGQ/KGQ" },
      { nombre: "Philco / Noblex", lineas: "Líneas No Frost PHNF",                      gama: "No Frost Regional / Estándar",   componentes: "ZWF26, BDFM (Single), BGQ/KGQ" },
      { nombre: "Koh-i-noor",      lineas: "KHD, KGD (Cíclicas y Dinámicas)",           gama: "Cíclica / Dinámica",             componentes: "BGQ/KGQ, ZWF26 (ocasional), KMV432" },
      { nombre: "Siam / Atma",     lineas: "Líneas Cíclicas HSI",                       gama: "Cíclica Tradicional",            componentes: "BGQ/KGQ" },
    ],
  },
  {
    id: "aire", nombre: "Aire acondicionado", icon: "wind",
    desc: "Splits frío/calor y bombas de calor",
    marcaFlow: true, tipo: "todos",
    intro: "Componentes Sanhua de los splits frío/calor. Como dependen del modelo exacto, te llevamos a elegir tu marca y serie para darte la pieza part-to-part.",
    repuestos: [],
  },
  {
    id: "electricos", nombre: "Eléctricos", icon: "bolt",
    desc: "Bobinas y actuadores",
    intro: "Los componentes eléctricos que la placa de control usa para accionar válvulas y leer temperaturas. Se reemplazan sin tocar el circuito de gas.",
    repuestos: [
      { componente: "Transformador 24 Vdc — TM01 (15 W)", categoria: "solenoid",
        codigoSanhua: "SH-TM01", gases: [],
        aplicacion: "Fuente de alimentación 24 Vdc para el controlador de válvula de expansión electrónica (SEC612 y compatibles). Entrada universal 85–264 VAC. Potencia 15.2 W, corriente de salida 0.63 A. Para instalaciones con una VEE pequeña o media.",
        ubicacion: "Montado en el tablero de la unidad condensadora o rack, cerca del controlador SEC612.",
        iso: "Transformador TM01 · tablero de la unidad" },
      { componente: "Transformador 24 Vdc — TM02 (36 W)", categoria: "solenoid",
        codigoSanhua: "SH-TM02", gases: [],
        aplicacion: "Fuente de alimentación 24 Vdc de mayor capacidad (36 W · 1.5 A). Para instalaciones con múltiples módulos o VEE grandes (LPF30 en adelante). Misma entrada universal 85–264 VAC.",
        ubicacion: "Montado en el tablero de la unidad condensadora o rack, cerca del controlador SEC612.",
        iso: "Transformador TM02 · tablero de la unidad" },
      { componente: "Controlador de recalentamiento SEC612", categoria: "valve", tipoLabel: "Válvula electrónica",
        codigoSanhua: "SEC612-R4", gases: [],
        aplicacion: "Controlador electrónico de recalentamiento para válvulas de expansión electrónica (VEE serie LPF y DPF). Lee el transductor de presión (P-SENS) y la sonda NTC (T-SENS) y comanda el motor paso a paso de la válvula. Display LED, alimentación 24 Vdc (transformador TM01/TM02). Es el cerebro del Kit SEK — también se vende suelto como repuesto.",
        ubicacion: "Montado en el tablero del rack o de la unidad condensadora, sobre riel DIN.",
        iso: "SEC612 · tablero del rack" },
      { componente: "SuperCap Module SP01 — respaldo 24 Vdc", categoria: "solenoid",
        codigoSanhua: "SH-SP01", gases: [],
        aplicacion: "Módulo supercapacitor que mantiene la válvula de expansión electrónica en posición segura (o la cierra) ante un corte de tensión. Imprescindible en instalaciones críticas: cámaras frigoríficas, góndolas y racks con VEE LPF. Entrada/salida 24 Vdc. Se conecta en paralelo con el transformador TM01/TM02 antes del controlador SEC612.",
        ubicacion: "En paralelo con la salida del transformador TM01/TM02, en el tablero junto al controlador SEC612.",
        iso: "SP01 · tablero junto al SEC612" },
      { componente: "Transductor de presión YCQB — salida 0.5–3.5 V", categoria: "pressure",
        codigoSanhua: "YCQB02L12-1 · YCQB02H01 · YCQB03H05 · YCQB05H01 · (ver rango por gas)", gases: ["R32","R410A","R404","R134a","CO2"],
        aplicacion: "Transductor de presión con salida de tensión 0.5–3.5 V directamente compatible con los controladores Sanhua (SEC612, SEC61X). Alimentación 5 Vdc. Precisión ±0.8 % FS. Protección IP66/IP67. Disponible con conexión Flare 7/16\" o soldada ¼\", y cable Packard o XHP. El modelo recomendado para R32/R410A es YCQB02L con rango 0–20 bar.",
        ubicacion: "En la línea de aspiración o descarga según el punto de medición. Conectar directo al controlador SEC612 sin amplificador.",
        iso: "YCQB · línea de aspiración o descarga" },
      { componente: "Transductor de presión YCQC — salida 4–20 mA", categoria: "pressure",
        codigoSanhua: "YCQC02L18 · YCQC02L24 · YCQC03L05 · YCQC03L11 · (ver rango por gas)", gases: ["R32","R410A","R404","R134a","CO2"],
        aplicacion: "Transductor de presión con salida de corriente 4–20 mA. Alimentación 10–30 Vdc. Precisión ±0.8 % FS. Protección IP65/IP66. Conector Packard estándar (el mismo que usa el Kit SEK). Adecuado para instalaciones con cableado largo o donde la señal de tensión puede degradarse. YCQC02L18 es el modelo incluido en los Kit SEK para refrigeración.",
        ubicacion: "En la línea de aspiración. El cable Packard se conecta directo al controlador SEC612 o compatible.",
        iso: "YCQC · línea de aspiración" },
      { componente: "Cables Packard IP67 para YCQB / YCQC", categoria: "pressure",
        codigoSanhua: "YCQB02-013251 (2 m) · YCQB02-013252 (5 m) · YCQB02-013253 (9 m) — 3 hilos XHP", gases: [],
        aplicacion: "Cables de extensión IP67 para transductores YCQB y YCQC con conector Packard. Permiten alejar el transductor del tablero sin perder estanqueidad. Compatible con ambas series YCQB y YCQC.",
        ubicacion: "Entre el transductor instalado en la línea y el controlador en el tablero.",
        iso: "Cable Packard YCQB02 · extensión para transductor" },
      { componente: "Bobinas para válvulas / solenoide", categoria: "coil",
        codigoSanhua: "24 V · 220 V · Inverter (Kelvinator) · 4.5 / 3.5 W", gases: [],
        aplicacion: "Actuador magnético de la válvula inversora o solenoide. Se cambia ante una falla eléctrica sin desoldar caños.",
        ubicacion: "Acoplada por fuera del cuerpo de bronce de la válvula, fijada con un tornillo, en la unidad exterior.",
        iso: "Bobina · acoplada al cuerpo de la válvula" },
      { componente: "Sensores / termistores NTC", categoria: "sensor",
        codigoSanhua: "Serie NTC · ambiente y tubería · varias longitudes", gases: [],
        aplicacion: "Resistencias que cambian su valor con la temperatura. La placa los lee para decidir si acelerar o detener el compresor.",
        ubicacion: "El de ambiente va detrás de los filtros de la unidad interior; otros metálicos van pegados a las tuberías, adentro y afuera.",
        iso: "Sensor NTC · detrás de filtros y en tuberías" },
    ],
  },
  {
    id: "comercial", nombre: "Refrigeración comercial", icon: "snowflake",
    desc: "Exhibidoras, góndolas y vitrinas",
    intro: "Línea comercial Sanhua para exhibidoras de supermercado, góndolas y vitrinas — los mismos componentes que importan distribuidores como Good Cold para el mercado argentino.",
    repuestos: [
      { componente: "Válvula de expansión termostática (TXV)", categoria: "valve",
        codigoSanhua: "Serie RFGD03E (2.5 a 9.0) · RFKH03E-4.8", gases: ["R404", "R507", "R134a"],
        aplicacion: "Regula la inyección exacta de líquido refrigerante hacia el evaporador para generar el frío en exhibidoras, góndolas y chillers.",
        ubicacion: "En la línea de líquido, a la entrada del evaporador; el bulbo se fija a la línea de aspiración.",
        iso: "Válvula expansión termostática · entrada del evaporador" },
      { componente: "Orificios / toberas intercambiables", categoria: "valve", tipoLabel: "Orificio / tobera",
        codigoSanhua: "RFKH-023-00 a RFKH-023-06", gases: [],
        aplicacion: "Componente interno de la TXV. Se elige el número de orificio (00 a 06) para ajustar el caudal según la capacidad del equipo.",
        ubicacion: "Dentro del cuerpo de la válvula de expansión termostática.",
        iso: "Tobera RFKH-023 · dentro de la válvula" },
      { componente: "Visor de líquido (sight glass)", categoria: "service", tipoLabel: "Visor de líquido",
        codigoSanhua: "SYJ10 / 12 / 16 / 19 / 22 H51 (10–22 mm)", gases: [],
        aplicacion: "Permite ver el estado del refrigerante: si burbujea falta carga, y el indicador de color avisa si hay humedad en el sistema.",
        ubicacion: "Soldado o roscado en la línea de líquido, después del filtro secador.",
        iso: "Visor SYJ · línea de líquido" },
      { componente: "Núcleo de filtro recambiable", categoria: "filter", tipoLabel: "Núcleo recambiable",
        codigoSanhua: "HTG-A80-010001", gases: [],
        aplicacion: "Recambio interno para carcasas de filtro atornilladas. Se reemplaza el núcleo sin cambiar toda la carcasa.",
        ubicacion: "Dentro de la carcasa de filtro atornillada, en la línea de líquido.",
        iso: "Núcleo HTG-A80 · carcasa atornillada" },
      { componente: "VEE — Kit SEK (válvula de expansión electrónica)", categoria: "valve", tipoLabel: "VEE / Kit SEK",
        codigoSanhua: "SEK08-01 · SEK10-01 · SEK14-01 · SEK18-01 · SEK24-01 — LPF + SEC612", gases: ["R404", "R449", "R452", "R134a"],
        aplicacion: "Modernización de exhibidoras y góndolas: reemplaza la TXV por control electrónico de recalentamiento. Kit completo con VEE LPF, controlador SEC612, transductor YCQC02L18 y sonda NTC. Mejora eficiencia y reduce temperatura de conservación más estable.",
        kitContenido: ["VEE serie LPF (válvula de expansión)", "Controlador SEC612", "Transductor de presión YCQC02L18 c/cable Packard", "Sonda NTC de temperatura"],
        kitAccesorios: [{componente:"Sonda NTC adicional (repuesto)",codigoSanhua:"NTC-TM01 / NTC-TM02",categoria:"sensor"},{componente:"Filtro deshidratador (DTG-E)",codigoSanhua:"SH-DTG-E05020",categoria:"filter"},{componente:"Transformador 24 Vdc — TM01 (15 W)",codigoSanhua:"SH-TM01",categoria:"solenoid"},{componente:"Transformador 24 Vdc — TM02 (36 W)",codigoSanhua:"SH-TM02",categoria:"solenoid"},{componente:"SuperCap Module SP01",codigoSanhua:"SH-SP01",categoria:"solenoid"}],
        ubicacion: "La VEE se suelda a la entrada del evaporador de cada módulo exhibidor; el controlador va montado en el tablero del rack.",
        iso: "Kit SEK · exhibidora o góndola" },
    ],
  },
  {
    id: "camaras", nombre: "Cámaras frigoríficas", icon: "box",
    desc: "Cuartos fríos y túneles",
    intro: "Componentes Sanhua para cámaras de frío y cuartos de congelado: control del líquido por pump-down, expansión y monitoreo de la carga. Línea importada por Good Cold.",
    repuestos: [
      { componente: "Válvula solenoide (control de líquido)", categoria: "solenoid",
        codigoSanhua: "Serie MDF-A03 (6–22 mm) · MDF-B03 (25–40 mm)", gases: ["R404", "R507", "R22"],
        aplicacion: "Corta el paso de líquido refrigerante según el termostato de la cámara (sistema pump-down), protegiendo el compresor en cada arranque.",
        ubicacion: "En la línea de líquido, antes de la válvula de expansión que alimenta el evaporador de la cámara.",
        iso: "Solenoide MDF · línea de líquido de la cámara" },
      { componente: "Válvula de expansión termostática (TXV)", categoria: "valve",
        codigoSanhua: "Serie RFGD03E (2.5 a 9.0) · R404 / R507", gases: ["R404", "R507"],
        aplicacion: "Inyecta el caudal justo de refrigerante al evaporador de la cámara para mantener la temperatura de conservación o congelado.",
        ubicacion: "A la entrada del evaporador dentro de la cámara; el bulbo se fija a la línea de aspiración.",
        iso: "TXV RFGD03E · evaporador de la cámara" },
      { componente: "Visor de líquido (sight glass)", categoria: "service", tipoLabel: "Visor de líquido",
        codigoSanhua: "SYJ10 / 12 / 16 / 19 / 22 H51", gases: [],
        aplicacion: "Controla la carga y la humedad del sistema. Imprescindible en cámaras para detectar falta de gas antes de que falle la conservación.",
        ubicacion: "En la línea de líquido, después del filtro secador y antes de la solenoide.",
        iso: "Visor SYJ · línea de líquido" },
      { componente: "Filtro deshidratador (drier)", categoria: "filter",
        codigoSanhua: "Serie DTG-E (03024 a 30050) · soldar", gases: ["R404", "R507"],
        aplicacion: "Retiene humedad y partículas del circuito. Tamaño según la capacidad de la cámara y el caudal de la línea de líquido.",
        ubicacion: "Soldado en la línea de líquido, a la salida del recibidor / condensador.",
        iso: "Filtro DTG-E · línea de líquido" },
      { componente: "VEE — Kit SEK (válvula de expansión electrónica)", categoria: "valve", tipoLabel: "VEE / Kit SEK",
        codigoSanhua: "SEK10-01 · SEK14-01 · SEK18-01 · SEK24-01 · SEK30-01 · SEK32-01 — LPF series + SEC612", gases: ["R404", "R449", "R452", "R507"],
        aplicacion: "Kit llave en mano que reemplaza la TXV por control electrónico de recalentamiento. Incluye VEE serie LPF (muy bajo leakage <1 ml/min), controlador SEC612, transductor de presión YCQC02L18 con cable Packard y sonda NTC. Control más preciso = mayor eficiencia y protección del compresor.",
        kitContenido: ["VEE serie LPF (válvula de expansión)", "Controlador SEC612", "Transductor de presión YCQC02L18 c/cable Packard", "Sonda NTC de temperatura"],
        kitAccesorios: [{componente:"Sonda NTC adicional (repuesto)",codigoSanhua:"NTC-TM01 / NTC-TM02",categoria:"sensor"},{componente:"Filtro deshidratador (DTG-E)",codigoSanhua:"SH-DTG-E05020",categoria:"filter"},{componente:"Transformador 24 Vdc — TM01 (15 W)",codigoSanhua:"SH-TM01",categoria:"solenoid"},{componente:"Transformador 24 Vdc — TM02 (36 W)",codigoSanhua:"SH-TM02",categoria:"solenoid"},{componente:"SuperCap Module SP01",codigoSanhua:"SH-SP01",categoria:"solenoid"}],
        ubicacion: "La VEE (LPF) se suelda a la entrada del evaporador de la cámara; el controlador SEC612 se monta en el tablero; la sonda NTC se fija a la línea de aspiración.",
        iso: "Kit SEK · evaporador de la cámara" },
      { componente: "VEE serie LPF (válvula sola)", categoria: "valve", tipoLabel: "Válvula electrónica",
        codigoSanhua: "LPF08 · LPF10 · LPF14 · LPF18 · LPF24 · LPF30 · LPF32 · LPF45 · LPF52 · LPF62", gases: ["R404", "R449", "R452", "R507", "R134a"],
        aplicacion: "Válvula de expansión electrónica de muy bajo leakage. Se selecciona por capacidad del evaporador en kW y refrigerante. Requiere controlador externo (SEC612 u otro compatible).",
        ubicacion: "Soldada a la entrada del evaporador dentro de la cámara.",
        iso: "VEE LPF · evaporador de la cámara" },
    ],
  },
  {
    id: "mochilas", nombre: "Mochilas / Condensadoras", icon: "unit",
    desc: "Unidades condensadoras compactas",
    intro: "Repuestos para equipos mochila y unidades condensadoras: las llaves, reguladoras de presión y filtros que van a la salida de la condensadora. Línea comercial importada por Good Cold.",
    repuestos: [
      { componente: "Llave de servicio (válvula de bola)", categoria: "service",
        codigoSanhua: "Serie SBV(M)-JA5 a JA21 · SBV04-319T", gases: [],
        aplicacion: "Punto de corte y de carga a la salida de la condensadora. Permite aislar el equipo y conectar manómetros sin perder gas.",
        ubicacion: "A la salida de la unidad condensadora (mochila), en las líneas de líquido y aspiración.",
        iso: "Llave SBV · salida de la condensadora" },
      { componente: "Válvula reguladora de presión", categoria: "pressure",
        codigoSanhua: "XTF15 / 22 / 28 / 35 H01 · LTF16H01", gases: ["R404", "R507"],
        aplicacion: "Mantiene estable la presión de evaporación o de cárter, evitando que el sistema baje de la presión de trabajo y proteger el compresor.",
        ubicacion: "Intercalada en la línea de aspiración, dentro o a la salida de la unidad condensadora.",
        iso: "Reguladora XTF/LTF · línea de aspiración" },
      { componente: "Bobina para válvula solenoide", categoria: "coil",
        codigoSanhua: "MQ-A0622G-000001 (para serie MDF)", gases: [],
        aplicacion: "Electroimán que acciona la válvula solenoide del control de líquido. Se reemplaza ante una falla eléctrica sin tocar el circuito de gas.",
        ubicacion: "Acoplada por fuera del cuerpo de la válvula solenoide MDF, fijada con tuerca.",
        iso: "Bobina MQ · sobre la solenoide MDF" },
      { componente: "Filtro deshidratador (drier)", categoria: "filter",
        codigoSanhua: "Serie DTG-E · HTG-A48 (070 a 170)", gases: ["R404", "R507"],
        aplicacion: "Protege el compresor reteniendo humedad y suciedad. Las series HTG-A48 son de mayor capacidad para condensadoras grandes.",
        ubicacion: "Soldado en la línea de líquido a la salida de la condensadora.",
        iso: "Filtro DTG / HTG · salida de la condensadora" },
      { componente: "VEE serie LPF — Kit SEK (expansión electrónica)", categoria: "valve", tipoLabel: "VEE / Kit SEK",
        codigoSanhua: "SEK14-01 · SEK18-01 · SEK24-01 · SEK30-01 · SEK32-01 · SEK45-01 — LPF + SEC612", gases: ["R404", "R449", "R452", "R507"],
        aplicacion: "Válvula de expansión electrónica para condensadoras de alta eficiencia. Reemplaza la TXV para control más preciso del recalentamiento con variación de carga. Kit SEK incluye VEE LPF, controlador SEC612, transductor YCQC02L18 y sonda NTC.",
        kitContenido: ["VEE serie LPF (válvula de expansión)", "Controlador SEC612", "Transductor de presión YCQC02L18 c/cable Packard", "Sonda NTC de temperatura"],
        kitAccesorios: [{componente:"Sonda NTC adicional (repuesto)",codigoSanhua:"NTC-TM01 / NTC-TM02",categoria:"sensor"},{componente:"Filtro deshidratador (DTG-E)",codigoSanhua:"SH-DTG-E05020",categoria:"filter"}],
        ubicacion: "En la línea de líquido a la salida de la condensadora, antes de la entrada al evaporador.",
        iso: "VEE LPF · línea de líquido condensadora" },
    ],
  },
  {
    id: "industria", nombre: "Industria / Grandes superficies", icon: "factory",
    desc: "Hipermercados y frigoríficos",
    intro: "Para cañerías largas de hipermercados y frigoríficos, donde hay que aislar y monitorear sectores del circuito sin perder la carga de gas del local.",
    repuestos: [
      { componente: "Llave esférica (válvula de bola)", categoria: "service",
        codigoSanhua: 'Conexiones soldables · 7/8" o 1.3/8" con acceso', gases: [],
        aplicacion: "Permite cerrar y aislar un sector roto para repararlo sin liberar a la atmósfera toda la carga de gas del local.",
        ubicacion: "Intercalada en las líneas principales de gas, en sala de máquinas y troncales de la instalación.",
        iso: "Llave esférica · troncal de la instalación" },
      { componente: "Visor de líquido", categoria: "service", tipoLabel: "Visor de líquido",
        codigoSanhua: "Serie SYJ · con indicador de humedad", gases: [],
        aplicacion: "Permite ver el estado del refrigerante: si pasa burbujeando falta carga, y el indicador avisa si hay humedad en el sistema.",
        ubicacion: "Soldado o roscado en la línea de líquido, después del filtro secador.",
        iso: "Visor de líquido · línea de líquido" },
    ],
  },
  {
    id: "mantenimiento", nombre: "Mantenimiento general", icon: "filter",
    desc: "Filtros secadores",
    intro: "Lo que se cambia en todo service: filtros y llaves de carga para dejar el circuito limpio y seco después de una intervención.",
    repuestos: [
      { componente: "Filtros secadores moleculares", categoria: "filter",
        codigoSanhua: "Rosca (flare) o para soldar · Bidireccionales (STGB)", gases: [],
        aplicacion: "Absorben humedad en todo circuito abierto para reparación. Los bidireccionales se usan en aires frío/calor por el doble sentido del gas.",
        ubicacion: "Soldado o roscado en la línea de líquido, dentro de la unidad exterior.",
        iso: "Filtro secador · línea de líquido" },
      { componente: "Llave de servicio / carga", categoria: "service", tipoLabel: "Llave de servicio",
        codigoSanhua: "Serie SSV · acceso 1/4\" para manómetros", gases: [],
        aplicacion: "Punto de acceso para conectar manómetros y bomba de vacío, medir presiones y cargar gas sin pérdidas.",
        ubicacion: "En el lateral de la unidad exterior, donde se enroscan las tuercas de los caños de cobre.",
        iso: "Llave de servicio · lateral de la unidad exterior" },
    ],
  },
  {
    id: "criticas", nombre: "Reparaciones críticas", icon: "shield",
    desc: "Compresor quemado",
    intro: "Cuando el compresor se funde, el aceite quemado deja ácido en todo el circuito. Estos filtros lo neutralizan y protegen el compresor nuevo.",
    repuestos: [
      { componente: "Filtro antiácido (motor quemado)", categoria: "filter",
        codigoSanhua: "Antiácido (DTGH)", gases: [],
        aplicacion: "Limpia el ácido que deja el aceite quemado tras un compresor fundido o en corto, evitando que dañe el compresor de reemplazo.",
        ubicacion: "Soldado en la línea de aspiración, antes de la entrada al compresor nuevo.",
        iso: "Filtro antiácido · línea de aspiración" },
      { componente: "Núcleo / cartucho cerámico", categoria: "filter", tipoLabel: "Núcleo / cartucho",
        codigoSanhua: "Cartucho cerámico (SH48)", gases: [],
        aplicacion: "Recambio interno para carcasas industriales atornilladas. Se reemplaza el núcleo sin cambiar todo el filtro.",
        ubicacion: "Dentro de la carcasa de filtro atornillada, en la línea de líquido o aspiración.",
        iso: "Núcleo cerámico · carcasa de filtro atornillada" },
    ],
  },
];

Object.assign(window, { APLICACIONES });
