import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  input,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('');
  id = input.required<string>();
  placeholder = input<string>('yyyy-mm-dd');
  required = input<boolean>(false);
  errorMessage = input<string | null>(null);
  disabled = input<boolean>(false);

  // Internal form control
  control = new FormControl<NgbDateStruct | null>(null);

  // ControlValueAccessor implementation
  private onChange = (value: NgbDateStruct | null) => {};
  private onTouched = () => {};

  constructor() {
    // Subscribe to control value changes and propagate to parent
    this.control.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: NgbDateStruct | null): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: NgbDateStruct | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  // Computed properties
  hasError = computed(() => {
    const hasErrorMessage = this.errorMessage() !== null && this.errorMessage() !== '';
    const hasControlError = this.control.invalid && (this.control.dirty || this.control.touched);
    return hasErrorMessage || hasControlError;
  });

  displayError = computed(() => {
    if (this.errorMessage() && this.errorMessage() !== '') {
      return this.errorMessage();
    }
    if (this.control.hasError('required') && (this.control.dirty || this.control.touched)) {
      return 'This field is required';
    }
    return null;
  });

  // Method to toggle datepicker
  toggleDatepicker(datepicker: any): void {
    if (!this.disabled()) {
      datepicker.toggle();
    }
  }
}
