import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZoomLevel } from '@/app/shared/constants/app.constants';

interface ZoomOption {
  value: ZoomLevel;
  label: string;
}

@Component({
  selector: 'app-zoom-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './zoom-control.html',
  styleUrls: ['./zoom-control.scss'],
})
export class ZoomControlComponent {
  // Signal inputs
  currentZoom = input.required<ZoomLevel>();

  // Signal outputs
  zoomChanged = output<ZoomLevel>();

  // Local state for ng-select (needs to be a regular property for ngModel)
  selectedOption: ZoomOption | null = null;

  // Zoom options constant
  readonly zoomOptions: ZoomOption[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  constructor(private cdr: ChangeDetectorRef) {
    // Sync input signal to selectedOption when it changes
    effect(() => {
      const zoom = this.currentZoom();
      const option = this.zoomOptions.find(opt => opt.value === zoom);
      if (option && this.selectedOption?.value !== option.value) {
        this.selectedOption = option;
        this.cdr.markForCheck();
      }
    });
  }

  // Method to handle ng-select change
  onZoomChange(option: ZoomOption | null): void {
    if (option) {
      this.selectedOption = option;
      this.zoomChanged.emit(option.value);
    }
  }
}
