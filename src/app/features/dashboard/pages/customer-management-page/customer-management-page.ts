import { Component, computed, inject, signal } from '@angular/core';
import { Customer, CustomerFormData, CustomerSortField, CustomerStatus } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customer.service';
import { CustomerSort, CustomerTable } from '../../components/customer-table/customer-table';
import { CustomerFormModal } from '../../components/customer-form-modal/customer-form-modal';

@Component({
  selector: 'app-customer-management-page',
  standalone: true,
  imports: [CustomerTable, CustomerFormModal],
  templateUrl: './customer-management-page.html',
  styleUrl: './customer-management-page.scss',
})
export class CustomerManagementPage {
  readonly pageTitle = 'Customers';

  private readonly customerService = inject(CustomerService);

  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<CustomerStatus | 'all'>('all');
  protected readonly sort = signal<CustomerSort>({ field: 'createdAt', direction: 'desc' });
  protected readonly formOpen = signal(false);
  protected readonly editingCustomer = signal<Customer | null>(null);

  protected readonly filteredCustomers = computed(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase();
    const status = this.statusFilter();
    const { field, direction } = this.sort();
    const directionFactor = direction === 'asc' ? 1 : -1;

    return this.customerService.customers()
      .filter((customer) => {
        const matchesQuery =
          !query ||
          customer.name.toLocaleLowerCase().includes(query) ||
          customer.email.toLocaleLowerCase().includes(query);
        const matchesStatus = status === 'all' || customer.status === status;
        return matchesQuery && matchesStatus;
      })
      .slice()
      .sort((left, right) => {
        if (field === 'createdAt') {
          const leftHasValidDate = !Number.isNaN(Date.parse(left.createdAt));
          const rightHasValidDate = !Number.isNaN(Date.parse(right.createdAt));
          if (leftHasValidDate !== rightHasValidDate) return leftHasValidDate ? -1 : 1;
        }

        const comparison = this.compareCustomers(left, right, field) * directionFactor;
        return comparison || left.id.localeCompare(right.id);
      });
  });

  protected updateSearch(query: string): void {
    this.searchTerm.set(query);
  }

  protected updateStatus(status: CustomerStatus | 'all'): void {
    this.statusFilter.set(status);
  }

  protected updateSort(sort: CustomerSort): void {
    this.sort.set(sort);
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
  }

  protected addCustomer(): void {
    this.editingCustomer.set(null);
    this.formOpen.set(true);
  }

  protected editCustomer(customer: Customer): void {
    this.editingCustomer.set(customer);
    this.formOpen.set(true);
  }

  protected saveCustomer(data: CustomerFormData): void {
    const customer = this.editingCustomer();
    if (customer) this.customerService.update(customer.id, data);
    else this.customerService.create(data);
    this.formOpen.set(false);
  }

  protected deleteCustomer(customer: Customer): void {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(`Delete ${customer.name} from the current in-memory list? Changes reset when you reload.`);
    if (confirmed) this.customerService.delete(customer.id);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
  }

  private compareCustomers(left: Customer, right: Customer, field: CustomerSortField): number {
    if (field === 'name') return left.name.localeCompare(right.name);

    const leftDate = Date.parse(left.createdAt);
    const rightDate = Date.parse(right.createdAt);
    if (Number.isNaN(leftDate)) return Number.isNaN(rightDate) ? 0 : 1;
    if (Number.isNaN(rightDate)) return -1;
    return leftDate - rightDate;
  }
}
