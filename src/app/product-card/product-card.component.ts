import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Product } from '../shared/types/product.interface';
import { CurrencyPipe } from '@angular/common';
import { MatCardContent, MatCardTitleGroup } from "@angular/material/card";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, MatCardContent, MatCardTitleGroup],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({required:true}) product!:Product;
}
