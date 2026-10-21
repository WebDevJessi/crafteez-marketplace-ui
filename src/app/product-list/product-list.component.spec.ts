import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../shared/types/product.interface';
import { ProductListService } from './product-list.service';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productsSubject: Subject<Product[]>;
  let cartSubject: BehaviorSubject<Cart>;
  let cartService: jasmine.SpyObj<CartService>;

  const product: Product = {
    id: 5,
    name: 'Paint set',
    description: 'Bright colors',
    price: 18,
    imageUrl: '/assets/paint-brush.jpg',
  };
  const cartItem: CartItem = {
    id: 5,
    product: product.imageUrl,
    name: product.name,
    price: product.price,
    quantity: 2,
  };

  beforeEach(async () => {
    productsSubject = new Subject<Product[]>();
    cartSubject = new BehaviorSubject<Cart>({ items: [cartItem] });
    cartService = jasmine.createSpyObj<CartService>('CartService', [
      'addToCart',
      'removeQuantity',
      'syncWithProducts',
    ], { cart: cartSubject });

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductListService, useValue: { products$: productsSubject.asObservable() } },
        { provide: CartService, useValue: cartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts in a loading state and displays products from the service', () => {
    expect(component.loading).toBeTrue();
    productsSubject.next([product]);
    fixture.detectChanges();

    expect(component.products).toEqual([product]);
    expect(component.loading).toBeFalse();
    expect(cartService.syncWithProducts).toHaveBeenCalledWith([product]);
    expect(fixture.nativeElement.textContent).toContain('Paint set');
  });

  it('shows an error state when product loading fails', () => {
    productsSubject.error(new Error('offline'));
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('Unable to load products');
    expect(cartService.syncWithProducts).not.toHaveBeenCalled();
  });

  it('uses the current cart quantity for a product and returns zero when absent', () => {
    expect(component.quantityFor(product)).toBe(2);
    expect(component.quantityFor({ ...product, id: 123 })).toBe(0);
  });

  it('creates a cart item from a product when adding it', () => {
    component.onAddToCart(product);

    expect(cartService.addToCart).toHaveBeenCalledWith({
      id: product.id,
      product: product.imageUrl,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  });

  it('removes a product quantity only when it is in the cart', () => {
    component.onRemoveQuantity(product);
    component.onRemoveQuantity({ ...product, id: 999 });

    expect(cartService.removeQuantity).toHaveBeenCalledOnceWith(cartItem);
  });
});
