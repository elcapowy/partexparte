// ─────────────────────────────────────────────────────────────
// ai-diagnostico.jsx — Asistente técnico IA (diagnóstico por síntomas)
// Usa window.claude.complete — claude-haiku-4-5
// ─────────────────────────────────────────────────────────────

const AI_SYSTEM_PROMPT = `Sos un identificador de repuestos SANHUA. Tu única función es: dado un síntoma, decir qué kit SANHUA se necesita.

⛔ NUNCA HAGAS ESTO:
- Dar precios, costos, presupuestos ni estimaciones económicas
- Recomendar si conviene reparar o comprar nuevo
- Opinar sobre marcas, técnicos, servicios oficiales o garantías
- Comparar opciones o dar consejos generales de mantenimiento
- Usar Markdown (**, ##, *, -, listas con guiones o números)
- Hacer más de una pregunta por turno
- Responder con más de 2 oraciones

✅ SOLO ESTO:
- Hacer UNA pregunta para identificar el síntoma exacto
- Cuando lo identifiques, nombrar el kit SANHUA y poné al final: |||KITS:["id"]|||
- Si no hay kit para ese caso: "Para eso consultanos por WhatsApp, que te asesoramos según el equipo."

KITS DISPONIBLES:
service-split — al abrir el circuito de gas en splits
valvula-inversora — equipo no cambia de modo / no enfría
vee-split — falla de expansión en split inverter
no-frost — heladera no enfría / acumula hielo
sek-comercial — modernización cámara o exhibidora comercial
post-quemado — compresor fundido, aceite ácido

EJEMPLO CORRECTO (2 oraciones máximo):
"¿El equipo es solo frío o frío/calor?"

OTRO EJEMPLO CORRECTO (con kit):
"Para eso necesitás el Kit Válvula Inversora — válvula 4 vías, bobina y filtro. |||KITS:["valvula-inversora"]|||"`;

const AI_STARTERS = [
  { label: "Split no enfría", msg: "Mi split inverter no enfría bien, sopla pero no baja la temperatura." },
  { label: "No cambia de modo", msg: "El equipo no pasa a modo calor, solo funciona en frío." },
  { label: "Compresor fundido", msg: "Se fundió el compresor, había aceite quemado y olor a quemado." },
  { label: "Heladera acumula hielo", msg: "La heladera no frost acumula mucho hielo y no enfría bien." },
  { label: "Cámara frigorífica", msg: "Quiero modernizar una cámara con expansión electrónica." },
  { label: "Abro el circuito", msg: "Voy a hacer service y abrir el circuito de gas, ¿qué llevo?" },
];

function parsearRespuesta(texto) {
  const match = texto.match(/\|\|\|KITS:\[([^\]]*)\]\|\|\|/);
  if (!match) return { texto: filtrarPrecios(texto.trim()), kitsIds: [] };
  let kitsIds = [];
  try { kitsIds = JSON.parse('[' + match[1] + ']'); } catch(e) {}
  const textoLimpio = filtrarPrecios(texto.replace(/\|\|\|KITS:\[.*?\]\|\|\|/g, '').trim());
  return { texto: textoLimpio, kitsIds };
}

// Elimina párrafos o líneas que mencionen precios/costos o consejos fuera de scope
function filtrarPrecios(texto) {
  const lineas = texto.split('\n');
  const prohibidas = /\$\s*\d|usd|ars|precio|costo|presupuest|mano de obra|tarif|valor aproxim|estimaci[oó]n|garantía|técnico oficial|service oficial|comprar nuevo|reparar o|conviene|eficiencia energética|consumo eléctrico|kw[h]?|amper/i;
  const limpias = lineas.filter(l => !prohibidas.test(l));
  if (limpias.join('').trim().length < 10) {
    return 'Para eso consultanos por WhatsApp, que te asesoramos según el equipo.';
  }
  return limpias.join('\n').trim();
}

