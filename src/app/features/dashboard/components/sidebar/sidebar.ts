import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @ViewChild('navigation') private navigation?: ElementRef<HTMLElement>;

  @Input() mobileOpen = false;
  @Output() navigationSelected = new EventEmitter<void>();

  protected readonly navigationGroups = [
    {
      label: 'Workspace',
      items: [
        { label: 'Dashboard', icon: 'grid', path: '/', exact: true },
        { label: 'Customers', icon: 'users', path: '/customers', exact: false },
      ],
    },
    {
      label: 'Manage',
      items: [
        { label: 'Reports', icon: 'chart', path: '/reports', exact: false },
        { label: 'Settings', icon: 'settings', path: '/settings', exact: false },
      ],
    },
  ];

  focusFirstLink(): void {
    this.navigation?.nativeElement.querySelector<HTMLElement>('a')?.focus();
  }

  protected trapFocus(event: KeyboardEvent): void {
    if (!this.mobileOpen || event.key !== 'Tab') return;
    const sidebar = this.navigation?.nativeElement.closest('aside');
    if (!sidebar) return;

    const focusable = Array.from(sidebar.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
