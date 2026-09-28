import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IGX_CAROUSEL_DIRECTIVES, IgxCarouselModule, IgxIconComponent, IgxIconModule, IgxCardActionsComponent } from 'igniteui-angular';
import { PRODUCTS } from '../product-list/product-data';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [IgxCarouselModule, IGX_CAROUSEL_DIRECTIVES, NgFor, NgIf, CurrencyPipe, RouterLink, IgxIconComponent, IgxIconModule, IgxCardActionsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  currentBackground = "url('assets/background.jpg')";
  bannerBackground = "url('assets/Unleash Your Creativity.png')";
  featuredProducts = PRODUCTS.slice(0, 4);
  categories = [
    { name: 'Soft & squishy', detail: 'Playful sensory favorites', image: '/assets/rainbow-cloud.jpg' },
    { name: 'Paint & color', detail: 'Tools for bright ideas', image: '/assets/gouache paint set.jpg' },
    { name: 'Stitch & make', detail: 'Start your next project', image: '/assets/yarn-kit.jpg' },
  ];
  public slides = [
    { src: '/assets/paint-cat.mp4', type: 'video' },
    { src: '/assets/stationery-display.jpg', type: 'image' },
    { src: '/assets/painting-example.jpg', type: 'image' },
    { src: '/assets/stationery-craft.jpg', type: 'image' },
  ];
}
