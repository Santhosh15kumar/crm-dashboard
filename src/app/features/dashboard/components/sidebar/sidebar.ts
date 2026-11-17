import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
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
}
