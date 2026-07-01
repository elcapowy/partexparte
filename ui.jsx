// Componentes auxiliares de UI

const Field = ({ label, value, onChange, placeholder, type = "text", error, success, hint, onBlur, inputMode, required }) => (
  <div className="field">
    <label className="field-label">
      {label}
      {required && <span className="field-req"> *</span>}
    </label>
    <div className="field-wrap">
      <input
        className={"field-input" + (error ? " field-input--error" : "") + (success ? " field-input--ok" : "")}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onBlur={onBlur}
      />
      {success && <span className="field-check">✓</span>}
    </div>
    {error   && <span className="field-error">{error}</span>}
    {!error && hint && <span className="field-hint">{hint}</span>}
  </div>
);

const Row = ({ k, v, strong }) => (
  <div className={"sum-row" + (strong ? " strong" : "")}>
    <span className="sum-k">{k}</span>
    <span className="sum-v">{v}</span>
  </div>
);

const BackBtn = ({ onClick }) => (
  <button className="back-btn" onClick={onClick}>
    <IconArrowLeft size={16} /> Volver
  </button>
);

// Indicador de pasos del flujo
const Stepper = ({ step }) => {
  const labels = ["Tipo", "Marca", "Modelo", "Repuesto", "Datos", "Listo"];
  return (
    <div className="stepper" role="list">
      {labels.map((l, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "todo";
        return (
          <div key={l} className={"step " + state} role="listitem">
            <span className="step-dot">{state === "done" ? <IconCheck size={13} /> : n}</span>
            <span className="step-label">{l}</span>
            {i < labels.length - 1 && <span className="step-line" />}
          </div>
        );
      })}
    </div>
  );
};

// Chip de stock / disponibilidad
const StockTag = ({ stock }) => (
  stock
    ? <span className="tag tag-ok"><span className="tag-dot" /> En stock</span>
    : <span className="tag tag-no">A pedido</span>
);

// Botón WhatsApp reutilizable
const WppButton = ({ text = "Consultar por WhatsApp", msg = "", className = "btn btn-wpp" }) => {
  const href = "https://wa.me/5491134696124?text=" + encodeURIComponent(msg || "Hola, quiero consultar por un repuesto SANHUA.");
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      <IconWhatsApp size={18} /> {text}
    </a>
  );
};

Object.assign(window, { Field, Row, BackBtn, Stepper, StockTag, WppButton });
