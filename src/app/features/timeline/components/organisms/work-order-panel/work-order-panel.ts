import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkOrderDocument, WorkOrderStatus } from '@/app/core/models/work-order.model';
import { WorkCenterDocument } from '@/app/core/models/work-center.model';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, NgSelectModule],
  templateUrl: './work-order-panel.html',
  styleUrls: ['./work-order-panel.scss'],
})
export class WorkOrderPanelComponent {
  // Signal inputs
  isOpen = input.required<boolean>();
  mode = input.required<'create' | 'edit'>();
  workOrder = input<WorkOrderDocument | null>(null);
  prefilledData = input<{ workCenterId?: string; date?: Date } | null>(null);
  workCenters = input.required<WorkCenterDocument[]>();
  existingWorkOrders = input.required<WorkOrderDocument[]>();

  // Signal outputs
  closePanel = output<void>();
  saveWorkOrder = output<Partial<WorkOrderDocument>>();
  deleteWorkOrder = output<string>(); // docId

  // Local state
  isSubmitting = signal(false);
  overlapError = signal<string | null>(null);

  // Reactive form
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    status: new FormControl<WorkOrderStatus>('open', Validators.required),
    workCenterId: new FormControl('', Validators.required),
    startDate: new FormControl<NgbDateStruct | null>(null, Validators.required),
    endDate: new FormControl<NgbDateStruct | null>(null, Validators.required),
  });

  // Status options for ng-select
  statusOptions = [
    { value: 'open' as WorkOrderStatus, label: 'Open', color: '#5659ff' },
    { value: 'in-progress' as WorkOrderStatus, label: 'In Progress', color: '#6f42c1' },
    { value: 'complete' as WorkOrderStatus, label: 'Complete', color: '#28a745' },
    { value: 'blocked' as WorkOrderStatus, label: 'Blocked', color: '#ffc107' },
  ];

  // Computed title
  panelTitle = computed(() => (this.mode() === 'create' ? 'Create Work Order' : 'Edit Work Order'));

  constructor() {
    // Effect to populate form when panel opens
    effect(() => {
      if (this.isOpen()) {
        this.populateForm();
      }
    });
  }

  private populateForm() {
    const mode = this.mode();
    const workOrder = this.workOrder();
    const prefilled = this.prefilledData();

    if (mode === 'edit' && workOrder) {
      // Edit mode: populate with existing work order data
      this.form.patchValue({
        name: workOrder.data.name,
        status: workOrder.data.status,
        workCenterId: workOrder.data.workCenterId,
        startDate: this.isoToNgbDate(workOrder.data.startDate),
        endDate: this.isoToNgbDate(workOrder.data.endDate),
      });
    } else if (mode === 'create') {
      // Create mode: reset form and apply prefilled data
      const startDate = prefilled?.date ? new Date(prefilled.date) : this.addDays(new Date(), 0);
      const endDate = prefilled?.date
        ? this.addDays(prefilled.date, 7)
        : this.addDays(new Date(), 7);

      this.form.reset({
        name: '',
        status: 'open',
        workCenterId: prefilled?.workCenterId || '',
        startDate: this.dateToNgbDate(startDate),
        endDate: this.dateToNgbDate(endDate),
      });
    }

    this.overlapError.set(null);
  }

  // Helper methods for date conversion
  private isoToNgbDate(isoDate: string): NgbDateStruct | null {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return null;
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  private dateToNgbDate(date: Date): NgbDateStruct | null {
    if (!date || isNaN(date.getTime())) return null;
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  private ngbDateToISO(ngbDate: NgbDateStruct | null): string {
    if (!ngbDate) return '';
    const date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    return date.toISOString().split('T')[0];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Validation helpers
  hasError(controlName: string, errorType: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength')?.requiredLength;
      return `Minimum ${minLength} characters required`;
    }

    return '';
  }

  // Form submission
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    const startDateISO = this.ngbDateToISO(formData.startDate ?? null);
    const endDateISO = this.ngbDateToISO(formData.endDate ?? null);

    // Check for overlaps
    const currentWorkOrderId = this.mode() === 'edit' ? this.workOrder()?.docId : null;

    const overlap = this.checkOverlap(
      formData.workCenterId!,
      new Date(startDateISO),
      new Date(endDateISO),
      currentWorkOrderId ?? undefined
    );

    if (overlap) {
      this.overlapError.set(`This work order overlaps with "${overlap.data.name}"`);
      return;
    }

    // Clear error and submit
    this.overlapError.set(null);
    this.isSubmitting.set(true);

    // Emit save event
    this.saveWorkOrder.emit({
      docId: this.mode() === 'edit' ? this.workOrder()!.docId : undefined,
      data: {
        name: formData.name!,
        status: formData.status!,
        workCenterId: formData.workCenterId!,
        startDate: startDateISO,
        endDate: endDateISO,
      },
    } as Partial<WorkOrderDocument>);

    // Reset submitting state after a delay
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.onClose();
    }, 300);
  }

  private checkOverlap(
    workCenterId: string,
    startDate: Date,
    endDate: Date,
    excludeWorkOrderId?: string
  ): WorkOrderDocument | null {
    const existingOrders = this.existingWorkOrders();

    // Filter orders for same work center
    const ordersInSameCenter = existingOrders.filter(
      order =>
        order.data.workCenterId === workCenterId &&
        (!excludeWorkOrderId || order.docId !== excludeWorkOrderId)
    );

    // Check for overlaps
    for (const order of ordersInSameCenter) {
      const orderStart = new Date(order.data.startDate);
      const orderEnd = new Date(order.data.endDate);

      // Check if date ranges overlap: start1 < end2 && start2 < end1
      if (startDate < orderEnd && endDate > orderStart) {
        return order; // Overlap found
      }
    }

    return null; // No overlap
  }

  onClose() {
    this.form.reset();
    this.overlapError.set(null);
    this.closePanel.emit();
  }

  onDelete() {
    if (this.mode() === 'edit' && this.workOrder()) {
      if (confirm('Are you sure you want to delete this work order?')) {
        this.deleteWorkOrder.emit(this.workOrder()!.docId);
        this.onClose();
      }
    }
  }
}
