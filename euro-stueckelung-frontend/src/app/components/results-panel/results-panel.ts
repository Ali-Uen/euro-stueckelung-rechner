import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Breakdown, DiffItem } from '../../core/money';
import { BreakdownTable } from '../results/breakdown-table/breakdown-table';
import { DiffTable } from '../results/diff-table/diff-table';

@Component({
  selector: 'app-results-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, BreakdownTable, DiffTable],
  templateUrl: './results-panel.html',
  styleUrl: './results-panel.scss',
})
export class ResultsPanel {
  @Input() breakdown: Breakdown | null = null;
  @Input() diff: DiffItem[] = [];
  @Input({ required: true }) formatEuro!: (value: number) => string;

  get hasResults(): boolean {
    return !!this.breakdown || this.diff.length > 0;
  }
}
