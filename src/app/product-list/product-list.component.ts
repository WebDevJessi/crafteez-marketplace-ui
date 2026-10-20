import { Component, DestroyRef, OnInit } from '@angular/core';
import { Product } from '../shared/types/product.interface';
import { ProductCardComponent } from "../product-card/product-card.component";
import { MatCardModule } from '@angular/material/card';
import { ProductListService } from './product-list.service';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../models/cart.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, MatCardModule, MatSnackBarModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMessage = '';
  cartItems: CartItem[] = [];

  currentBackground = "url('assets/background.jpg')";

  constructor(
    private productListService: ProductListService,
    private cartService: CartService,
    private destroyRef: DestroyRef,
  ) {}

  onAddToCart(product: Product): void {
    const item: CartItem = {
      id: product.id,
      product: product.imageUrl,
      name: product.name,
      price: product.price,
      quantity: 1,
    };

    this.cartService.addToCart(item);
  }

  onRemoveQuantity(product: Product): void {
    const item = this.cartItems.find(item => item.id === product.id);

    if (item) {
      this.cartService.removeQuantity(item);
    }
  }

  ngOnInit(): void {
    this.productListService.products$.subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.cartService.cart
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(( { items } ) => {
          this.cartItems = items;
        });
      },
      error: () => {
        this.errorMessage = 'Unable to load products. Check the backend connection and try again.';
        this.loading = false;
      },
    });
  }

  quantityFor(product: Product): number {
    return this.cartItems.find(item => item.id === product.id)?.quantity ?? 0;
  }
}
