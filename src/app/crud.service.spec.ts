import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CrudService } from './crud.service';

describe('CrudService', () => {
  let service: CrudService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CrudService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('checks the backend connection', () => {
    let response: { message: string } | undefined;
    service.checkConnection().subscribe((value) => response = value);

    const request = httpTestingController.expectOne('http://localhost:5001/api/data');
    expect(request.request.method).toBe('GET');
    request.flush({ message: 'connected' });

    expect(response).toEqual({ message: 'connected' });
  });

  it('propagates connection failures', () => {
    let receivedError: unknown;
    service.checkConnection().subscribe({ error: (error) => receivedError = error });
    httpTestingController.expectOne('http://localhost:5001/api/data').flush('offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });

    expect((receivedError as { status: number }).status).toBe(503);
  });
});
