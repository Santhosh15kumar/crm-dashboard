import { TestBed } from '@angular/core/testing';
import { CustomerService } from './customer.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let customerService: CustomerService;
  let dashboardService: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CustomerService, DashboardService] });
    customerService = TestBed.inject(CustomerService);
    dashboardService = TestBed.inject(DashboardService);
  });

  it('recalculates KPI values as the customer collection changes', () => {
    const before = dashboardService.getMetrics();

    const created = customerService.create({
      name: 'Jamie Example',
      email: 'jamie@example.com',
      company: 'Example Co.',
      status: 'active',
    });

    const after = dashboardService.getMetrics();
    expect(after.totalCustomers).toBe(before.totalCustomers + 1);
    expect(after.activeCustomers).toBe(before.activeCustomers + 1);

    customerService.update(created.id, { ...created, status: 'inactive' });
    expect(dashboardService.getMetrics().activeCustomers).toBe(before.activeCustomers);

    customerService.delete(created.id);
    expect(dashboardService.getMetrics().totalCustomers).toBe(before.totalCustomers);
  });
});
