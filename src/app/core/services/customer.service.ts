import { Injectable, signal } from '@angular/core';
import { Customer, CustomerFormData } from '../models/customer.model';

const MOCK_CUSTOMERS: readonly Customer[] = [
  {
    id: 'cus-1001',
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    company: 'Untitled UI',
    status: 'active',
    createdAt: '2026-10-18T09:24:00Z',
    followUpDueAt: '2026-11-18T12:00:00Z',
  },
  {
    id: 'cus-1002',
    name: 'Phoenix Baker',
    email: 'phoenix@linear.app',
    company: 'Linear',
    status: 'active',
    createdAt: '2026-09-30T11:05:00Z',
    followUpDueAt: '2026-11-12T12:00:00Z',
  },
  {
    id: 'cus-1003',
    name: 'Lana Steiner',
    email: 'lana@figma.com',
    company: 'Figma',
    status: 'lead',
    createdAt: '2026-11-05T08:12:00Z',
    followUpDueAt: '2026-11-15T10:00:00Z',
  },
  {
    id: 'cus-1004',
    name: 'Demi Wilkinson',
    email: 'demi@webflow.com',
    company: 'Webflow',
    status: 'active',
    createdAt: '2026-08-22T13:40:00Z',
    followUpDueAt: '2026-11-21T10:00:00Z',
  },
  {
    id: 'cus-1005',
    name: 'Candice Wu',
    email: 'candice@notion.so',
    company: 'Notion',
    status: 'inactive',
    createdAt: '2026-07-14T15:25:00Z',
    followUpDueAt: '2026-11-01T12:00:00Z',
  },
  {
    id: 'cus-1006',
    name: 'Natali Craig',
    email: 'natali@stripe.com',
    company: 'Stripe',
    status: 'active',
    createdAt: '2026-06-09T10:15:00Z',
    followUpDueAt: '2026-11-17T12:00:00Z',
  },
  {
    id: 'cus-1007',
    name: 'Drew Cano',
    email: 'drew@loom.com',
    company: 'Loom',
    status: 'lead',
    createdAt: '2026-11-02T09:50:00Z',
    followUpDueAt: '2026-11-16T12:00:00Z',
  },
  {
    id: 'cus-1008',
    name: 'Orlando Diggs',
    email: 'orlando@intercom.io',
    company: 'Intercom',
    status: 'active',
    createdAt: '2026-05-27T12:35:00Z',
    followUpDueAt: '2026-11-14T12:00:00Z',
  },
  {
    id: 'cus-1009',
    name: 'Andi Lane',
    email: 'andi@asana.com',
    company: 'Asana',
    status: 'inactive',
    createdAt: '2026-04-11T08:45:00Z',
    followUpDueAt: null,
  },
  {
    id: 'cus-1010',
    name: 'Kate Morrison',
    email: 'kate@vercel.com',
    company: 'Vercel',
    status: 'active',
    createdAt: '2026-03-19T14:00:00Z',
    followUpDueAt: '2026-11-30T12:00:00Z',
  },
  {
    id: 'cus-1011',
    name: 'Alec Whitten',
    email: 'alec@dropbox.com',
    company: 'Dropbox',
    status: 'lead',
    createdAt: '2026-10-29T16:20:00Z',
    followUpDueAt: '2026-11-13T12:00:00Z',
  },
  {
    id: 'cus-1012',
    name: 'Sofia Davis',
    email: 'sofia@brex.com',
    company: 'Brex',
    status: 'active',
    createdAt: '2026-02-03T10:30:00Z',
    followUpDueAt: '2026-11-16T16:00:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly records = signal<readonly Customer[]>(MOCK_CUSTOMERS);
  /** In-memory only. Changes are lost when the application is reloaded. */
  readonly customers = this.records.asReadonly();
  private nextId = MOCK_CUSTOMERS.length + 1;

  getAll(): readonly Customer[] {
    return this.customers();
  }

  getById(id: Customer['id']): Customer | undefined {
    return this.customers().find((customer) => customer.id === id);
  }

  create(data: CustomerFormData): Customer {
    const customer: Customer = {
      id: `cus-${Date.now()}-${this.nextId++}`,
      ...data,
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company.trim(),
      createdAt: new Date().toISOString(),
      followUpDueAt: null,
    };

    this.records.update((customers) => [...customers, customer]);
    return customer;
  }

  update(id: Customer['id'], data: CustomerFormData): Customer | undefined {
    const current = this.getById(id);
    if (!current) return undefined;

    const updated: Customer = {
      ...current,
      ...data,
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company.trim(),
    };

    this.records.update((customers) => customers.map((customer) => customer.id === id ? updated : customer));
    return updated;
  }

  delete(id: Customer['id']): boolean {
    const customers = this.customers();
    if (!customers.some((customer) => customer.id === id)) return false;

    this.records.set(customers.filter((customer) => customer.id !== id));
    return true;
  }
}
