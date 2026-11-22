import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../features/dashboard/components/header/header';
import { Sidebar } from '../../../features/dashboard/components/sidebar/sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [Header, Sidebar, RouterOutlet],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  @ViewChild(Header) private header?: Header;
  @ViewChild(Sidebar) private sidebar?: Sidebar;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly pageTitle = signal('Dashboard');

  protected toggleMobileMenu(): void {
    const opening = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(opening);
    setTimeout(() => {
      if (opening) this.sidebar?.focusFirstLink();
      else this.header?.focusMenuButton();
    });
  }

  protected closeMobileMenu(restoreFocus = true): void {
    if (!this.mobileMenuOpen()) return;
    this.mobileMenuOpen.set(false);
    if (restoreFocus) setTimeout(() => this.header?.focusMenuButton(), 0);
  }

  protected setActivePage(page: unknown): void {
    if (typeof page !== 'object' || page === null || !('pageTitle' in page)) return;
    const title = (page as { pageTitle: unknown }).pageTitle;
    if (typeof title === 'string') this.pageTitle.set(title);
  }
}
