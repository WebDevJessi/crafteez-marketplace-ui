import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../env.development";

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) {}

  makePayment(
    stripeToken: unknown,
    items: Array<{ productId: number | string; quantity: number }>,
  ): Observable<unknown> {
    const url = `${environment.apiUrl.replace(/\/$/, '')}/checkout`;

    return this.http.post<unknown>(url, {
      token: stripeToken,
      items,
    });
  }
}