// ─────────────────────────────────────────────────────────────
// Motor de diagnóstico LOCAL (sin backend) — se usa cuando window.claude
// no existe (sitio publicado en Vercel/GitHub Pages). Clasifica el síntoma
// por palabras clave y devuelve la respuesta en el mismo formato |||KITS:[]|||
// ─────────────────────────────────────────────────────────────
const _norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const AI_REGLAS = [
  { id: 'post-quemado', re: [/quemad/, /fundi/, /se quemo/, /aceite/, /\bacido\b/, /corto|cortocircuito/, /olor a quemado/],
    txt: 'Con compresor fundido hay que neutralizar el ácido del aceite quemado. Necesitás el Kit Post-quemado — filtro antiácido y núcleo cerámico.' },
  { id: 'no-frost', re: [/heladera/, /no ?frost/, /freezer/, /\bhielo\b/, /escarcha/, /congelador/, /\bdamper\b/, /forzador/, /gondola?la/],
    txt: 'Es un problema típico de No Frost. Necesitás el Kit No Frost — forzador, compuerta de aire y filtro deshidratador.' },
  { id: 'sek-comercial', re: [/camara/, /exhibidora/, /gondola/, /vitrina/, /comercial/, /moderniz/, /supermercado/, /chiller/, /expansion electronica/, /\bsek\b/],
    txt: 'Para refrigeración comercial va control electrónico. Necesitás el Kit SEK — VEE, controlador SEC612, transductor y sonda NTC.' },
  { id: 'valvula-inversora', re: [/no cambia de modo/, /no pasa a calor/, /no calienta/, /no hace calor/, /solo frio/, /no invierte/, /4 ?vias/, /cuatro vias/, /reversora/, /modo calor/, /frio.?calor/],
    txt: 'Por lo que describís es la válvula reversora. Necesitás el Kit Válvula Inversora — válvula de 4 vías, bobina y filtro.' },
  { id: 'vee-split', re: [/inverter/, /no baja la temp/, /sopla pero no/, /no enfria bien/, /poca capacidad/, /baja eficiencia/, /tarda en enfriar/, /expansion/, /\bvee\b|\beev\b/, /\bdpf\b/],
    txt: 'Eso apunta a la válvula de expansión del inverter. Necesitás el Kit Válvula de Expansión para split inverter DPF.' },
  { id: 'service-split', re: [/service/, /abrir? el? circuito/, /abro el/, /voy a soldar/, /mantenimiento/, /recarga de gas/, /abrir el gas/, /cambio de gas/],
    txt: 'Si vas a abrir el circuito de gas, llevá el Service básico. Necesitás filtro deshidratador, bobina y sensor.' },
];

