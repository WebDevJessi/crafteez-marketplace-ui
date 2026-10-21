import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PLATFORM_ID } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart.model';
import { Product } from '../shared/types/product.interface';

describe('CartService', () => {
  let service: CartService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let storageGet: jasmine.Spy;
  let storageSet: jasmine.Spy;

  const item: CartItem = {
    id: 1,
    product: '/assets/kit.jpg',
    name: 'Craft kit',
    price: 10,
    quantity: 1,
  };

  function createService(platformId: object | string = 'browser'): void {
    TestBed.resetTestingModule();
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        CartService,
        provideNoopAnimations(),
        { provide: MatSnackBar, useValue: snackBar },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    service = TestBed.inject(CartService);
  }

  beforeEach(() => {
    localStorage.clear();
    storageGet = spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    storageSet = spyOn(Storage.prototype, 'setItem').and.stub();
    createService();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('starts with an empty cart when nothing is stored', () => {
    expect(service.cart.value).toEqual({ items: [] });
  });

  it('restores a valid saved cart', () => {
    storageGet.and.returnValue(JSON.stringify({ items: [item] }));
    createService();

    expect(service.cart.value.items).toEqual([item]);
  });

  it('restores the legacy cart storage key', () => {
    storageGet.and.callFake((key: string) =>
      key === 'crafteez.cart.v1' ? null : JSON.stringify({ items: [item] }),
    );
    createService();

    expect(service.cart.value.items).toEqual([item]);
  });

  it('ignores invalid JSON or cart shapes', () => {
    spyOn(console, 'error');
    storageGet.and.returnValue('{');
    createService();
    expect(service.cart.value.items).toEqual([]);

    storageGet.and.returnValue(JSON.stringify({ items: [{ ...item, quantity: 0 }] }));
    createService();
    expect(service.cart.value.items).toEqual([]);
  });

  it('reports browser storage read errors and starts with an empty cart', () => {
    spyOn(console, 'error');
    storageGet.and.throwError('Storage unavailable');
    createService();

    expect(service.cart.value.items).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      'Unable to read the saved cart from browser storage.',
      jasmine.any(Error),
    );
  });

  it('adds an item, increments existing items, and persists each update', () => {
    service.addToCart(item);
    service.addToCart(item);

    expect(service.cart.value.items).toEqual([{ ...item, quantity: 2 }]);
    expect(storageSet).toHaveBeenCalledWith(
      'crafteez.cart.v1',
      JSON.stringify({ items: [{ ...item, quantity: 2 }] }),
    );
    expect(snackBar.open).toHaveBeenCalledTimes(2);
  });

  it('decrements quantity and removes the item at zero', () => {
    service.addToCart({ ...item, quantity: 2 });
    service.removeQuantity(item);
    expect(service.cart.value.items[0].quantity).toBe(1);

    service.removeQuantity({ ...item, quantity: 2 });
    expect(service.cart.value.items).toEqual([]);
  });

  it('leaves other cart items unchanged when decrementing an item not present', () => {
    service.addToCart(item);
    service.removeQuantity({ ...item, id: 999 });

    expect(service.cart.value.items).toEqual([item]);
  });

  it('removes an item, supports silent removal, and clears the cart', () => {
    service.addToCart(item);

    expect(service.removeFromCart(item, false)).toEqual([]);
    expect(service.cart.value.items).toEqual([item]);

    service.removeFromCart(item);
    expect(service.cart.value.items).toEqual([]);

    service.addToCart(item);
    service.clearCart();
    expect(service.cart.value.items).toEqual([]);
    expect(storageSet).toHaveBeenCalled();
  });

  it('refreshes saved cart item details from available products and drops unavailable items', () => {
    service.addToCart(item);
    service.addToCart({ ...item, id: 2, name: 'Discontinued', quantity: 1 });
    const updatedProduct: Product = {
      id: 1,
      name: 'Updated craft kit',
      price: 14,
      imageUrl: '/assets/new-kit.jpg',
      description: 'Updated',
    };

    const removedCount = service.syncWithProducts([updatedProduct]);

    expect(removedCount).toBe(1);
    expect(service.cart.value.items).toEqual([{
      id: 1,
      product: '/assets/new-kit.jpg',
      name: 'Updated craft kit',
      price: 14,
      quantity: 1,
    }]);
  });

  it('calculates totals and returns zero for an empty cart', () => {
    expect(service.getTotal([{ ...item, price: 4, quantity: 3 }, {
      ...item,
      id: 2,
      price: 5,
      quantity: 2,
    }])).toBe(22);
    expect(service.getTotal([])).toBe(0);
  });

  it('reports browser storage write errors without losing the in-memory cart', () => {
    const storageError = new Error('Storage full');
    spyOn(console, 'error');
    storageSet.and.throwError(storageError);

    expect(() => service.addToCart(item)).not.toThrow();
    expect(service.cart.value.items).toEqual([item]);
    expect(console.error).toHaveBeenCalledWith(
      'Unable to save the cart in browser storage.',
      jasmine.any(Error),
    );
  });

  it('does not access browser storage outside the browser', () => {
    storageGet.calls.reset();
    storageSet.calls.reset();
    createService('server');

    service.addToCart(item);

    expect(storageGet).not.toHaveBeenCalled();
    expect(storageSet).not.toHaveBeenCalled();
    expect(service.cart.value.items).toEqual([item]);
  });
});
