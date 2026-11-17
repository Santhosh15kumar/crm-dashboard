import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardMetrics } from '../../../../core/models/dashboard-metrics.model';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.scss',
})
export class SummaryCards {
  @Input({ required: true }) metrics!: DashboardMetrics;

}
