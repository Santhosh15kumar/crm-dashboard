import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { SummaryCards } from '../../components/summary-cards/summary-cards';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DatePipe, SummaryCards],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  readonly pageTitle = 'Dashboard';
  private readonly dashboardService = inject(DashboardService);
  protected readonly metrics = computed(() => this.dashboardService.getMetrics());
  protected readonly today = new Date();
}
