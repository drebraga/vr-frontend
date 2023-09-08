import { TestBed } from '@angular/core/testing';

import { StoreProductsService } from './store-products.service';

describe('StoreProductsService', () => {
  let service: StoreProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
