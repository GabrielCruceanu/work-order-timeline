import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationComponent } from './shared/components/organisms/navigation/navigation';
import { TimelineComponent } from './features/timeline/timeline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavigationComponent, TimelineComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
