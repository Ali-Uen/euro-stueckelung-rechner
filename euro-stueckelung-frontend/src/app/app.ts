import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { CalculationMode, DenominationService } from './core/denomination.service';
import { BreakdownItem, DiffItem, formatCentsToEuro, parseAmountToCents } from './core/money';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(DenominationService);

  protected readonly form = this.fb.nonNullable.group({
    amount: ['', [Validators.required]],
  });

  protected readonly currentMode = this.service.currentMode;
  protected readonly isProcessing = this.service.isProcessing;
  protected readonly breakdown = this.service.breakdown;
  protected readonly diff = this.service.diff;
  protected readonly error = this.service.error;

  protected readonly inputError = signal<string | null>(null);

  protected readonly formatEuro = formatCentsToEuro;

  protected changeMode(mode: CalculationMode) {
    this.service.setMode(mode);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.inputError.set('Bitte einen Betrag eingeben.');
      return;
    }

    const amount = this.form.getRawValue().amount.trim();
    try {
      const cents = parseAmountToCents(amount);
      this.inputError.set(null);
      await this.service.denominate(cents);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
      this.inputError.set(message);
    }
  }

  protected reset(): void {
    this.form.reset();
    this.service.reset();
    this.inputError.set(null);
  }

  protected trackByDenomination(_: number, item: BreakdownItem | DiffItem): number {
    return item.denomination;
  }
}