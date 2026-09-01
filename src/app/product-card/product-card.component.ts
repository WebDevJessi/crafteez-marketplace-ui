import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Product } from '../shared/types/product.interface';
import { CurrencyPipe } from '@angular/common';
import { MatCardContent, MatCardModule, MatCardTitleGroup } from "@angular/material/card";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, MatCardContent, MatCardModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({required:true}) product!:Product;

  currentBackground = "url('assets/background.jpg')";
}
