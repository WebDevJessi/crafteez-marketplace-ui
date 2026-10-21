import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductListService } from './product-list.service';

describe('ProductListService', () => {
  let service: ProductListService;
  let httpTestingController: HttpTestingController;
  const url = 'http://localhost:5001/api/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductListService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('maps database products and filters unavailable products', () => {
    let result: unknown;
    service.products$.subscribe((products) => result = products);

    httpTestingController.expectOne(url).flush({
      value: [
        {
          id: 7,
          name: 'Available',
          description: 'A product',
          price: 12.5,
          isAvailable: true,
          pictures: { main: 'products/available.jpg' },
        },
        { id: 8, name: 'Unavailable', price: 20, isAvailable: false },
      ],
    });

    expect(result).toEqual([{
      id: 7,
      name: 'Available',
      description: 'A product',
      price: 12.5,
      imageUrl: '/products/available.jpg',
    }]);
  });

  it('accepts a direct array response and normalizes image URL variants', () => {
    let result: unknown;
    service.products$.subscribe((products) => result = products);

    httpTestingController.expectOne(url).flush([
      { id: 'external', name: 'External', price: '10', imageUrl: 'https://cdn.example/image.jpg' },
      { slug: 'local', price: 0, imageUrl: '/assets/local.jpg' },
      { name: 'Fallback', price: 5, pictures: ['assets/fallback.jpg'] },
    ]);

    expect(result).toEqual([
      {
        id: 'external',
        name: 'External',
        description: 'A handmade favorite from Crafteez.',
        price: 10,
        imageUrl: 'https://cdn.example/image.jpg',
      },
      {
        id: 'local',
        name: 'Untitled product',
        description: 'A handmade favorite from Crafteez.',
        price: 0,
        imageUrl: '/assets/local.jpg',
      },
      {
        id: 'Fallback',
        name: 'Fallback',
        description: 'A handmade favorite from Crafteez.',
        price: 5,
        imageUrl: '/assets/fallback.jpg',
      },
    ]);
  });

  it('returns an empty list for an empty response wrapper', () => {
    let result: unknown;
    service.products$.subscribe((products) => result = products);
    httpTestingController.expectOne(url).flush({ products: [] });

    expect(result).toEqual([]);
  });

  it('rejects a product with a missing or invalid price', () => {
    spyOn(console, 'error');
    let receivedError: unknown;
    service.products$.subscribe({ error: (error) => receivedError = error });

    httpTestingController.expectOne(url).flush([{ id: 1, name: 'Invalid', price: 'not-a-price' }]);

    expect(receivedError).toEqual(jasmine.any(Error));
    expect(console.error).toHaveBeenCalled();
  });

  it('propagates an HTTP failure', () => {
    spyOn(console, 'error');
    let receivedError: unknown;
    service.products$.subscribe({ error: (error) => receivedError = error });

    httpTestingController.expectOne(url).flush('offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });

    expect((receivedError as { status: number }).status).toBe(503);
    expect(console.error).toHaveBeenCalled();
  });
});
