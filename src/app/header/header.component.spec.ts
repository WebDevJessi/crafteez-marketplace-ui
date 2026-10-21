import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the brand and primary navigation links', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Crafteez');
    expect(element.querySelectorAll('nav a').length).toBe(4);
    expect(Array.from(element.querySelectorAll('nav a')).map((link) => link.textContent?.trim()))
      .toEqual(['Home', 'Products', 'Cart', 'About']);
  });
});
