import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../shared/types/product.interface';
import { CurrencyPipe } from '@angular/common';
import { MatCardContent, MatCardModule, MatCardTitleGroup } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, MatCardContent, MatCardModule, MatButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({required:true}) product!:Product;
  @Output() addToCart = new EventEmitter<Product>();

  constructor() {}

  currentBackground = "url('assets/background.jpg')";

    onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
