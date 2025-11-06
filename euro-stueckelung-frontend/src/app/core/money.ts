// Werte in Cent, absteigend sortiert
// Euro-Scheine und -Münzen in Cent, absteigend sortiert für Greedy.
export const EURO_DENOMINATIONS = [
  20000, 10000, 5000, 2000, 1000,
  500, 200, 100, 50, 20,
  10, 5, 2, 1,
] as const;

export type EuroDenomination = (typeof EURO_DENOMINATIONS)[number];

export interface BreakdownItem {
  denomination: EuroDenomination;
  count: number;
}

export interface Breakdown {
  items: BreakdownItem[];
  totalInCents: number;
}

export interface DiffItem {
  denomination: EuroDenomination;
  delta: number;
}

const amountPattern = /^\d+(?:[.,]\d{1,2})?$/; // Ganzzahl, optional Dezimalteil mit bis zu zwei Stellen.

// Normalisiert Nutzereingaben wie "123,45" zu einem Cent-Ganzzahlwert.
export function parseAmountToCents(input: string): number {
  const normalized = input.trim();
  if (!normalized || !amountPattern.test(normalized)) {
    throw new Error('Ungültiger Betrag');
  }

  const [eurosPart, centsPart = ''] = normalized.replace(',', '.').split('.');
  const euros = Number.parseInt(eurosPart, 10);
  const cents = Number.parseInt((centsPart + '00').slice(0, 2), 10) || 0;
  const total = euros * 100 + cents;

  if (total < 0) {
    throw new Error('Ungültiger Betrag');
  }

  return total;
}

export function formatCentsToEuro(totalInCents: number, locale = 'de-DE'): string {
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  return formatter.format(totalInCents / 100);
}

// Greedy-Verfahren: immer größtmögliche Denomination zuerst, funktioniert für EUR.
export function computeBreakdown(totalInCents: number): Breakdown {
  if (!Number.isInteger(totalInCents) || totalInCents < 0) {
    throw new Error('Ungültiger Betrag');
  }

  const items: BreakdownItem[] = [];
  let rest = totalInCents;

  for (const denomination of EURO_DENOMINATIONS) {
    if (rest === 0) {
      break;
    }

    const count = Math.floor(rest / denomination);
    if (count > 0) {
      items.push({ denomination, count });
      rest -= count * denomination;
    }
  }

  return { items, totalInCents };
}

// Vergleicht zwei Breakdowns und liefert die Veränderung je Denomination.
export function computeDiff(previous: Breakdown | null, current: Breakdown): DiffItem[] {
  const registry = new Map<EuroDenomination, number>();
  const used = new Set<EuroDenomination>();

  if (previous) {
    for (const item of previous.items) {
      used.add(item.denomination);
      registry.set(item.denomination, (registry.get(item.denomination) ?? 0) - item.count);
    }
  }

  for (const item of current.items) {
    used.add(item.denomination);
    registry.set(item.denomination, (registry.get(item.denomination) ?? 0) + item.count);
  }

  return EURO_DENOMINATIONS
    .map((denomination) => ({
      denomination,
      delta: registry.get(denomination) ?? 0,
    }))
    .filter(({ denomination }) => used.has(denomination));
}