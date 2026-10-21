import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IGX_CAROUSEL_DIRECTIVES, IgxCarouselModule, IgxIconComponent, IgxIconModule, IgxCardActionsComponent } from 'igniteui-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../shared/types/product.interface';
import { ProductListService } from '../product-list/product-list.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [IgxCarouselModule, IGX_CAROUSEL_DIRECTIVES, NgFor, NgIf, CurrencyPipe, RouterLink, IgxIconComponent, IgxIconModule, IgxCardActionsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  currentBackground = "url('assets/background.jpg')";
  bannerBackground = "url('assets/Unleash_Your_creativity-removebg-preview.png')";
  featuredProducts: Product[] = [];
  featuredProductsLoading = true;
  featuredProductsError = '';
  categories = [
    { name: 'Soft & squishy', detail: 'Playful sensory favorites', image: '/assets/pink-crunchy-slime.jpg' },
    { name: 'Paint & color', detail: 'Tools for bright ideas', image: '/assets/gouache paint set.jpg' },
    { name: 'Stitch & make', detail: 'Start your next project', image: '/assets/yarn-kit.jpg' },
  ];
  public slides = [
    { src: '/assets/paint-cat.mp4', type: 'video' },
    { src: '/assets/stationery-display.jpg', type: 'image' },
    { src: '/assets/painting-example.jpg', type: 'image' },
    { src: '/assets/stationery-craft.jpg', type: 'image' },
  ];

  constructor(
    private productListService: ProductListService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.productListService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.featuredProducts = products.slice(0, 4);
          this.featuredProductsLoading = false;
          this.featuredProductsError = '';
        },
        error: (error) => {
          console.error('Unable to load featured products:', error);
          this.featuredProductsLoading = false;
          this.featuredProductsError = 'Featured products are temporarily unavailable.';
        },
      });
  }
}
