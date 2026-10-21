import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { CartComponent } from './cart.component';
import { Cart, CartItem } from '../models/cart.model';
import { CartService } from './cart.service';
import { CheckoutService } from '../checkout/checkout.service';
import { ProductListService } from '../product-list/product-list.service';
import { Product } from '../shared/types/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

interface StripeCheckoutWindow extends Window {
  StripeCheckout?: {
    configure: jasmine.Spy;
  };
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartSubject: BehaviorSubject<Cart>;
  let productSubject: Subject<Product[]>;
  let cartService: jasmine.SpyObj<CartService>;
  let checkoutService: jasmine.SpyObj<CheckoutService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const cartItem: CartItem = {
    id: 1,
    product: '/assets/Crafteez.png',
    name: 'Craft kit',
    price: 12,
    quantity: 2,
  };
  const product: Product = {
    id: 1,
    name: 'Craft kit',
    imageUrl: '/assets/Crafteez.png',
    price: 12,
    description: 'A kit',
  };

  beforeEach(async () => {
    cartSubject = new BehaviorSubject<Cart>({ items: [cartItem] });
    productSubject = new Subject<Product[]>();
    cartService = jasmine.createSpyObj<CartService>(
      'CartService',
      ['syncWithProducts', 'getTotal', 'addToCart', 'removeFromCart', 'removeQuantity', 'clearCart'],
      { cart: cartSubject },
    );
    cartService.syncWithProducts.and.returnValue(0);
    cartService.getTotal.and.returnValue(24);
    checkoutService = jasmine.createSpyObj<CheckoutService>('CheckoutService', ['makePayment']);
    checkoutService.makePayment.and.returnValue(of({}));
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: CartService, useValue: cartService },
        { provide: CheckoutService, useValue: checkoutService },
        { provide: ProductListService, useValue: { products$: productSubject.asObservable() } },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });
    TestBed.overrideProvider(MatSnackBar, { useValue: snackBar });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    spyOn(component, 'invokeStripe');
    fixture.detectChanges();
  });

  it('subscribes to the cart and refreshes its products', () => {
    productSubject.next([product]);

    expect(component.cart.items).toEqual([cartItem]);
    expect(component.productsLoaded).toBeTrue();
    expect(cartService.syncWithProducts).toHaveBeenCalledWith([product]);
  });

  it('notifies the user when unavailable products are removed', () => {
    cartService.syncWithProducts.and.returnValue(1);
    productSubject.next([product]);

    expect(cartService.syncWithProducts).toHaveBeenCalledWith([product]);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Items that are no longer available have been removed from your cart.',
      'Ok',
      { duration: 5000 },
    );
  });

  it('disables checkout readiness and exposes an error when product refresh fails', () => {
    spyOn(console, 'error');
    productSubject.error(new Error('offline'));

    expect(component.productsLoaded).toBeFalse();
    expect(component.productRefreshError).toContain('Unable to verify current prices');
  });

  it('delegates cart actions and totals to the cart service', () => {
    component.onAddQuantity(cartItem);
    component.onRemoveQuantity(cartItem);
    component.onRemoveFromCart(cartItem);
    component.onClearCart();

    expect(component.getTotal([cartItem])).toBe(24);
    expect(cartService.addToCart).toHaveBeenCalledWith(cartItem);
    expect(cartService.removeQuantity).toHaveBeenCalledWith(cartItem);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(cartItem);
    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('opens payment in cents when checkout is ready', () => {
    const open = jasmine.createSpy('open');
    component.productsLoaded = true;
    component.paymentHandler = { open };

    component.makePayment(24);

    expect(open).toHaveBeenCalledWith({
      name: 'Crafteez Marketplace',
      description: 'Payment Transaction',
      amount: 2400,
    });
  });

  it('does not open payment when products are not verified or the cart is empty', () => {
    const open = jasmine.createSpy('open');
    component.productsLoaded = false;
    component.paymentHandler = { open };
    component.makePayment(24);

    component.productsLoaded = true;
    cartSubject.next({ items: [] });
    component.makePayment(0);

    expect(open).not.toHaveBeenCalled();
  });

  it('does not open payment when Stripe is not ready', () => {
    spyOn(console, 'error');
    component.productsLoaded = true;
    component.paymentHandler = null;

    component.makePayment(24);

    expect(console.error).toHaveBeenCalledWith('Stripe Checkout is not ready yet.');
  });

  it('sends the Stripe token with product IDs and quantities', () => {
    const stripeWindow = window as StripeCheckoutWindow;
    const previousStripeCheckout = stripeWindow.StripeCheckout;
    let tokenHandler: (token: string) => void = () => {};
    const configure = jasmine.createSpy('configure').and.callFake(
      (options: { token: (token: string) => void }) => {
        tokenHandler = options.token;
        return {};
      },
    );
    stripeWindow.StripeCheckout = { configure };
    spyOn(console, 'log');

    try {
      (component.invokeStripe as jasmine.Spy).and.callThrough();
      component.invokeStripe();
      tokenHandler('stripe-token');

      expect(configure).toHaveBeenCalled();
      expect(checkoutService.makePayment).toHaveBeenCalledWith('stripe-token', [
        { productId: 1, quantity: 2 },
      ]);
    } finally {
      if (previousStripeCheckout) {
        stripeWindow.StripeCheckout = previousStripeCheckout;
      } else {
        delete stripeWindow.StripeCheckout;
      }
    }
  });

  it('reports checkout API failures returned after Stripe provides a token', () => {
    const stripeWindow = window as StripeCheckoutWindow;
    const previousStripeCheckout = stripeWindow.StripeCheckout;
    let tokenHandler: (token: string) => void = () => {};
    const configure = jasmine.createSpy('configure').and.callFake(
      (options: { token: (token: string) => void }) => {
        tokenHandler = options.token;
        return {};
      },
    );
    stripeWindow.StripeCheckout = { configure };
    checkoutService.makePayment.and.returnValue(
      throwError(() => new Error('payment rejected')),
    );
    spyOn(console, 'error');

    try {
      (component.invokeStripe as jasmine.Spy).and.callThrough();
      component.invokeStripe();
      tokenHandler('stripe-token');

      expect(console.error).toHaveBeenCalledWith(
        'Stripe payment request failed:',
        jasmine.any(Error),
      );
    } finally {
      if (previousStripeCheckout) {
        stripeWindow.StripeCheckout = previousStripeCheckout;
      } else {
        delete stripeWindow.StripeCheckout;
      }
    }
  });

  it('unsubscribes from cart and product updates when destroyed', () => {
    const cartSubscription = component.cartSubscription!;
    const productsSubscription = component.productsSubscription!;

    fixture.destroy();

    expect(cartSubscription.closed).toBeTrue();
    expect(productsSubscription.closed).toBeTrue();
  });

  it('creates the cart component', () => {
    expect(component).toBeTruthy();
  });
});
