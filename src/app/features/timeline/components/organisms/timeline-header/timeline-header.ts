import { ZoomLevel } from '@/app/shared/constants/app.constants';
import { Component, input, output } from '@angular/core';
import { ZoomControlComponent } from '../../molecules/zoom-control/zoom-control';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [ZoomControlComponent],
  templateUrl: './timeline-header.html',
  styleUrls: ['./timeline-header.scss'],
})
export class TimelineHeaderComponent {
  // Signal inputs
  currentZoom = input.required<ZoomLevel>();

  // Signal outputs
  zoomChanged = output<ZoomLevel>();

  // Methods
  onZoomChanged(zoom: ZoomLevel) {
    this.zoomChanged.emit(zoom);
  }
}
