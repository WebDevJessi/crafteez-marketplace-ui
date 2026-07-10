import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/types/product.interface';
import { PRODUCTS } from './product-data';
import { ProductCardComponent } from "../product-card/product-card.component";
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, MatCardModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  protected products: Product[] = PRODUCTS;
  ngOnInit() {
    console.log('helloooo');
  }
}
