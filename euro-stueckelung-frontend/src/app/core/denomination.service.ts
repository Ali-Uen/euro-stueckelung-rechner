import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Breakdown,
  DiffItem,
  computeBreakdown,
  computeDiff,
} from './money';

export type CalculationMode = 'frontend' | 'backend';

// Strategy-Interface, damit Frontend- und Backend-Berechnung austauschbar sind.
export interface DenominationStrategy {
  denominate(totalInCents: number, previousBreakdown?: Breakdown['items']): Promise<
  {breakdown: Breakdown
  diff?: DiffItem[];
  }>;
}

// Verwendet die lokale TypeScript-Implementierung des Greedy-Algorithmus.
@Injectable({ providedIn: 'root' })
export class LocalDenominationService implements DenominationStrategy {
  async denominate(totalInCents: number, previousBreakdown?: Breakdown['items']): Promise<{
    breakdown: Breakdown;
    diff?: DiffItem[];
  }> {
    const breakdown = computeBreakdown(totalInCents);
    let diff: DiffItem[] | undefined;
    if (previousBreakdown) {
      const previousTotal = previousBreakdown.reduce((sum, item) => sum + item.denomination * item.count, 0);
      const previous: Breakdown = { totalInCents: previousTotal, items: previousBreakdown };
      diff = computeDiff(previous, breakdown);
    }
    return { breakdown, diff };
  }
}

// Backend-Aufruf.
@Injectable({ providedIn: 'root' })
export class RemoteDenominationService implements DenominationStrategy {
  private readonly http = inject(HttpClient);
  async denominate(totalInCents: number, previousBreakdown?: Breakdown['items']): Promise<{
    breakdown: Breakdown;
    diff?: DiffItem[];
  }> {
    const baseUrl = environment.apiBaseUrl.replace(/\/$/, '');
    const requestBody: any = { totalInCents };
    if (previousBreakdown) {
      requestBody.previousBreakdown = previousBreakdown.map(item => ({
        denominationInCents: item.denomination,
        count: item.count,
      }));
    }

    const apiResult = await firstValueFrom(
      this.http.post<ApiBreakdown>(`${baseUrl}/api/denominate`, requestBody));
    const breakdown = {
      totalInCents: apiResult.totalInCents,
      items: apiResult.items.map(({ denominationInCents, count }) => ({
        denomination: denominationInCents as Breakdown['items'][number]['denomination'],
        count,
      })),
    };
    const diff = apiResult.diff?.map(({ denominationInCents, delta }) => ({
      denomination: denominationInCents as DiffItem['denomination'],
      delta,
    }));
    return { breakdown, diff };
  }
}

interface ApiBreakdown {
  totalInCents: number;
  items: Array<{ denominationInCents: number; count: number }>;
  diff?: Array<{ denominationInCents: number; delta: number }>;
}

// Rückgabewert, den der Service nach jeder Berechnung liefert.
export interface DenominationResult {
  breakdown: Breakdown;
  diff: DiffItem[];
}

// Zentraler Angular-Service: verwaltet Modus, Ergebnisse, Fehler und delegiert die Berechnung.
@Injectable({ providedIn: 'root' })
export class DenominationService {
  private readonly mode = signal<CalculationMode>('frontend');
  private readonly currentBreakdown = signal<Breakdown | null>(null);
  private readonly previousBreakdown = signal<Breakdown | null>(null);
  private readonly lastError = signal<string | null>(null);
  private readonly processing = signal(false);
  private readonly currentDiff = signal<DiffItem[]>([]);
  
  readonly currentMode = computed(() => this.mode());
  readonly breakdown = computed(() => this.currentBreakdown());
  readonly diff = computed(() => this.currentDiff());
  readonly error = computed(() => this.lastError());
  readonly isProcessing = computed(() => this.processing());

  constructor(
    private readonly local: LocalDenominationService,
    private readonly remote: RemoteDenominationService,
  ) {}

  // Nutzer wählt per UI zwischen Frontend- und Backend-Berechnung.
  setMode(mode: CalculationMode) {
    this.mode.set(mode);
  }

  // Setzt den gespeicherten Zustand zurück (z. B. bei Reset-Button).
  reset() {
    this.currentBreakdown.set(null);
    this.previousBreakdown.set(null);
    this.lastError.set(null);
    this.currentDiff.set([]);
  }

  async denominate(totalInCents: number): Promise<DenominationResult> {
    this.processing.set(true);
    this.lastError.set(null);
    try {
      const oldCurrent = this.currentBreakdown();
      const strategy = this.resolveStrategy();
      const result = await strategy.denominate(totalInCents, oldCurrent?.items);
      this.previousBreakdown.set(oldCurrent);
      this.currentBreakdown.set(result.breakdown);
      const diff = result.diff ?? [];
      this.currentDiff.set(diff);
      return {
        breakdown: result.breakdown,
        diff,
      };
    } catch (error) {
      const message = this.resolveErrorMessage(error);
      this.lastError.set(message);
      throw error;
    } finally {
      this.processing.set(false);
    }
  }

  private resolveStrategy(): DenominationStrategy {
    if (this.mode() === 'frontend') {
      return this.local;
    }

    return this.remote;
  }

  private resolveErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.status === 0) {
      return 'Backend ist momentan nicht erreichbar.';
    }
    return `Serverfehler (${error.status})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unerwarteter Fehler';
  }
}