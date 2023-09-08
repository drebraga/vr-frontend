import { TestBed } from '@angular/core/testing';

import { StoreModalService } from './store-modal.service';

describe('StoreModalService', () => {
  let service: StoreModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
