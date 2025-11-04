import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { CalculationMode } from '../../core/denomination.service';
import { StatusPanel } from '../status-panel/status-panel';

@Component({
  selector: 'app-amount-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    StatusPanel,
  ],
  templateUrl: './amount-form.html',
  styleUrl: './amount-form.scss',
})
export class AmountForm {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) currentMode!: CalculationMode;
  @Input() isProcessing = false;
  @Input() inputError: string | null = null;
  @Input() error: string | null = null;

  @Output() submitForm = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();
  @Output() modeChange = new EventEmitter<CalculationMode>();

  onSubmit(): void {
    this.submitForm.emit();
  }

  onReset(): void {
    this.resetForm.emit();
  }

  onModeChange({ value }: MatRadioChange): void {
    this.modeChange.emit(value as CalculationMode);
  }
}
