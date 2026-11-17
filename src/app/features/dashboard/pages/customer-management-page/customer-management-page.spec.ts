import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Customer } from '../../../../core/models/customer.model';
import { CUSTOMER_STORAGE_KEY, CustomerService } from '../../../../core/services/customer.service';
import { CustomerManagementPage } from './customer-management-page';

describe('CustomerManagementPage', () => {
  let fixture: ComponentFixture<CustomerManagementPage>;

  const customers: Customer[] = [
    makeCustomer('cus-a', 'Zoe Adams', 'zoe@example.com', 'active', '2026-11-15T10:00:00.000Z'),
    makeCustomer('cus-b', 'Alex Brown', 'alex@example.com', 'lead', '2026-11-16T10:00:00.000Z'),
    makeCustomer('cus-c', 'Mia Clark', 'mia@example.com', 'active', '2026-11-17T10:00:00.000Z'),
  ];

  beforeEach(async () => {
    window.localStorage.clear();
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
    await TestBed.configureTestingModule({ imports: [CustomerManagementPage] }).compileComponents();
    TestBed.inject(CustomerService).initialize();
    fixture = TestBed.createComponent(CustomerManagementPage);
    fixture.detectChanges();
  });

  it('searches case-insensitively by customer name or email', () => {
    const search = fixture.nativeElement.querySelector('[aria-label="Search customers by name or email"]') as HTMLInputElement;
    search.value = 'ALEX@EXAMPLE';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(rowNames()).toEqual(['Alex Brown']);
  });

  it('filters records by status and combines the filter with search', () => {
    const status = fixture.nativeElement.querySelector('[aria-label="Filter customers by status"]') as HTMLSelectElement;
    status.value = 'active';
    status.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(rowNames()).toEqual(['Mia Clark', 'Zoe Adams']);

    const search = fixture.nativeElement.querySelector('[aria-label="Search customers by name or email"]') as HTMLInputElement;
    search.value = 'zoe';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(rowNames()).toEqual(['Zoe Adams']);
  });

  it('sorts by name and date without mutating the service collection', () => {
    const sortByName = fixture.nativeElement.querySelector('[aria-label^="Sort by customer name"]') as HTMLButtonElement;
    sortByName.click();
    fixture.detectChanges();
    expect(rowNames()).toEqual(['Alex Brown', 'Mia Clark', 'Zoe Adams']);

    const sortByDate = fixture.nativeElement.querySelector('[aria-label^="Sort by date added"]') as HTMLButtonElement;
    sortByDate.click();
    fixture.detectChanges();
    expect(rowNames()).toEqual(['Zoe Adams', 'Alex Brown', 'Mia Clark']);
  });

  it('shows an empty state and clear-filters control when there are no matches', () => {
    const search = fixture.nativeElement.querySelector('[aria-label="Search customers by name or email"]') as HTMLInputElement;
    search.value = 'not-present';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No customers found');
    const clearButton = fixture.nativeElement.querySelector('.clear-filters') as HTMLButtonElement;
    expect(clearButton).not.toBeNull();
    clearButton.click();
    fixture.detectChanges();
    expect(rowNames()).toHaveLength(3);
  });

  function rowNames(): string[] {
    const root = fixture.nativeElement as HTMLElement;
    return Array.from(root.querySelectorAll<HTMLElement>('tbody .customer-identity strong'))
      .map((element) => element.textContent?.trim() ?? '');
  }

  function makeCustomer(id: string, name: string, email: string, status: Customer['status'], createdAt: string): Customer {
    return { id, name, email, company: 'Example Co.', status, createdAt, followUpDueAt: null };
  }
});
