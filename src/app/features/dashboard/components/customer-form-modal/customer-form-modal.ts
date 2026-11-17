import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Customer, CustomerFormData, CustomerStatus } from '../../../../core/models/customer.model';

const requiredTrimmed: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim().length > 0 ? null : { required: true };

@Component({
  selector: 'app-customer-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customer-form-modal.html',
  styleUrl: './customer-form-modal.scss',
})
export class CustomerFormModal implements OnChanges, AfterViewInit {
  @Input({ required: true }) customer: Customer | null = null;
  @Output() saved = new EventEmitter<CustomerFormData>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;
  @ViewChild('nameInput') private nameInput?: ElementRef<HTMLInputElement>;

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [requiredTrimmed, Validators.maxLength(100)]],
    email: ['', [requiredTrimmed, Validators.email, Validators.maxLength(254)]],
    company: ['', [requiredTrimmed, Validators.maxLength(120)]],
    status: ['lead' as CustomerStatus, [Validators.required]],
  });

  protected get isEditing(): boolean {
    return this.customer !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['customer']) return;

    this.form.reset(this.customer
      ? {
          name: this.customer.name,
          email: this.customer.email,
          company: this.customer.company,
          status: this.customer.status,
        }
      : { name: '', email: '', company: '', status: 'lead' });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') this.nameInput?.nativeElement.focus();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saved.emit({
      name: value.name.trim(),
      email: value.email.trim(),
      company: value.company.trim(),
      status: value.status,
    });
  }

  protected onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelled.emit();
      return;
    }

    if (event.key !== 'Tab' || !this.dialog) return;
    const controls = Array.from(this.dialog.nativeElement.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled])',
    ));
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }
}
