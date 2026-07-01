// Set de íconos de línea (stroke = currentColor). Estilo limpio y uniforme.
const Icon = ({ d, size = 24, fill = "none", sw = 1.8, children, vb = "0 0 24 24", style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
    {children || (d ? <path d={d} /> : null)}
  </svg>
);

const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Icon>;
const IconArrowRight = (p) => <Icon {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Icon>;
const IconArrowLeft = (p) => <Icon {...p}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="M20 6L9 17l-5-5" /></Icon>;
const IconCheckCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.5 2.5 4.5-5" /></Icon>;
const IconPhone = (p) => <Icon {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A14 14 0 013 6a2 2 0 012-2z" /></Icon>;
const IconMapPin = (p) => <Icon {...p}><path d="M12 21s-6-5.3-6-10a6 6 0 0112 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></Icon>;
const IconTruck = (p) => <Icon {...p}><path d="M3 6h11v9H3z" /><path d="M14 9h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></Icon>;
const IconWrench = (p) => <Icon {...p}><path d="M14.5 6a3.5 3.5 0 00-4.6 4.6L4 16.5 7.5 20l5.9-5.9A3.5 3.5 0 0018 9.5L15.5 12 12 8.5 14.5 6z" /></Icon>;
const IconWind = (p) => <Icon {...p}><path d="M3 8h10a2.5 2.5 0 10-2.5-2.5" /><path d="M3 12h14a2.5 2.5 0 11-2.5 2.5" /><path d="M3 16h7a2 2 0 112 2" /></Icon>;
const IconGauge = (p) => <Icon {...p}><path d="M4 18a8 8 0 1116 0" /><path d="M12 14l4-3" /><circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none" /></Icon>;
const IconFilter = (p) => <Icon {...p}><path d="M4 5h16l-6 7v6l-4 2v-8z" /></Icon>;
const IconSnowflake = (p) => <Icon {...p}><path d="M12 3v18M3.8 7.5l16.4 9M20.2 7.5L3.8 16.5" /><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" /></Icon>;
const IconFactory = (p) => <Icon {...p}><path d="M3 21V10l5 3V10l5 3V8l8 5v8z" /><path d="M3 21h18" /></Icon>;
const IconGlobe = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" /></Icon>;
const IconAward = (p) => <Icon {...p}><circle cx="12" cy="9" r="5" /><path d="M9 13.5L8 21l4-2 4 2-1-7.5" /></Icon>;
const IconShield = (p) => <Icon {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></Icon>;
const IconClipboard = (p) => <Icon {...p}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4h6v3H9z" fill="currentColor" stroke="none" /><path d="M9 11h6M9 15h4" /></Icon>;
const IconWhatsApp = (p) => <Icon {...p}><path d="M4 20l1.4-4A8 8 0 1112 20a8 8 0 01-4-1l-4 1z" /><path d="M9 9.5c0 2.5 3 5.5 5.5 5.5.8 0 1.3-.6 1.3-1.2 0-.3-1.6-1.1-1.9-1.1-.4 0-.7.7-1 .7-.6 0-2.5-1.9-2.5-2.5 0-.3.7-.6.7-1 0-.3-.8-1.9-1.1-1.9-.6 0-1.2.5-1.2 1.3z" fill="currentColor" stroke="none" /></Icon>;
const IconChevron = (p) => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>;
const IconReverse = (p) => <Icon {...p}><path d="M4 9h13l-3-3M20 15H7l3 3" /></Icon>;
const IconBolt = (p) => <Icon {...p}><path d="M13 3L5 13h6l-1 8 8-10h-6z" /></Icon>;
const IconFridge = (p) => <Icon {...p}><rect x="6" y="3" width="12" height="18" rx="2" /><line x1="6" y1="10" x2="18" y2="10" /><line x1="15" y1="6" x2="15" y2="8" /><line x1="15" y1="13" x2="15" y2="17" /></Icon>;
const IconThermo = (p) => <Icon {...p}><path d="M12 4a2 2 0 014 0v9a4 4 0 11-4 0z" fill="none" /><circle cx="14" cy="17" r="1.4" fill="currentColor" stroke="none" /></Icon>;
const IconValve = (p) => <Icon {...p}><circle cx="12" cy="13" r="5" /><path d="M12 8V3M9 3h6" /></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
const IconBox = (p) => <Icon {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 9.5h16" /><circle cx="8" cy="14.5" r="1.2" fill="currentColor" stroke="none" /></Icon>;
const IconUnit = (p) => <Icon {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="8.5" cy="12" r="3" /><path d="M15 9.5v5M15 9.5h3M15 12h3M15 14.5h3" /></Icon>;
const IconX = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>;

// Mapa nombre → componente, para usar desde data.jsx
const ICONS = {
  search: IconSearch, wind: IconWind, gauge: IconGauge, snowflake: IconSnowflake,
  filter: IconFilter, wrench: IconWrench, factory: IconFactory, globe: IconGlobe,
  award: IconAward, shield: IconShield, truck: IconTruck, clipboard: IconClipboard,
  phone: IconPhone, whatsapp: IconWhatsApp, check: IconCheck, bolt: IconBolt, box: IconBox, unit: IconUnit, fridge: IconFridge,
};

// Ícono técnico por categoría de componente
const PART_ICONS = {
  reversing: IconReverse, valve: IconValve, coil: IconBolt, solenoid: IconBolt,
  filter: IconFilter, sensor: IconThermo, service: IconWrench, pressure: IconGauge,
};
const PartIcon = ({ categoria, size = 26 }) => {
  const C = PART_ICONS[categoria] || IconWrench;
  return <C size={size} />;
};

Object.assign(window, {
  Icon, IconSearch, IconArrowRight, IconArrowLeft, IconCheck, IconCheckCircle,
  IconPhone, IconMapPin, IconTruck, IconWrench, IconWind, IconGauge, IconFilter,
  IconSnowflake, IconFactory, IconGlobe, IconAward, IconShield, IconClipboard,
  IconWhatsApp, IconChevron, IconReverse, IconBolt, IconThermo, IconValve, IconPlus, IconX,
  IconBox, IconUnit, IconFridge,
  ICONS, PART_ICONS, PartIcon,
});
