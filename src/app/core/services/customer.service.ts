import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Customer, CustomerFormData, CustomerStatus } from '../models/customer.model';

export const CUSTOMER_STORAGE_KEY = 'northstar-crm.customers.v1';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function isCustomer(value: unknown): value is Customer {
  if (!isRecord(value)) return false;
  const validStatuses: readonly CustomerStatus[] = ['active', 'lead', 'inactive'];
  const validFollowUpDate = value['followUpDueAt'] === null || isValidDate(value['followUpDueAt']);

  return typeof value['id'] === 'string' && value['id'].trim().length > 0 &&
    typeof value['name'] === 'string' && value['name'].trim().length > 0 &&
    typeof value['email'] === 'string' && value['email'].trim().length > 0 &&
    typeof value['company'] === 'string' && value['company'].trim().length > 0 &&
    validStatuses.includes(value['status'] as CustomerStatus) &&
    isValidDate(value['createdAt']) && validFollowUpDate;
}

function isCustomerArray(value: unknown): value is readonly Customer[] {
  if (!Array.isArray(value) || !value.every(isCustomer)) return false;
  return new Set(value.map((customer) => customer.id)).size === value.length;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly records = signal<readonly Customer[]>(MOCK_CUSTOMERS);
  readonly customers = this.records.asReadonly();
  private readonly warning = signal<string | null>(null);
  readonly persistenceWarning = this.warning.asReadonly();
  private nextId = MOCK_CUSTOMERS.length + 1;
  private initialized = false;

  /** Restores browser data before the routed UI renders; SSR keeps the mock records. */
  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    if (!isPlatformBrowser(this.platformId)) return;
    const storage = this.getStorage();
    if (!storage) {
      this.warning.set('Browser storage is unavailable. Changes may be lost when you reload.');
      return;
    }

    try {
      const stored = storage.getItem(CUSTOMER_STORAGE_KEY);
      if (stored === null) return;
      if (stored.trim().length === 0) {
        this.warning.set('Saved customer data is empty or invalid. Showing sample records.');
        return;
      }

      const parsed: unknown = JSON.parse(stored);
      if (!isCustomerArray(parsed)) {
        this.warning.set('Saved customer data is invalid. Showing sample records.');
        return;
      }

      this.records.set(parsed);
    } catch {
      this.warning.set('Saved customer data could not be read. Showing sample records.');
    }
  }

  getAll(): readonly Customer[] {
    this.initialize();
    return this.customers();
  }

  getById(id: Customer['id']): Customer | undefined {
    this.initialize();
    return this.customers().find((customer) => customer.id === id);
  }

  create(data: CustomerFormData): Customer {
    this.initialize();
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
    this.persist();
    return customer;
  }

  update(id: Customer['id'], data: CustomerFormData): Customer | undefined {
    this.initialize();
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
    this.persist();
    return updated;
  }

  delete(id: Customer['id']): boolean {
    this.initialize();
    const customers = this.customers();
    if (!customers.some((customer) => customer.id === id)) return false;

    this.records.set(customers.filter((customer) => customer.id !== id));
    this.persist();
    return true;
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage;
    } catch {
      return null;
    }
  }

  private persist(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const storage = this.getStorage();
    if (!storage) {
      this.warning.set('Browser storage is unavailable. Changes may be lost when you reload.');
      return;
    }

    try {
      storage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(this.customers()));
      this.warning.set(null);
    } catch {
      this.warning.set('Customer changes are active for this session but could not be saved.');
    }
  }
}
