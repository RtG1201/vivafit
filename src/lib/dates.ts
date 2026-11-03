/** Utilitários de data no fuso local do aparelho (formato YYYY-MM-DD). */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/** Converte YYYY-MM-DD em Date ao meio-dia local (evita saltos de fuso). */
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12);
}

/** Datas (YYYY-MM-DD) da semana de segunda a domingo que contém `today`. */
export function weekDates(today: Date = new Date()): string[] {
  const dow = (today.getDay() + 6) % 7; // segunda = 0
  const monday = addDays(today, -dow);
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(monday, i)));
}

export const WEEKDAY_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;

const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const WEEKDAYS_LONG = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function monthName(monthIndex: number): string {
  return MONTHS[monthIndex] ?? '';
}

/** Primeira letra maiúscula (só a primeira — preposições continuam minúsculas). */
export function capitalizeFirst(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** "Sexta-feira, 30 de outubro" */
export function formatLongDate(d: Date = new Date()): string {
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

/** "30 out" */
export function formatShortDate(iso: string): string {
  const d = fromISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

export function greetingFor(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Grade de um mês para calendário com semanas começando na segunda.
 * Retorna células `null` para preencher o início/fim da grade.
 */
export function monthGrid(year: number, monthIndex: number): (string | null)[] {
  const first = new Date(year, monthIndex, 1, 12);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leading = (first.getDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toISODate(new Date(year, monthIndex, day, 12)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
