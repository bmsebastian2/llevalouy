// TODO: Sebastián confirma barrios y horario de corte

export type Barrio = {
  name: string;
  /** Si hay envío en el día a ese barrio */
  sameDay: boolean;
  /** Hora de Montevideo (0–23) hasta la que se puede pedir para que llegue hoy */
  cutoffHour: number;
};

export const BARRIOS: Barrio[] = [
  { name: "Pocitos", sameDay: true, cutoffHour: 14 },
  { name: "Cordón", sameDay: true, cutoffHour: 14 },
  { name: "Centro", sameDay: true, cutoffHour: 14 },
  { name: "Malvín", sameDay: false, cutoffHour: 14 },
  { name: "Buceo", sameDay: true, cutoffHour: 14 },
  { name: "Punta Carretas", sameDay: true, cutoffHour: 14 },
  { name: "Parque Rodó", sameDay: true, cutoffHour: 14 },
  { name: "Prado", sameDay: false, cutoffHour: 14 },
  { name: "La Blanqueada", sameDay: true, cutoffHour: 14 },
  { name: "Carrasco", sameDay: false, cutoffHour: 14 },
  { name: "Tres Cruces", sameDay: true, cutoffHour: 14 },
];

/** Días en que se reparte (0 = domingo … 6 = sábado) */
export const DELIVERY_DAYS = [1, 2, 3, 4, 5, 6];

/** Barrios de Montevideo que no están en la lista */
export const OTHER_BARRIO_TIME = "24 a 48 h";
/** Fuera de Montevideo */
export const INTERIOR_TIME = "24 a 72 h";

export type BarrioChoice =
  | { kind: "barrio"; name: string }
  | { kind: "otro"; name: string }
  | { kind: "interior" };

export type DeliveryAnswer = {
  /** La respuesta corta y grande: "Hoy.", "Mañana.", "El lunes." */
  headline: string;
  /** La respuesta en una frase */
  sentence: string;
  /** Llega en el día: se destaca */
  today: boolean;
};

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** Día de la semana y hora en Montevideo, sin importar la zona horaria del celular */
function montevideoNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Montevideo",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    parts.find((p) => p.type === "weekday")?.value ?? "",
  );
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  return { weekday, hour };
}

/** Próximo día de reparto después de hoy, como texto: "mañana" o "el lunes" */
function nextDeliveryDay(weekday: number) {
  for (let offset = 1; offset <= 7; offset++) {
    const day = (weekday + offset) % 7;
    if (DELIVERY_DAYS.includes(day)) return offset === 1 ? "mañana" : `el ${WEEKDAYS[day]}`;
  }
  return "mañana";
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function findBarrio(name: string): Barrio | undefined {
  return BARRIOS.find((b) => b.name === name);
}

export function deliveryAnswer(choice: BarrioChoice, now = new Date()): DeliveryAnswer {
  if (choice.kind === "interior") {
    return {
      headline: `${INTERIOR_TIME}.`,
      sentence: `Fuera de Montevideo te llega en ${INTERIOR_TIME}. Te confirmamos por WhatsApp.`,
      today: false,
    };
  }

  const barrio = choice.kind === "barrio" ? findBarrio(choice.name) : undefined;
  if (!barrio) {
    return {
      headline: `${OTHER_BARRIO_TIME}.`,
      sentence: `A ${choice.name} te llega en ${OTHER_BARRIO_TIME}. Te confirmamos por WhatsApp.`,
      today: false,
    };
  }

  const { weekday, hour } = montevideoNow(now);
  const next = nextDeliveryDay(weekday);

  if (barrio.sameDay && DELIVERY_DAYS.includes(weekday) && hour < barrio.cutoffHour) {
    return {
      headline: "Hoy.",
      sentence: `Pedí antes de las ${barrio.cutoffHour}:00 y te llega hoy a ${barrio.name}.`,
      today: true,
    };
  }
  if (barrio.sameDay) {
    return { headline: `${capitalize(next)}.`, sentence: `Pedí ahora y te llega ${next} a ${barrio.name}.`, today: false };
  }
  return { headline: `${capitalize(next)}.`, sentence: `A ${barrio.name} te llega ${next}.`, today: false };
}

/* Barrio elegido: se guarda en el navegador y lo reusan el home y el formulario de pedido */

const STORAGE_KEY = "llevalo:barrio";
/** Aviso en la misma pestaña cuando cambia el barrio */
export const BARRIO_EVENT = "llevalo:barrio";

export function readBarrio(): BarrioChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BarrioChoice;
    if (parsed.kind === "interior") return parsed;
    if ((parsed.kind === "barrio" || parsed.kind === "otro") && typeof parsed.name === "string" && parsed.name.trim()) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveBarrio(choice: BarrioChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Sin almacenamiento (modo privado): la respuesta igual se muestra
  }
  window.dispatchEvent(new Event(BARRIO_EVENT));
}