function localDiagnostico(history) {
  const userTxt = _norm(history.filter(m => m.role === 'user').map(m => m.texto).join(' '));
  if (!userTxt.trim()) {
    return '¿Qué problema tiene el equipo? Contame los síntomas.';
  }
  // puntuar cada kit por cantidad de coincidencias
  let best = null, bestScore = 0;
  for (const r of AI_REGLAS) {
    const score = r.re.reduce((n, rx) => n + (rx.test(userTxt) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = r; }
  }
  if (best && bestScore > 0) {
    return best.txt + ' |||KITS:["' + best.id + '"]|||';
  }
  // Sin match claro: una pregunta orientadora o WhatsApp
  const turnos = history.filter(m => m.role === 'user').length;
  if (turnos <= 1) {
    return '¿El equipo es un aire acondicionado (split), una heladera o refrigeración comercial (cámara/exhibidora)?';
  }
  return 'Para eso consultanos por WhatsApp, que te asesoramos según el equipo.';
}

// ─── Renderer de texto del asistente ─────────────────────────
// Convierte texto plano + posible Markdown residual en nodos React legibles
function renderAIText(text) {
  if (!text) return null;

  // Limpiar Markdown residual: ##, **, *, guiones de lista
  const clean = text
    .replace(/^#{1,6}\s+/gm, '')          // ## Titulo → Titulo
    .replace(/\*\*([^*]+)\*\*/g, '\u0001BOLD\u0001$1\u0001/BOLD\u0001') // **x** → marcador
    .replace(/\*([^*]+)\*/g, '$1')         // *x* → x
    .trim();

  // Separar por líneas
  const lines = clean.split('\n').filter(l => l.trim() !== '');

  return lines.map((line, i) => {
    const isBullet = /^[-•·]\s+/.test(line);
    const isNum    = /^\d+[.)]\s+/.test(line);
    const content  = line.replace(/^[-•·]\s+/, '').replace(/^\d+[.)]\s+/, '');

    // Renderizar negritas dentro del contenido
    const renderInline = (str) => {
      const parts = str.split('\u0001BOLD\u0001');
      return parts.map((part, j) => {
        if (part.startsWith('/BOLD\u0001')) {
          return null; // marcador de cierre, ignorar
        }
        // par impar = bold
        if (j % 2 === 1) return <strong key={j} style={{color:'var(--ink)', fontWeight:700}}>{part.replace('\u0001/BOLD\u0001','')}</strong>;
        return <React.Fragment key={j}>{part.replace('\u0001/BOLD\u0001','')}</React.Fragment>;
      });
    };

    if (isBullet || isNum) {
      return (
        <div key={i} className="ai-text-bullet">
          <span className="ai-text-bullet-dot">{isNum ? line.match(/^\d+/)[0] + '.' : '·'}</span>
          <span>{renderInline(content)}</span>
        </div>
      );
    }

    return (
      <p key={i} className="ai-text-para" style={{margin: i > 0 ? '8px 0 0' : '0'}}>
        {renderInline(content)}
      </p>
    );
  });
}

// ─── Mini KitCard dentro del chat ────────────────────────────
function AISuggestionCard({ kit, onCotizar }) {
  const c = KIT_COLORS[kit.colorKey] || KIT_COLORS.brand;
  const KIcon = (ICONS && ICONS[kit.icon]) || IconWrench;
  return (
    <div className="ai-kit-sug">
      <div className="ai-kit-sug-bar" style={{ background: c.dot }}></div>
      <div className="ai-kit-sug-body">
        <div className="ai-kit-sug-hd">
          <span className="ai-kit-sug-ico" style={{ color: c.dot }}><KIcon size={14} /></span>
          <span className="ai-kit-sug-nombre">{kit.nombre}</span>
          <span className="ai-kit-sug-sub">· {kit.subtitulo}</span>
        </div>
        <div className="ai-kit-sug-comps">
          {kit.componentes.map((comp, j) => (
            <span key={j} className="ai-kit-sug-comp">{comp.componente}</span>
          ))}
        </div>
        <button
          className="ai-kit-sug-cta"
          style={{ background: c.dot }}
          onClick={() => onCotizar(kit)}
        >
          <IconClipboard size={13} /> Cotizar este kit
        </button>
      </div>
    </div>
  );
}

