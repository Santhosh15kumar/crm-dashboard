import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Customer, CustomerFormData } from '../../../../core/models/customer.model';
import { CustomerFormModal } from './customer-form-modal';

describe('CustomerFormModal', () => {
  let fixture: ComponentFixture<CustomerFormModal>;
  let component: CustomerFormModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CustomerFormModal] }).compileComponents();
    fixture = TestBed.createComponent(CustomerFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('rejects missing required values and invalid email addresses', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#customer-name-error')).not.toBeNull();

    setField('customer-name', 'Jamie');
    setField('customer-company', 'Example Co.');
    setField('customer-email', 'not-an-email');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#customer-email-error')).not.toBeNull();
  });

  it('emits normalized customer values when the form is valid', () => {
    let emitted: CustomerFormData | undefined;
    component.saved.subscribe((data) => emitted = data);
    setField('customer-name', '  Jamie Example ');
    setField('customer-email', 'jamie@example.com');
    setField('customer-company', ' Example Co. ');
    const status = fixture.nativeElement.querySelector('#customer-status') as HTMLSelectElement;
    status.value = 'active';
    status.dispatchEvent(new Event('change', { bubbles: true }));
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(emitted).toEqual({
      name: 'Jamie Example',
      email: 'jamie@example.com',
      company: 'Example Co.',
      status: 'active',
    });
  });

  it('rejects whitespace-only required fields and values over the supported limits', () => {
    setField('customer-name', '   ');
    setField('customer-email', 'jamie@example.com');
    setField('customer-company', 'Example Co.');
    submitForm();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#customer-name-error')).not.toBeNull();

    setField('customer-name', 'J'.repeat(101));
    submitForm();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#customer-name-error')).not.toBeNull();
  });

  it('prefills edit data and resets to add defaults when the edited customer is cleared', () => {
    const customer: Customer = {
      id: 'cus-edit',
      name: 'Taylor Example',
      email: 'taylor@example.com',
      company: 'Taylor Co.',
      status: 'inactive',
      createdAt: '2026-11-01T12:00:00.000Z',
      followUpDueAt: null,
    };

    fixture.componentRef.setInput('customer', customer);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('#customer-name') as HTMLInputElement).value).toBe(customer.name);
    expect((fixture.nativeElement.querySelector('#customer-status') as HTMLSelectElement).value).toBe('inactive');

    fixture.componentRef.setInput('customer', null);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('#customer-name') as HTMLInputElement).value).toBe('');
    expect((fixture.nativeElement.querySelector('#customer-status') as HTMLSelectElement).value).toBe('lead');
  });

  function setField(id: string, value: string): void {
    const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function submitForm(): void {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
});
