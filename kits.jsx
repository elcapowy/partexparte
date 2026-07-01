// ─────────────────────────────────────────────────────────────
// kits.jsx — Kits frecuentes
// Agrupaciones de componentes por escenario de reparación
// ─────────────────────────────────────────────────────────────

const KITS = [
  {
    id: "service-split",
    nombre: "Service básico",
    subtitulo: "Split frío/calor",
    escenario: "Al abrir el circuito de gas",
    aplicacion: "Split inverter y on/off · frío/calor",
    colorKey: "brand",
    icon: "wrench",
    componentes: [
      { componente: "Filtro deshidratador bidireccional",
        categoria: "filter",
        codigoSanhua: "STGB · R32 / R410A / R22 · flare o soldar" },
      { componente: "Bobina para válvula inversora",
        categoria: "coil",
        codigoSanhua: "SHF-4-10S · AC 220V / 24V · 4.5 / 3.5 W" },
      { componente: "Sensor NTC de tubería",
        categoria: "sensor",
        codigoSanhua: "Serie NTC · sonda metálica abrazadera" },
    ],
    tip: "Regla de oro: cada vez que el circuito queda abierto, el filtro se cambia. La bobina es la pieza más barata del trío — incluirla evita volver al equipo si falla eléctricamente.",
  },
  {
    id: "valvula-inversora",
    nombre: "Válvula inversora completa",
    subtitulo: "Split frío/calor",
    escenario: "Equipo no cambia de modo o no enfría",
    aplicacion: "Todos los splits frío/calor",
    colorKey: "orange",
    icon: "gauge",
    componentes: [
      { componente: "Válvula 4 vías inversora",
        categoria: "reversing",
        codigoSanhua: "SHF(L)3H12U-52 / SHF(L)3H22U-52 · según BTU" },
      { componente: "Bobina para válvula inversora",
        categoria: "coil",
        codigoSanhua: "SHF-4-10S · AC 220V · 4.5 / 3.5 W" },
      { componente: "Filtro deshidratador bidireccional",
        categoria: "filter",
        codigoSanhua: "STGB · R32 / R410A / R22" },
    ],
    tip: "Válvula y bobina suelen fallar juntas. Al abrir el circuito para soldar la válvula nueva, el filtro se cambia sin excusas — es la pieza más barata de la reparación.",
  },
  {
    id: "vee-split",
    nombre: "Válvula de expansión",
    subtitulo: "Split inverter DPF",
    escenario: "Baja eficiencia o falla de expansión",
    aplicacion: "Splits inverter con VEE electrónica DPF",
    colorKey: "green",
    icon: "wind",
    componentes: [
      { componente: "VEE electrónica DPF",
        categoria: "valve",
        codigoSanhua: "DPF(T01) / DPF(TS1) / DPF(S03) · según modelo" },
      { componente: "Bobina VEE",
        categoria: "coil",
        codigoSanhua: "DPF-58001 (PQ-M10) / DPF-58002 (PQ-M03)" },
      { componente: "Sensor NTC de tubería",
        categoria: "sensor",
        codigoSanhua: "Serie NTC · sonda abrazadera" },
      { componente: "Filtro deshidratador bidireccional",
        categoria: "filter",
        codigoSanhua: "STGB · R32 / R410A / R22" },
    ],
    tip: "La VEE siempre va con su bobina específica de 5 hilos (PQ-M10 para T01/TS1, PQ-M03 para S03). El sensor NTC valida que la placa lea bien el recalentamiento después del cambio.",
  },
  {
    id: "no-frost",
    nombre: "No Frost",
    subtitulo: "Heladera",
    escenario: "No enfría, acumula hielo o ventilador ruidoso",
    aplicacion: "Heladeras No Frost · Samsung, LG, Whirlpool y más",
    colorKey: "cyan",
    icon: "snowflake",
    componentes: [
      { componente: "Forzador DC Brushless",
        categoria: "sensor",
        codigoSanhua: "ZWF26" },
      { componente: "Damper motorizado (compuerta de aire)",
        categoria: "solenoid",
        codigoSanhua: "BDFM Single / BDFM Double (doble compartimento)" },
      { componente: "Filtro deshidratador de cobre",
        categoria: "filter",
        codigoSanhua: "BGQ / KGQ series" },
    ],
    tip: "Forzador y damper trabajan en el mismo circuito de aire. Si uno falló por sobrecarga, el otro suele estar forzado — cambiarlos juntos evita llamadas de garantía en la misma visita.",
  },
  {
    id: "sek-comercial",
    nombre: "Kit SEK",
    subtitulo: "Refrigeración comercial",
    escenario: "Modernización exhibidora, góndola o cámara",
    aplicacion: "Refrigeración comercial · R404A / R449A / R452A",
    colorKey: "accent",
    icon: "factory",
    componentes: [
      { componente: "Kit SEK completo (VEE + SEC612 + transductor + NTC)",
        categoria: "valve",
        codigoSanhua: "SEK08/10/14/18/24-01 · LPF + SEC612 + YCQC + NTC" },
      { componente: "Transformador 24 Vdc — TM01",
        categoria: "solenoid",
        codigoSanhua: "SH-TM01 · 15 W · 85–264 VAC" },
      { componente: "Filtro deshidratador DTG-E",
        categoria: "filter",
        codigoSanhua: "DTG-E · soldar · R404 / R449 / R452" },
    ],
    tip: "El Kit SEK requiere 24 Vdc externos — el TM01 es el transformador recomendado. Al instalar la VEE se abre el circuito: el filtro es obligatorio para proteger el compresor.",
    esKit: true,
  },
  {
    id: "post-quemado",
    nombre: "Post-quemado",
    subtitulo: "Compresor fundido",
    escenario: "Aceite quemado · ácido en el circuito",
    aplicacion: "Cualquier sistema con compresor fundido",
    colorKey: "red",
    icon: "shield",
    componentes: [
      { componente: "Filtro antiácido (motor quemado)",
        categoria: "filter",
        codigoSanhua: "DTGH antiácido · va en aspiración" },
      { componente: "Filtro deshidratador (línea de líquido)",
        categoria: "filter",
        codigoSanhua: "DTG-E / STGB según aplicación" },
      { componente: "Visor de líquido",
        categoria: "service",
        codigoSanhua: "SYJ10 / 12 / 16 / 19 / 22 H51" },
    ],
    tip: "El ácido del aceite quemado destruye el compresor nuevo en pocas horas. El antiácido va en aspiración (antes del compresor nuevo). El visor confirma que no quedan burbujas ni humedad.",
  },
];

