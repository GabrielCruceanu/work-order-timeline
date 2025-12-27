import { ZoomLevel } from '@/app/shared/constants/app.constants';
import { Component, input, output } from '@angular/core';
import { ZoomControlComponent } from '../../molecules/zoom-control/zoom-control';
import { ButtonComponent } from '@/app/shared/components/atoms/button/button';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [ZoomControlComponent, ButtonComponent],
  templateUrl: './timeline-header.html',
  styleUrls: ['./timeline-header.scss'],
})
export class TimelineHeaderComponent {
  // Signal inputs
  currentZoom = input.required<ZoomLevel>();

  // Signal outputs
  zoomChanged = output<ZoomLevel>();
  todayClicked = output<void>();

  // Methods
  onZoomChanged(zoom: ZoomLevel) {
    this.zoomChanged.emit(zoom);
  }

  onTodayClick() {
    this.todayClicked.emit();
  }
}
