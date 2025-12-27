import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { WorkOrderStatus } from '@/app/core/models/work-order.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrls: ['./status-badge.scss'],
})
export class StatusBadgeComponent {
  status = input.required<WorkOrderStatus>();

  readonly statusConfig = {
    open: { background: '#e7f5ff', color: '#1971c2', label: 'Open' },
    'in-progress': { background: '#f3e5f5', color: '#7b1fa2', label: 'In Progress' },
    complete: { background: '#d4edda', color: '#155724', label: 'Complete' },
    blocked: { background: '#fff3cd', color: '#856404', label: 'Blocked' },
  };

  currentConfig = computed(() => this.statusConfig[this.status()]);
}
