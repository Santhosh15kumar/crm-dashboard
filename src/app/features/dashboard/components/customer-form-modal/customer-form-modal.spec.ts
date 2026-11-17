import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerFormData } from '../../../../core/models/customer.model';
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

  function setField(id: string, value: string): void {
    const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
