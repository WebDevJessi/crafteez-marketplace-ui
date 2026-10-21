import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([]),
      ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    httpTestingController.expectOne('http://localhost:5001/api/products').flush({ value: [] });
    expect(component).toBeTruthy();
  });

  it('shows loading status until products arrive', () => {
    expect(fixture.nativeElement.textContent).toContain('Loading favorites');
    httpTestingController.expectOne('http://localhost:5001/api/products').flush({ value: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Loading favorites');
    expect(fixture.nativeElement.textContent).toContain('There are no featured products right now.');
  });

  it('shows the first four available products and their API prices', () => {
    const productsRequest = httpTestingController.expectOne('http://localhost:5001/api/products');
    productsRequest.flush({
      value: [
        { id: 1, name: 'First', price: 21, isAvailable: true },
        { id: 2, name: 'Second', price: 22, isAvailable: true },
        { id: 3, name: 'Third', price: 23, isAvailable: true },
        { id: 4, name: 'Fourth', price: 24, isAvailable: true },
        { id: 5, name: 'Fifth', price: 25, isAvailable: true },
        { id: 6, name: 'Unavailable', price: 26, isAvailable: false },
      ],
    });
    fixture.detectChanges();

    expect(component.featuredProducts.map((product) => product.name)).toEqual([
      'First',
      'Second',
      'Third',
      'Fourth',
    ]);
    expect(fixture.nativeElement.textContent).toContain('$21');
    expect(fixture.nativeElement.textContent).not.toContain('Fifth');
    expect(fixture.nativeElement.textContent).not.toContain('Unavailable');
  });

  it('shows a helpful message when the product API fails', () => {
    spyOn(console, 'error');
    httpTestingController
      .expectOne('http://localhost:5001/api/products')
      .flush('API unavailable', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Featured products are temporarily unavailable.',
    );
  });
});
