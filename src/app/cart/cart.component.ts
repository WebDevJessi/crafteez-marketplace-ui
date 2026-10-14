import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart, CartItem } from '../models/cart.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CheckoutService } from '../checkout/checkout.service';


@Component({
  selector: 'cart-location',
  standalone: true,
  imports: [NgIf, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTableModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy{
  cart: Cart = { items: [] };
  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];
  dataSource: CartItem[] = [];
  cartSubscription: Subscription | undefined;
  paymentHandler: any = null;
  
  constructor(private cartService: CartService, private http: HttpClient, private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = _cart.items;
    });
    this.invokeStripe();
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

    onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }


  makePayment(amount: number) {
    if (!this.paymentHandler) {
      console.error('Stripe Checkout is not ready yet.');
      return;
    }

    this.paymentHandler.open({
      name: 'Crafteez Marketplace',
      description: 'Payment Transaction',
      amount: amount * 100,
    });
  }

  invokeStripe() {
    const configureCheckout = () => {
      const stripeCheckout = (window as any).StripeCheckout;
      if (!stripeCheckout) {
        console.error('Stripe Checkout.js loaded, but StripeCheckout is unavailable.');
        return;
      }

      this.paymentHandler = stripeCheckout.configure({
        key: 'pk_test_51UNEm9GZuzJDUcJcdFUbZjCyuAFJgFIyY2V69jIFIeWBvFGnzDQmmqaz1qqOtFtnJGCcl194i0fBct4rtyJOvsWX00mYq1eXVe',
        locale: 'auto',
        token: (stripeToken: any) => {
          this.checkoutService.makePayment(stripeToken).subscribe({
            next: (data: any) => console.log(data),
            error: (error) => console.error('Stripe payment request failed:', error),
          });
        },
      });
    };

    const existingScript = window.document.getElementById('stripe-script') as HTMLScriptElement | null;
    if ((window as any).StripeCheckout) {
      configureCheckout();
    } else if (existingScript) {
      existingScript.addEventListener('load', configureCheckout, { once: true });
      existingScript.addEventListener('error', () => console.error('Unable to load Stripe Checkout.js.'), { once: true });
    } else {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = configureCheckout;
      script.onerror = () => console.error('Unable to load Stripe Checkout.js.');
      window.document.body.appendChild(script);
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
