import { inject, Injectable } from '@angular/core';
import { DashboardMetrics } from '../models/dashboard-metrics.model';
import { CustomerService } from './customer.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly customerService = inject(CustomerService);

  getMetrics(asOf = new Date()): DashboardMetrics {
    const customers = this.customerService.getAll();
    const newCustomerCutoff = new Date(asOf);
    newCustomerCutoff.setDate(newCustomerCutoff.getDate() - 30);

    return {
      totalCustomers: customers.length,
      activeCustomers: customers.filter((customer) => customer.status === 'active').length,
      newCustomers: customers.filter((customer) => {
        const createdAt = new Date(customer.createdAt);
        return createdAt >= newCustomerCutoff && createdAt <= asOf;
      }).length,
      pendingFollowUps: customers.filter((customer) => {
        return customer.followUpDueAt !== null && new Date(customer.followUpDueAt) <= asOf;
      }).length,
    };
  }
}
