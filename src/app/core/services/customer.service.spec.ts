import { TestBed } from '@angular/core/testing';
import { CustomerFormData } from '../models/customer.model';
import { CUSTOMER_STORAGE_KEY, CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  const formData: CustomerFormData = {
    name: '  Jamie Example  ',
    email: ' jamie@example.com ',
    company: ' Example Co. ',
    status: 'lead',
  };

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({ providers: [CustomerService] });
    service = TestBed.inject(CustomerService);
  });

  it('uses mock records when LocalStorage has no customer key', () => {
    service.initialize();

    expect(service.getAll()).toHaveLength(12);
    expect(service.persistenceWarning()).toBeNull();
  });

  it('falls back to mock records for empty storage values', () => {
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, '   ');
    service.initialize();

    expect(service.getAll()).toHaveLength(12);
    expect(service.persistenceWarning()).toContain('empty or invalid');
  });

  it('falls back safely for malformed JSON and invalid customer data', () => {
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, '{not-json');
    expect(() => service.initialize()).not.toThrow();
    expect(service.getAll()).toHaveLength(12);
    expect(service.persistenceWarning()).toContain('could not be read');

    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify([{ id: 'incomplete' }]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CustomerService] });
    service = TestBed.inject(CustomerService);
    service.initialize();
    expect(service.getAll()).toHaveLength(12);
    expect(service.persistenceWarning()).toContain('invalid');
  });

  it('loads valid stored records and preserves a valid empty list', () => {
    const savedCustomer = {
      id: 'saved-1',
      name: 'Saved Customer',
      email: 'saved@example.com',
      company: 'Saved Co.',
      status: 'active',
      createdAt: '2026-11-01T12:00:00.000Z',
      followUpDueAt: null,
    };
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify([savedCustomer]));
    service.initialize();
    expect(service.getAll()).toEqual([savedCustomer]);

    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, '[]');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CustomerService] });
    service = TestBed.inject(CustomerService);
    service.initialize();
    expect(service.getAll()).toEqual([]);
  });

  it('creates a customer with trimmed fields and generated metadata', () => {
    const customer = service.create(formData);

    expect(customer.id).toBeTruthy();
    expect(customer.name).toBe('Jamie Example');
    expect(customer.email).toBe('jamie@example.com');
    expect(customer.company).toBe('Example Co.');
    expect(customer.followUpDueAt).toBeNull();
    expect(service.getById(customer.id)).toEqual(customer);
    expect(JSON.parse(window.localStorage.getItem(CUSTOMER_STORAGE_KEY) ?? '[]')).toContainEqual(customer);
  });

  it('updates customer details without replacing creation metadata', () => {
    const existing = service.getAll()[0];
    const updated = service.update(existing.id, { ...formData, status: 'active' });

    expect(updated?.id).toBe(existing.id);
    expect(updated?.createdAt).toBe(existing.createdAt);
    expect(updated?.followUpDueAt).toBe(existing.followUpDueAt);
    expect(updated?.status).toBe('active');
    expect(JSON.parse(window.localStorage.getItem(CUSTOMER_STORAGE_KEY) ?? '[]')).toContainEqual(updated);
  });

  it('returns undefined when asked to update an unknown customer', () => {
    expect(service.update('missing', formData)).toBeUndefined();
  });

  it('deletes existing records and returns false for missing IDs', () => {
    const [existing] = service.getAll();

    expect(service.delete(existing.id)).toBe(true);
    expect(service.getById(existing.id)).toBeUndefined();
    expect(service.delete(existing.id)).toBe(false);
    expect(JSON.parse(window.localStorage.getItem(CUSTOMER_STORAGE_KEY) ?? '[]')).not.toContainEqual(existing);
  });

  it('keeps the in-session change and exposes a warning when LocalStorage writes fail', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
    });

    const created = service.create(formData);

    expect(service.getById(created.id)).toEqual(created);
    expect(service.persistenceWarning()).toContain('could not be saved');
    setItem.mockRestore();
  });
});
