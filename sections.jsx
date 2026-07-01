// ─────────────────────────────────────────────────────────────
// Header · Home · Footer
// ─────────────────────────────────────────────────────────────

// Tabla OEM expandible
const TIPO_META = {
  directo:    { label: "OEM directo",  desc: "Documentado por Sanhua o en listas de partes",          color: "var(--green, #1a7a4a)" },
  global:     { label: "OEM global",   desc: "Relación confirmada a nivel global por Sanhua",          color: "var(--orange, #ef741b)" },
  plataforma: { label: "Plataforma",   desc: "Sanhua heredado del OEM fabricante base",                color: "var(--brand, #1763ad)"  },
};

function OemTable() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="oem">
      <div className="oem-label">Fabricantes que equipan sus productos con componentes SANHUA</div>
      <div className="oem-chips">
        {OEM.map((m) => <span key={m} className="oem-chip">{m}</span>)}
      </div>

      <button className="oem-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "Ocultar detalle ▲" : "Ver relación OEM por marca ▼"}
      </button>

      {open && (
        <div className="oem-table-wrap">
          <table className="oem-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Componentes Sanhua</th>
                <th>Segmento en Argentina</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {OEM_DETALLE.map((r) => (
                <tr key={r.marca}>
                  <td>
                    <span className="oem-row-brand">
                      <span className="oem-av" style={{ background: `hsl(${r.hue} 60% 88%)`, color: `hsl(${r.hue} 50% 28%)` }}>{r.ini}</span>
                      <b>{r.marca}</b>
                    </span>
                  </td>
                  <td className="oem-td-comp">{r.componentes}</td>
                  <td className="oem-td-seg">{r.segmento}</td>
                  <td>
                    <span className="oem-tipo" data-tipo={r.tipo}>{TIPO_META[r.tipo].label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="oem-table-leyenda">
            {Object.entries(TIPO_META).map(([k, v]) => (
              <span key={k} className="oem-ley-item">
                <span className="oem-tipo" data-tipo={k}>{v.label}</span>
                <span className="oem-ley-desc">{v.desc}</span>
              </span>
            ))}
          </div>
          <p className="oem-table-note">
            Las marcas mencionadas son propiedad de sus respectivos dueños. Su referencia es exclusivamente a fines de compatibilidad técnica y no implica afiliación ni respaldo comercial.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Video del hero con control de sonido (muted por defecto para autoplay) ──
function HeroVideo() {
  const ref = React.useRef(null);
  const [muted, setMuted] = React.useState(true);
  const [played, setPlayed] = React.useState(false);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    if (muted) {
      // Primera vez: reiniciar desde el comienzo y reproducir con sonido
      v.muted = false;
      if (!played) { v.currentTime = 0; setPlayed(true); }
      v.play().catch(() => {});
      setMuted(false);
    } else {
      v.muted = true;
      setMuted(true);
    }
  };

  // Cuando termina el video, volver a silencio
  const handleEnded = () => {
    if (ref.current) { ref.current.muted = true; }
    setMuted(true);
    setPlayed(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={ref}
        className="hero-video"
        src={(window.__resources || {}).heroVideo || "assets/sanhua-video.mp4"}
        autoPlay
        muted
        playsInline
        poster={(window.__resources || {}).anuncioPng || "assets/sanhua-anuncio.png"}
        onEnded={handleEnded}
      />
      <button
        onClick={toggleSound}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        style={{
          position: 'absolute', bottom: '12px', right: '12px',
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.18)', borderRadius: '50%',
          width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', fontSize: '17px', lineHeight: 1,
          transition: 'background .2s',
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

const Header = ({ onLogo, cartCount = 0, onCart }) => (
  <React.Fragment>
    <div className="topbar">
      <div className="container topbar-in">
        <IconFactory size={15} />
        <span><b className="tb-strong">SANHUA es el fabricante detrás de tu equipo</b><span className="tb-sep"> · </span><span className="tb-soft">el mismo componente original de fábrica</span></span>
      </div>
    </div>
    <header className="header">
      <div className="container header-in">
        <button className="brand" onClick={onLogo} aria-label="Inicio">
          <span className="brand-mark brand-mark-mono" aria-hidden="true">✕</span>
          <span className="brand-text">
            <span className="brand-name">PARTE <span className="brand-ya">X</span> PARTE</span>
            <span className="brand-tag">Repuestos HVAC/R · Argentina</span>
          </span>
        </button>
        <nav className="header-nav">
          {cartCount > 0 && (
            <button className="cart-chip" onClick={onCart} aria-label="Ver cotización">
              <IconClipboard size={17} /> <span className="cart-chip-n">{cartCount}</span>
            </button>
          )}
          <WppButton text="WhatsApp" className="btn btn-wpp btn-sm" />
        </nav>
      </div>
    </header>
  </React.Fragment>
);

const Home = ({ go, goApp, openApp, goKits, goAI }) => (
  <div className="fade">
    {/* HERO */}
    <section className="hero">
      <div className="hero-copy">
        <img className="hero-logo" src="assets/freshen-logo.png" alt="Freshen Distribuye" />
        <h1 className="hero-h1">El repuesto original,<br /><span className="accent">entregado donde estés.</span></h1>
        <p className="hero-p">
          Encontrá el repuesto original exacto para tu Daikin, Samsung, LG,
          Carrier, Gree, Midea o Hisense — con el código de fábrica. Trabajamos con el
          estándar original: <b>Sanhua</b> y las marcas líderes del mercado. Lo cotizás
          online y coordinamos precio y entrega por WhatsApp.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={go}>
            <IconSearch size={18} /> Buscar por marca
          </button>
          <button className="btn btn-outline btn-lg" onClick={goApp}>
            <IconClipboard size={18} /> Buscar por aplicación
          </button>
          {goKits && (
            <button className="btn btn-ghost btn-sm hero-kits-btn" onClick={goKits}>
              <IconWrench size={14} /> Kits frecuentes
            </button>
          )}
        </div>
        <div className="hero-trust">
          {CERTS.slice(0, 5).map((c) => <span key={c} className="cert">{c}</span>)}
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-video-frame">
          <HeroVideo />
          <span className="hero-video-tag"><span className="pill-dot" /> Componente original de fábrica</span>
        </div>
        <span className="float f1" aria-hidden="true"><IconWrench size={20} /></span>
        <span className="float f3" aria-hidden="true"><IconGauge size={20} /></span>
      </div>
    </section>

    {/* IA — Banner diagnóstico */}
    {goAI && (
      <div className="ai-feature-banner" role="button" tabIndex={0} onClick={goAI} onKeyDown={e => e.key==='Enter' && goAI()}>
        <div className="ai-feature-copy">
          <div className="ai-feature-eyebrow">
            <span className="ai-ia-badge">IA</span>
            <span className="ai-feature-eyebrow-text">Nuevo · Asistente técnico con inteligencia artificial</span>
          </div>
          <h3 className="ai-feature-title">Describí el problema, la IA te dice qué llevar.</h3>
          <p className="ai-feature-desc">Sin buscar por modelo. Contás los síntomas y el asistente identifica el kit SANHUA exacto para esa reparación.</p>
          <span className="btn btn-primary ai-feature-cta">
            ✦ Diagnosticar con IA <IconArrowRight size={16} />
          </span>
        </div>
        <div className="ai-feature-preview" aria-hidden="true">
          <div className="ai-fp-bubble ai-fp-bubble--user">Mi split no pasa a modo calor.</div>
          <div className="ai-fp-bubble ai-fp-bubble--ai">
            <span className="ai-fp-avatar">✦</span>
            Necesitás el <strong>Kit Válvula Inversora completa</strong> — válvula 4 vías + bobina + filtro.
          </div>
          <div className="ai-fp-cta">Cotizar este kit →</div>
        </div>
      </div>
    )}

    {/* ANUNCIO — imagen destacada */}
    <section className="anuncio">
      <div className="anuncio-media">
        <img className="anuncio-slot" src="assets/anuncio-componente.png" alt="Válvula de expansión — estándar original de fábrica" />
        <div className="anuncio-media-scrim" aria-hidden="true"></div>
        <p className="anuncio-overlay">Trabajamos con el estándar original de fábrica: <b>Sanhua</b> y las marcas líderes del mercado.</p>
      </div>
      <div className="anuncio-copy">
        <span className="pill alt"><IconFactory size={14} /> Estándar original de fábrica</span>
        <h2 className="anuncio-h2">El mismo componente que trae tu equipo de fábrica.</h2>
        <p className="anuncio-p">
          Reponé válvulas, filtros, bobinas y sensores con el <b>estándar original</b> —
          Sanhua y las marcas líderes del mercado — y no con un repuesto genérico.
        </p>
        <WppButton text="Consultar disponibilidad" className="btn btn-wpp" />
      </div>
    </section>

    {/* BUSCAR POR APLICACIÓN */}
    <section className="block">
      <h2 className="block-title">Buscar por aplicación</h2>
      <p className="block-sub">¿No tenés el modelo a mano? Elegí dónde se usa el repuesto.</p>
      <div className="grid grid-apps">
        {APLICACIONES.map((a) => {
          const AIcon = ICONS[a.icon] || IconWrench;
          const n = a.repuestos.length;
          return (
            <button key={a.id} className="app-tile" onClick={() => openApp(a)}>
              <span className="app-tile-ico"><AIcon size={22} /></span>
              <span className="app-tile-name">{a.nombre}</span>
              <span className="app-tile-desc">{a.desc}</span>
              <span className="app-tile-meta">
                {a.marcaFlow
                  ? <React.Fragment>Elegí tu marca <IconArrowRight size={14} /></React.Fragment>
                  : <React.Fragment>{n} repuesto{n === 1 ? "" : "s"} <IconArrowRight size={14} /></React.Fragment>}
              </span>
            </button>
          );
        })}
      </div>
    </section>

    {/* CÓMO FUNCIONA */}
    <section className="block">
      <h2 className="block-title">Cómo funciona</h2>
      <div className="grid grid-3">
        {[
          { I: IconSearch, t: "1 · Marca y modelo", d: "Elegí la marca de tu equipo y su serie. Mostramos solo lo compatible." },
          { I: IconClipboard, t: "2 · Componente exacto", d: "Confirmá el código Sanhua correcto, con su equivalencia OEM de fábrica." },
          { I: IconWhatsApp, t: "3 · Cotizá y recibilo", d: "Te pasamos precio y disponibilidad por WhatsApp, y coordinamos la entrega." },
        ].map((c, i) => (
          <div key={i} className="how">
            <span className="how-ico"><c.I size={24} /></span>
            <div className="how-t">{c.t}</div>
            <div className="how-d">{c.d}</div>
          </div>
        ))}
      </div>
    </section>

    {/* SANHUA — EL FABRICANTE */}
    <section className="block band">
      <div className="band-head">
        <span className="pill alt"><IconFactory size={14} /> Componente original de fábrica</span>
        <h2 className="band-title">SANHUA es el fabricante detrás de tu equipo</h2>
        <p className="band-p">
          Fundada en 1984, SANHUA es uno de los principales proveedores OEM de la industria HVAC/R:
          válvulas de expansión, válvulas reversibles de 4 vías, sensores e intercambiadores que vienen
          instalados de fábrica en equipos de las marcas más grandes del mundo. Reponer con SANHUA es
          colocar <b>la misma pieza original</b> que traía tu equipo.
        </p>
      </div>

      <div className="grid grid-4 metrics">
        {SANHUA_FACTS.map((m, i) => (
          <div key={i} className="metric">
            <div className="metric-n">{m.n}</div>
            <div className="metric-t">{m.t}</div>
          </div>
        ))}
      </div>

      <OemTable />

      <div className="band-cta">
        <button className="btn btn-primary btn-lg" onClick={go}>
          Buscá tu repuesto original <IconArrowRight size={18} />
        </button>
      </div>
    </section>
  </div>
);

// ── Exportar solicitudes a XLSX ───────────────────────────────────────────
function exportarXLS(lista) {
  if (!lista.length) return;
  const XLSX = window.XLSX;

  // Hoja 1 — Resumen clientes
  const resumen = lista.map(s => ({
    'Fecha':        s.fecha,
    'Nombre':       s.cliente.nombre,
    'WhatsApp':     s.cliente.tel,
    'Ciudad':       s.cliente.ciudad,
    'Dirección':    s.cliente.direccion || '',
    'Nota':         s.cliente.nota || '',
    'Cant. repuestos': s.carrito.length,
    'Repuestos':    s.carrito.map(c => c.componente).join(' | '),
  }));

  // Hoja 2 — Detalle por ítem
  const detalle = lista.flatMap(s =>
    s.carrito.map(c => ({
      'Fecha':        s.fecha,
      'Cliente':      s.cliente.nombre,
      'WhatsApp':     s.cliente.tel,
      'Ciudad':       s.cliente.ciudad,
      'Componente':   c.componente,
      'Código Sanhua': c.codigoSanhua,
      'Código OEM':   c.codigoOEM || '',
      'Marca equipo': c.marca,
      'Serie':        c.serie || '',
      'Cantidad':     c.cantidad,
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen),  'Solicitudes');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detalle),  'Detalle repuestos');

  const fecha = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, `SANHUA-YA-solicitudes-${fecha}.xlsx`);
}

// ── Panel de solicitudes guardadas ───────────────────────────────────────
function SolicitudesPanel() {
  const [lista, setLista] = React.useState([]);
  const [sel, setSel] = React.useState(null);

  React.useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('sanhua_ya_solicitudes') || '[]');
      setLista(data);
    } catch(e) { setLista([]); }
  }, []);

  const borrar = (id) => {
    const nueva = lista.filter(s => s.id !== id);
    setLista(nueva);
    localStorage.setItem('sanhua_ya_solicitudes', JSON.stringify(nueva));
    if (sel?.id === id) setSel(null);
  };

  if (lista.length === 0) return (
    <div className="sol-empty">
      <span style={{fontSize:'40px'}}>📋</span>
      <p>No hay solicitudes guardadas en este dispositivo todavía.</p>
    </div>
  );

  return (
    <div className="sol-wrap">
      <div className="sol-list">
        <div className="sol-toolbar">
          <span className="sol-total">{lista.length} solicitud{lista.length !== 1 ? 'es' : ''}</span>
          <button className="btn btn-outline btn-sm sol-export" onClick={() => exportarXLS(lista)}>
            ↓ Exportar XLS
          </button>
        </div>
        {lista.map((s) => (
          <button key={s.id} className={"sol-row" + (sel?.id === s.id ? ' sel' : '')} onClick={() => setSel(s)}>
            <div className="sol-row-top">
              <span className="sol-nombre">{s.cliente.nombre}</span>
              <span className="sol-fecha">{s.fecha}</span>
            </div>
            <div className="sol-row-bot">
              <span className="sol-tel">{s.cliente.tel}</span>
              <span className="sol-ciudad">{s.cliente.ciudad}</span>
              <span className="sol-count">{s.carrito.length} rep.</span>
            </div>
          </button>
        ))}
      </div>

      {sel && (
        <div className="sol-detail">
          <div className="sol-detail-head">
            <span className="sol-detail-title">{sel.cliente.nombre}</span>
            <button className="sol-del" onClick={() => borrar(sel.id)} title="Eliminar">🗑</button>
          </div>
          <div className="sol-detail-fields">
            <div className="sol-field"><span>WhatsApp</span><b>{sel.cliente.tel}</b></div>
            <div className="sol-field"><span>Ciudad</span><b>{sel.cliente.ciudad}</b></div>
            {sel.cliente.direccion && <div className="sol-field"><span>Dirección</span><b>{sel.cliente.direccion}</b></div>}
            {sel.cliente.nota && <div className="sol-field"><span>Nota</span><b>{sel.cliente.nota}</b></div>}
            <div className="sol-field"><span>Fecha</span><b>{sel.fecha}</b></div>
          </div>
          <div className="sol-items">
            {sel.carrito.map((c, i) => (
              <div key={i} className="sol-item">
                <span className="sol-item-n">{c.cantidad}×</span>
                <div>
                  <div className="sol-item-nombre">{c.componente}</div>
                  <div className="sol-item-cod">{c.codigoSanhua}</div>
                  <div className="sol-item-eq">{[c.marca, c.serie].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
          <a
            className="btn btn-wpp btn-block"
            href={'https://wa.me/5491134696124?text=' + encodeURIComponent(
              ['Seguimiento solicitud — ' + sel.fecha, '', 'Cliente: ' + sel.cliente.nombre, 'Tel: ' + sel.cliente.tel, 'Ciudad: ' + sel.cliente.ciudad, '',
               ...sel.carrito.map((c,i) => `${i+1}) ${c.componente} · ${c.codigoSanhua}`)].join('\n')
            )}
            target="_blank" rel="noopener noreferrer"
          >
            <IconWhatsApp size={16} /> Contactar por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

const Footer = ({ onAdmin }) => (
  <footer className="footer">
    <div className="container footer-in">
      <div className="footer-brand">
        <span className="brand-mark sm brand-mark-mono" aria-hidden="true">✕</span>
        <span>PARTE <b>X</b> PARTE</span>
      </div>
      <div className="footer-certs">
        {CERTS.map((c) => <span key={c} className="cert">{c}</span>)}
      </div>
      <div className="footer-legal">
        <p>
          <b>Aviso legal:</b> Este sitio fue desarrollado con asistencia de inteligencia artificial con fines demostrativos.
          La información presentada (códigos de producto, compatibilidades, equivalencias y relaciones OEM) se basa en
          fuentes públicas y puede contener inexactitudes o estar desactualizada. <b>Verificá siempre los datos con el
          distribuidor oficial antes de realizar una compra o reparación.</b>
        </p>
        <p>
          Las marcas comerciales mencionadas (Daikin, LG, Samsung, Gree, Carrier, Midea, Hisense, BGH, Philco, y otras)
          son propiedad de sus respectivos dueños. Su mención es exclusivamente a fines de indicar compatibilidad técnica
          y no implica ninguna afiliación, patrocinio ni relación comercial con dichas empresas.
          SANHUA y su logotipo son marcas registradas de Sanhua International Inc.
        </p>
        <p className="footer-ai">✦ Contenido generado con asistencia de IA · Sujeto a cambios sin previo aviso · No constituye asesoramiento técnico profesional</p>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Header, Home, Footer, SolicitudesPanel });
