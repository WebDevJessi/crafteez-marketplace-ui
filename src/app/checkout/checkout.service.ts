import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) {}

  // Add any methods related to checkout functionality here
  makePayment(stripeToken: any):Observable<any> {
    const url = 'http://localhost:5001/checkout';

    return this.http.post<any>(url,{token: stripeToken})  }
}