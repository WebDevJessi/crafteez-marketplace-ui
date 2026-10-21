import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CrudService } from './crud.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  const crudService = jasmine.createSpyObj<CrudService>('CrudService', ['checkConnection']);

  beforeEach(async () => {
    crudService.checkConnection.and.returnValue(of({ message: 'connected' }));
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), { provide: CrudService, useValue: crudService }],
    }).compileComponents();
  });

  afterEach(() => {
    crudService.checkConnection.calls.reset();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'crafteez-marketplace-ui' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('crafteez-marketplace-ui');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).not.toBeNull();
    expect(crudService.checkConnection).toHaveBeenCalledTimes(1);
  });
});
