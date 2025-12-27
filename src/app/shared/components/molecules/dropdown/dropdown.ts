import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  input,
  forwardRef,
  computed,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export interface DropdownOption {
  value: any;
  label: string;
  [key: string]: any; // Allow additional properties
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('');
  id = input.required<string>();
  items = input.required<any[]>();
  bindLabel = input<string>('label');
  bindValue = input<string>('value');
  placeholder = input<string>('Select an option');
  clearable = input<boolean>(false);
  searchable = input<boolean>(true);
  disabled = input<boolean>(false);
  errorMessage = input<string | null>(null);

  // Template references for custom rendering
  labelTemplate = input<TemplateRef<any> | undefined>(undefined);
  optionTemplate = input<TemplateRef<any> | undefined>(undefined);

  // Internal form control
  control = new FormControl<any>(null);

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    // Subscribe to control value changes and propagate to parent
    this.control.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: any) => void): void {
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
}
