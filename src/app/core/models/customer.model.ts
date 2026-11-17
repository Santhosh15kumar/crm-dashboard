export type CustomerStatus = 'active' | 'lead' | 'inactive';

export interface Customer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly status: CustomerStatus;
  /** ISO-8601 date string to keep the model JSON/API friendly. */
  readonly createdAt: string;
  /** Scheduled next contact; a due date on or before today is a pending follow-up. */
  readonly followUpDueAt: string | null;
}

export type CustomerFormData = Pick<Customer, 'name' | 'email' | 'company' | 'status'>;

export type CustomerSortField = 'name' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface CustomerFilters {
  readonly query: string;
  readonly status: CustomerStatus | 'all';
}
