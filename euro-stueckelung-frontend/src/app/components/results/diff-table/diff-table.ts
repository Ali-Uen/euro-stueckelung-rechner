import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DiffItem } from '../../../core/money';

@Component({
  selector: 'app-diff-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './diff-table.html',
  styleUrl: './diff-table.scss',
})
export class DiffTable {
  @Input() diff: DiffItem[] = [];
  @Input({ required: true }) formatEuro!: (value: number) => string;

  readonly displayedColumns: string[] = ['denomination', 'delta'];
}
