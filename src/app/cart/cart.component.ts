import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart, CartItem } from '../models/cart.model';
import { Subscription } from 'rxjs';
import { CartService } from './cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CheckoutService } from '../checkout/checkout.service';
import { ProductListService } from '../product-list/product-list.service';


@Component({
  selector: 'cart-location',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, RouterLink, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy{
  cart: Cart = { items: [] };
  cartSubscription: Subscription | undefined;
  productsSubscription: Subscription | undefined;
  productsLoaded = false;
  productRefreshError = '';
  paymentHandler: any = null;
  
  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private productListService: ProductListService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
    });

    this.productsSubscription = this.productListService.products$.subscribe({
      next: (products) => {
        const unavailableCount = this.cartService.syncWithProducts(products);
        this.productsLoaded = true;
        this.productRefreshError = '';
        if (unavailableCount > 0) {
          this.snackBar.open(
            'Items that are no longer available have been removed from your cart.',
            'Ok',
            { duration: 5000 },
          );
        }
      },
      error: (error) => {
        console.error('Unable to refresh cart prices and availability:', error);
        this.productRefreshError = 'Unable to verify current prices and availability. Checkout is disabled until products can be refreshed.';
      },
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
    if (!this.productsLoaded || this.cart.items.length === 0) {
      return;
    }

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
          const items = this.cart.items.map(({ id, quantity }) => ({
            productId: id,
            quantity,
          }));

          this.checkoutService.makePayment(stripeToken, items).subscribe({
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
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}
