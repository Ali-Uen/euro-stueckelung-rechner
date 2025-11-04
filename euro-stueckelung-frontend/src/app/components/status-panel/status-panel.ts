import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-status-panel',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatFormFieldModule],
  templateUrl: './status-panel.html',
  styleUrl: './status-panel.scss',
})
export class StatusPanel {
  @Input() isProcessing = false;
  @Input() inputError: string | null = null;
  @Input() error: string | null = null;
}
