import { TestBed } from '@angular/core/testing';
import { CustomerFormData } from '../models/customer.model';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  const formData: CustomerFormData = {
    name: '  Jamie Example  ',
    email: ' jamie@example.com ',
    company: ' Example Co. ',
    status: 'lead',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CustomerService] });
    service = TestBed.inject(CustomerService);
  });

  it('creates a customer with trimmed fields and generated metadata', () => {
    const customer = service.create(formData);

    expect(customer.id).toBeTruthy();
    expect(customer.name).toBe('Jamie Example');
    expect(customer.email).toBe('jamie@example.com');
    expect(customer.company).toBe('Example Co.');
    expect(customer.followUpDueAt).toBeNull();
    expect(service.getById(customer.id)).toEqual(customer);
  });

  it('updates customer details without replacing creation metadata', () => {
    const existing = service.getAll()[0];
    const updated = service.update(existing.id, { ...formData, status: 'active' });

    expect(updated?.id).toBe(existing.id);
    expect(updated?.createdAt).toBe(existing.createdAt);
    expect(updated?.followUpDueAt).toBe(existing.followUpDueAt);
    expect(updated?.status).toBe('active');
  });

  it('returns undefined when asked to update an unknown customer', () => {
    expect(service.update('missing', formData)).toBeUndefined();
  });

  it('deletes existing records and returns false for missing IDs', () => {
    const [existing] = service.getAll();

    expect(service.delete(existing.id)).toBe(true);
    expect(service.getById(existing.id)).toBeUndefined();
    expect(service.delete(existing.id)).toBe(false);
  });
});
