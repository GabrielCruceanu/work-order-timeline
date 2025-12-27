import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
})
export class NavigationComponent {
  protected readonly logoUrl = signal<string>('/assets/images/logo.png');
}
