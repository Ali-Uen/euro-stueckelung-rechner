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
  denominate(totalInCents: number): Promise<Breakdown>;
}

// Verwendet die lokale TypeScript-Implementierung des Greedy-Algorithmus.
@Injectable({ providedIn: 'root' })
export class LocalDenominationService implements DenominationStrategy {
  async denominate(totalInCents: number): Promise<Breakdown> {
    return computeBreakdown(totalInCents);
  }
}

// Backend-Aufruf.
@Injectable({ providedIn: 'root' })
export class RemoteDenominationService implements DenominationStrategy {
  private readonly http = inject(HttpClient);

  async denominate(totalInCents: number): Promise<Breakdown> {
    const baseUrl = environment.apiBaseUrl.replace(/\/$/, '');
    const apiResult = await firstValueFrom(
      this.http.post<ApiBreakdown>(`${baseUrl}/api/denominate`, { totalInCents })
    );

    return {
      totalInCents: apiResult.totalInCents,
      items: apiResult.items.map(({ denominationInCents, count }) => ({
        denomination: denominationInCents as Breakdown['items'][number]['denomination'],
        count,
      })),
    };
  }
}

interface ApiBreakdown {
  totalInCents: number;
  items: Array<{ denominationInCents: number; count: number }>;
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

  readonly currentMode = computed(() => this.mode());
  readonly breakdown = computed(() => this.currentBreakdown());
  readonly diff = computed(() => {
    const current = this.currentBreakdown(); // Diff nur sinnvoll, wenn ein aktuelles Ergebnis existiert.
    if (!current) {
      return [];
    }
    return computeDiff(this.previousBreakdown(), current);
  });
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
  }

  async denominate(totalInCents: number): Promise<DenominationResult> {
    this.processing.set(true);
    this.lastError.set(null);

    try {
      const strategy = this.resolveStrategy();
      const result = await strategy.denominate(totalInCents);
      this.previousBreakdown.set(this.currentBreakdown());
      this.currentBreakdown.set(result);
      return {
        breakdown: result,
        diff: this.diff(),
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