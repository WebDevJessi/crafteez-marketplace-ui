import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../shared/types/product.interface';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  const product: Product = {
    id: 'p1',
    name: 'Craft kit',
    description: 'A small kit',
    price: 15,
    imageUrl: '/assets/yarn-kit.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = product;
    fixture.detectChanges();
  });

  it('creates with a product', () => {
    expect(component).toBeTruthy();
  });

  it('emits the product when adding or removing a quantity', () => {
    const addSpy = jasmine.createSpy('add');
    const removeSpy = jasmine.createSpy('remove');
    component.addToCart.subscribe(addSpy);
    component.removeQuantity.subscribe(removeSpy);

    component.onAddToCart();
    component.onRemoveQuantity();

    expect(addSpy).toHaveBeenCalledOnceWith(product);
    expect(removeSpy).toHaveBeenCalledOnceWith(product);
  });

  it('shows the add action when quantity is zero', () => {
    expect(fixture.nativeElement.textContent).toContain('Add to cart');
    expect(fixture.nativeElement.querySelector('.quantity-controller')).toBeNull();
  });

  it('shows quantity controls when quantity is positive', () => {
    component.quantity = 3;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('3');
    expect(fixture.nativeElement.querySelector('.quantity-controller')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Add to cart');
  });
});
