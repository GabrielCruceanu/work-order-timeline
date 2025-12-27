import { ZOOM_LEVELS, ZoomLevel } from '@/app/shared/constants/app.constants';
import { Component, inject, output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimelineService } from '@/app/features/timeline/services/timeline.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [NgSelectModule],
  templateUrl: './timeline-header.html',
  styleUrls: ['./timeline-header.scss'],
})
export class TimelineHeaderComponent {
  private readonly timelineService = inject(TimelineService);

  readonly zoomLevels = signal<ZoomLevel[]>(ZOOM_LEVELS);
  readonly timescaleChanged = output<ZoomLevel>();
}
