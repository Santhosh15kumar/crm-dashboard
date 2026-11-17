import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() menuOpen = false;
  @Input() pageTitle = 'Dashboard';
  @Output() menuClicked = new EventEmitter<void>();

  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;

  focusMenuButton(): void {
    this.menuButton?.nativeElement.focus();
  }
}
