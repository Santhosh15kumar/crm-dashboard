import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Customer, CustomerSortField, CustomerStatus, SortDirection } from '../../../../core/models/customer.model';

export interface CustomerSort {
  readonly field: CustomerSortField;
  readonly direction: SortDirection;
}

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './customer-table.html',
  styleUrl: './customer-table.scss',
})
export class CustomerTable {
  @Input({ required: true }) customers: readonly Customer[] = [];
  @Input({ required: true }) searchTerm = '';
  @Input({ required: true }) statusFilter: CustomerStatus | 'all' = 'all';
  @Input({ required: true }) sort: CustomerSort = { field: 'createdAt', direction: 'desc' };

  @Output() searchChanged = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<CustomerStatus | 'all'>();
  @Output() sortChanged = new EventEmitter<CustomerSort>();
  @Output() filtersCleared = new EventEmitter<void>();

  protected onSearchInput(event: Event): void {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }

  protected onStatusChange(event: Event): void {
    this.statusChanged.emit((event.target as HTMLSelectElement).value as CustomerStatus | 'all');
  }

  protected toggleSort(field: CustomerSortField): void {
    const direction: SortDirection = this.sort.field === field && this.sort.direction === 'asc' ? 'desc' : 'asc';
    this.sortChanged.emit({ field, direction });
  }

  protected initials(name: string): string {
    return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  }

  protected sortLabel(field: CustomerSortField): string {
    if (this.sort.field !== field) return 'Sort';
    return this.sort.direction === 'asc' ? 'Sorted ascending' : 'Sorted descending';
  }
}
