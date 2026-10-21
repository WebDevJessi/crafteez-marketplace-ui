import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CheckoutService } from './checkout.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CheckoutService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('posts the Stripe token and product IDs with quantities', () => {
    const items = [{ productId: 42, quantity: 2 }];
    let response: unknown;

    service.makePayment('stripe-token', items).subscribe((value) => response = value);

    const request = httpTestingController.expectOne('http://localhost:5001/checkout');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ token: 'stripe-token', items });
    request.flush({ success: true });
    expect(response).toEqual({ success: true });
  });

  it('propagates a checkout API failure', () => {
    let receivedError: unknown;
    service.makePayment('stripe-token', []).subscribe({
      error: (error) => receivedError = error,
    });

    httpTestingController.expectOne('http://localhost:5001/checkout').flush('failed', {
      status: 400,
      statusText: 'Bad Request',
    });

    expect((receivedError as { status: number }).status).toBe(400);
  });
});
