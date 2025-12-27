import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, forwardRef, computed } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrls: ['./input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('');
  id = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  errorMessage = input<string | null>(null);
  disabled = input<boolean>(false);
  autocomplete = input<string>('off');

  // Internal form control
  control = new FormControl<string>('');

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {
    // Subscribe to control value changes and propagate to parent
    this.control.valueChanges.subscribe(value => {
      this.onChange(value || '');
      this.onTouched();
    });
  }

  writeValue(value: string): void {
    this.control.setValue(value || '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
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
    if (this.control.hasError('minlength') && (this.control.dirty || this.control.touched)) {
      const minLength = this.control.getError('minlength')?.requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    return null;
  });
}
