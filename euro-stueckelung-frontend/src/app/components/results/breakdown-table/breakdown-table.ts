import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Breakdown } from '../../../core/money';

@Component({
  selector: 'app-breakdown-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './breakdown-table.html',
  styleUrl: './breakdown-table.scss',
})
export class BreakdownTable {
  @Input() breakdown: Breakdown | null = null;
  @Input({ required: true }) formatEuro!: (value: number) => string;

  readonly displayedColumns: string[] = ['denomination', 'count'];

  get items(): Breakdown['items'] {
    return this.breakdown?.items ?? [];
  }
}
