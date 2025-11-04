import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './app-toolbar.html',
  styleUrl: './app-toolbar.scss',
})
export class AppToolbar {
  @Input() darkMode = false;
  @Output() darkModeToggle = new EventEmitter<boolean>();

  onToggle({ checked }: MatSlideToggleChange): void {
    this.darkModeToggle.emit(checked);
  }
}
