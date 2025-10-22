import { computeBreakdown, computeDiff, parseAmountToCents } from './money';

describe('money utils', () => {
  describe('parseAmountToCents', () => {
    it('parses integer amounts', () => {
      // 42 Euro -> 4200 Cent.
      expect(parseAmountToCents('42')).toBe(4200);
    });

    it('parses decimal amounts with comma', () => {
      // Deutsche Schreibweise akzeptieren.
      expect(parseAmountToCents('12,34')).toBe(1234);
    });

    it('parses decimal amounts with dot', () => {
      // Internationale Schreibweise ebenfalls zulassen.
      expect(parseAmountToCents('0.05')).toBe(5);
    });

    it('rejects invalid formats', () => {
      // Kein Tausendertrennzeichen, keine Buchstaben.
      expect(() => parseAmountToCents('1,234')).toThrow();
      expect(() => parseAmountToCents('abc')).toThrow();
    });

    it('rejects negative values', () => {
      // Negative Beträge sollen gar nicht erst verarbeitet werden.
      expect(() => parseAmountToCents('-1')).toThrow();
    });
  });

  describe('computeBreakdown', () => {
    it('creates minimal breakdown for 234,23 €', () => {
      // Erwartete Greedy-Stückelung für Beispiel aus Anforderung.
      const breakdown = computeBreakdown(23423);
      expect(breakdown.items).toEqual([
        { denomination: 20000, count: 1 },
        { denomination: 2000, count: 1 },
        { denomination: 1000, count: 1 },
        { denomination: 200, count: 2 },
        { denomination: 20, count: 1 },
        { denomination: 2, count: 1 },
        { denomination: 1, count: 1 },
      ]);
    });

    it('returns empty items for zero', () => {
      // 0 € -> keine Scheine/Münzen nötig.
      expect(computeBreakdown(0).items).toEqual([]);
    });

    it('throws for negative input', () => {
      // Schutz gegen negative Centwerte.
      expect(() => computeBreakdown(-5)).toThrow();
    });
  });

  describe('computeDiff', () => {
    it('computes differences between two breakdowns', () => {
      // Differenz zwischen altem und neuem Beispielbetrag prüfen.
      const previous = computeBreakdown(4532);
      const current = computeBreakdown(23423);
      expect(computeDiff(previous, current)).toEqual([
        { denomination: 20000, delta: 1 },
        { denomination: 2000, delta: -1 },
        { denomination: 1000, delta: 1 },
        { denomination: 500, delta: -1 },
        { denomination: 200, delta: 2 },
        { denomination: 10, delta: -1 },
        { denomination: 1, delta: 1 },
      ]);
    });

    it('handles missing previous breakdown', () => {
      // Erster Durchlauf: alle Stücke erscheinen als Zuwachs.
      const current = computeBreakdown(200);
      expect(computeDiff(null, current)).toEqual([{ denomination: 200, delta: 1 }]);
    });
  });
});