// ─────────────────────────────────────────────────────────────
// Paleta de colores por kit
// ─────────────────────────────────────────────────────────────
const KIT_COLORS = {
  brand:  { bg: "var(--brand-soft)",                                                  text: "var(--brand)",   dot: "var(--brand)"   },
  orange: { bg: "color-mix(in srgb, var(--orange) 10%, var(--surface))",              text: "var(--orange)",  dot: "var(--orange)"  },
  green:  { bg: "color-mix(in srgb, #1a7a4a 10%, var(--surface))",                   text: "#1a7a4a",        dot: "#1a7a4a"        },
  cyan:   { bg: "color-mix(in srgb, #0e9090 10%, var(--surface))",                   text: "#0e9090",        dot: "#0e9090"        },
  accent: { bg: "color-mix(in srgb, var(--accent) 10%, var(--surface))",              text: "var(--accent)",  dot: "var(--accent)"  },
  red:    { bg: "color-mix(in srgb, #c0392b 10%, var(--surface))",                   text: "#c0392b",        dot: "#c0392b"        },
};

// ─────────────────────────────────────────────────────────────
// KitCard
// ─────────────────────────────────────────────────────────────
function KitCard({ kit, onCotizar }) {
  const [tipOpen, setTipOpen] = React.useState(false);
  const c = KIT_COLORS[kit.colorKey] || KIT_COLORS.brand;
  const KIcon = (ICONS && ICONS[kit.icon]) || IconWrench;

  return (
    <div className="kit-card">

      {/* ── Accent bar top ── */}
      <div className="kit-card-accent-bar" style={{ background: c.dot }}></div>

      {/* ── Header ── */}
      <div className="kit-card-hd">
        <div className="kit-card-ico-wrap" style={{ background: `color-mix(in srgb, ${c.dot} 14%, var(--surface))`, color: c.dot }}>
          <KIcon size={18} />
        </div>
        <div className="kit-card-hd-body">
          <span className="kit-card-label">Kit frecuente</span>
          <h3 className="kit-card-nombre">{kit.nombre}</h3>
          <span className="kit-card-sub">{kit.subtitulo}</span>
        </div>
        {kit.esKit && (
          <span className="kit-complete-badge" style={{ background: c.dot }}>Kit completo</span>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="kit-card-divider"></div>

      {/* ── Body ── */}
      <div className="kit-card-body">

        {/* Escenario */}
        <div className="kit-scenario-block">
          <div className="kit-escenario">
            <span className="kit-esc-dot" style={{ background: c.dot }}></span>
            <span className="kit-esc-text">{kit.escenario}</span>
          </div>
          <div className="kit-aplicacion">
            <span className="kit-aplic-label">Para:</span>
            <span className="kit-aplic-val">{kit.aplicacion}</span>
          </div>
        </div>

        {/* Componentes */}
        <div className="kit-comps">
          {kit.componentes.map((comp, i) => (
            <div key={i} className="kit-comp-row">
              <span className="kit-comp-num" style={{ color: c.dot, borderColor: `color-mix(in srgb, ${c.dot} 30%, var(--line))` }}>{i + 1}</span>
              <div className="kit-comp-info">
                <span className="kit-comp-nombre">{comp.componente}</span>
                <span className="kit-comp-chip">
                  <span className="kit-comp-chip-k">Sanhua</span>
                  <span className="kit-comp-chip-v">{comp.codigoSanhua}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Nota técnica desplegable */}
        {kit.tip && (
          <div className="kit-tip-wrap">
            <button
              className="kit-tip-toggle"
              onClick={() => setTipOpen(v => !v)}
              style={{ color: c.dot }}
            >
              <span className="kit-tip-arrow">{tipOpen ? "▲" : "▼"}</span>
              Nota técnica
            </button>
            {tipOpen && (
              <p className="kit-tip-text" style={{ borderLeftColor: c.dot, background: `color-mix(in srgb, ${c.dot} 5%, var(--surface))` }}>
                {kit.tip}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          className="kit-cta-btn"
          style={{
            background: c.dot,
            borderColor: c.dot,
          }}
          onClick={() => onCotizar(kit)}
        >
          <IconClipboard size={14} />
          Cotizar este kit
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KitsSection (step 20)
// ─────────────────────────────────────────────────────────────
function KitsSection({ onCotizar, onBack }) {
  return (
    <section className="fade screen">
      <BackBtn onClick={onBack} />

      <div className="kits-hd">
        <div className="kits-hd-left">
          <div style={{ marginBottom: "10px" }}>
            <span className="pill"><span className="pill-dot" /> Kits frecuentes</span>
          </div>
          <h2 className="screen-title" style={{ marginTop: 0 }}>Armados para las reparaciones más comunes</h2>
          <p className="screen-sub">
            Los componentes que más se piden juntos, agrupados por escenario.
            Cotizás el kit completo en un clic y coordinamos precio y entrega por WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-kits">
        {KITS.map(kit => (
          <KitCard key={kit.id} kit={kit} onCotizar={onCotizar} />
        ))}
      </div>

      <p className="hint" style={{ marginTop: "32px" }}>
        <IconShield size={15} />
        <span>Los kits son orientativos — los códigos exactos dependen del modelo específico. Confirmá siempre con tu ficha técnica o consultanos antes de pedir.</span>
      </p>
    </section>
  );
}

Object.assign(window, { KITS, KIT_COLORS, KitCard, KitsSection });
