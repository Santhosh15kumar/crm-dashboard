import { TestBed } from '@angular/core/testing';
import { Customer } from '../models/customer.model';
import { CUSTOMER_STORAGE_KEY } from './customer.service';
import { CustomerService } from './customer.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let customerService: CustomerService;
  let dashboardService: DashboardService;

  beforeEach(() => {
    window.localStorage.clear();
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

  it('calculates all KPI counts at the supplied date boundaries', () => {
    const customers: Customer[] = [
      makeCustomer('active-new-due', 'active', '2026-10-18T12:00:00.000Z', '2026-11-17T12:00:00.000Z'),
      makeCustomer('active-old-future', 'active', '2026-10-17T12:00:00.000Z', '2026-11-18T12:00:00.000Z'),
      makeCustomer('lead-new-overdue', 'lead', '2026-11-17T12:00:00.000Z', '2026-11-16T12:00:00.000Z'),
      makeCustomer('inactive-future', 'inactive', '2026-11-18T12:00:00.000Z', null),
    ];
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));

    expect(dashboardService.getMetrics(new Date('2026-11-17T12:00:00.000Z'))).toEqual({
      totalCustomers: 4,
      activeCustomers: 2,
      newCustomers: 2,
      pendingFollowUps: 2,
    });
  });

  function makeCustomer(
    id: string,
    status: Customer['status'],
    createdAt: string,
    followUpDueAt: string | null,
  ): Customer {
    return { id, name: id, email: `${id}@example.com`, company: 'Example Co.', status, createdAt, followUpDueAt };
  }
});