// ─── Pantalla principal del asistente IA (step 30) ───────────
function AIScreen({ onBack, onCotizarKit }) {
  const [messages, setMessages] = React.useState([{
    role: 'assistant',
    texto: '¿Qué problema tiene el equipo? Describime los síntomas y te digo exactamente qué componentes SANHUA necesitás.',
    kitsIds: [],
  }]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesRef = React.useRef(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  React.useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const sendMessage = async (texto) => {
    if (!texto.trim() || loading) return;
    const userMsg = { role: 'user', texto: texto.trim(), kitsIds: [] };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      let response;
      if (window.claude && typeof window.claude.complete === 'function') {
        const history = nextMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.texto,
        }));
        response = await window.claude.complete({
          system: AI_SYSTEM_PROMPT,
          messages: history,
        });
      } else {
        // Sitio publicado sin backend de IA → motor de reglas local
        response = localDiagnostico(nextMessages);
      }
      const parsed = parsearRespuesta(response);
      setMessages(prev => [...prev, {
        role: 'assistant',
        texto: parsed.texto,
        kitsIds: parsed.kitsIds,
      }]);
    } catch(e) {
      // Si la API falló, intentar con el motor local antes de rendirse
      try {
        const parsed = parsearRespuesta(localDiagnostico(nextMessages));
        setMessages(prev => [...prev, {
          role: 'assistant',
          texto: parsed.texto,
          kitsIds: parsed.kitsIds,
        }]);
      } catch(_) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          texto: 'No pude procesar el mensaje. Contactanos por WhatsApp y te asesoramos según el equipo.',
          kitsIds: [],
        }]);
      }
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isFirstTurn = messages.length === 1;

  return (
    <section className="fade screen ai-screen">
      <BackBtn onClick={onBack} />

      {/* Header */}
      <div className="ai-hd">
        <div className="ai-badge-row">
          <span className="pill"><span className="pill-dot" />Asistente técnico</span>
          <span className="ai-ia-badge">IA</span>
          <span className="ai-model-tag">claude haiku</span>
        </div>
        <h2 className="screen-title" style={{ marginTop: '10px' }}>
          Describí el problema,<br />
          <span className="accent">la IA te dice qué llevar.</span>
        </h2>
        <p className="screen-sub">
          El asistente conoce todos los kits y componentes SANHUA para HVAC/R. Te hace las preguntas correctas y sugiere el kit exacto.
        </p>
      </div>

      {/* Chat container */}
      <div className="ai-chat-shell">

        {/* Starters */}
        {isFirstTurn && (
          <div className="ai-starters">
            {AI_STARTERS.map((s, i) => (
              <button key={i} className="ai-starter-btn" onClick={() => sendMessage(s.msg)}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="ai-messages" ref={messagesRef}>
          {messages.map((m, i) => (
            <div key={i} className={"ai-msg ai-msg--" + m.role}>
              {m.role === 'assistant' && (
                <div className="ai-avatar">
                  <span className="ai-avatar-inner">✦</span>
                </div>
              )}
                <div className="ai-bubble-wrap">
                <div className={"ai-bubble ai-bubble--" + m.role}>
                  <div className="ai-bubble-text">{renderAIText(m.texto)}</div>
                </div>
                {/* Kit suggestions */}
                {m.kitsIds && m.kitsIds.length > 0 && (
                  <div className="ai-suggestions">
                    <div className="ai-sug-label">Kit{m.kitsIds.length > 1 ? 's' : ''} recomendado{m.kitsIds.length > 1 ? 's' : ''}</div>
                    {m.kitsIds.map(kid => {
                      const kit = (typeof KITS !== 'undefined' ? KITS : []).find(k => k.id === kid);
                      if (!kit) return null;
                      return <AISuggestionCard key={kid} kit={kit} onCotizar={onCotizarKit} />;
                    })}
                  </div>
                )}
                {/* WhatsApp CTA cuando la IA no puede resolver con los kits disponibles */}
                {m.role === 'assistant' && m.kitsIds && m.kitsIds.length === 0 &&
                  /whatsapp|consult/i.test(m.texto) && (
                  <WppButton
                    text="Consultar por WhatsApp"
                    className="btn btn-wpp btn-sm ai-wpp-cta"
                    msg={"Hola PARTE X PARTE, necesito asesoramiento técnico sobre un repuesto."}
                  />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-msg ai-msg--assistant">
              <div className="ai-avatar"><span className="ai-avatar-inner">✦</span></div>
              <div className="ai-bubble ai-bubble--assistant ai-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="ai-input-row">
          <textarea
            className="ai-input"
            rows={2}
            placeholder="Describí el problema del equipo…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            className="ai-send-btn"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Enviar"
          >
            <IconArrowRight size={18} />
          </button>
        </div>
      </div>

      <p className="hint" style={{ marginTop: '16px' }}>
        <IconShield size={15} />
        <span>Las sugerencias son orientativas. Confirmá siempre los códigos con la ficha técnica del equipo.</span>
      </p>
    </section>
  );
}

Object.assign(window, { AIScreen });
