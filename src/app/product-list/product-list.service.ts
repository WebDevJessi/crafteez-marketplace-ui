import { Injectable } from "@angular/core";
import { catchError } from "rxjs";
import { Product } from "../shared/types/product.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/products';

  products$ = this.http.get<Product[]>(this.apiUrl).pipe(
    catchError((error) => {
      console.error('Error fetching products:', error);
      throw error;
    })
  );
}
