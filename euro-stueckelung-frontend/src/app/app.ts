import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { CalculationMode, DenominationService } from './core/denomination.service';
import { BreakdownItem, DiffItem, formatCentsToEuro, parseAmountToCents } from './core/money';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatButtonModule, MatProgressBarModule, MatListModule, MatIconModule, MatChipsModule, MatTableModule, MatSlideToggleModule],
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

  protected readonly darkMode = signal(false);

  protected toggleDarkMode(): void {
    this.darkMode.set(!this.darkMode());
    document.body.classList.toggle('dark-theme', this.darkMode());
  }

  protected changeMode(mode: CalculationMode) {
    this.service.setMode(mode);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.inputError.set('Bitte einen Betrag eingeben.');
      return;
    }
    console.log('Diff data:', this.diff());
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