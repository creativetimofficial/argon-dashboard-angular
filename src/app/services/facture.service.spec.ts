import { TestBed } from '@angular/core/testing';

import { FactureService } from './facture.service';

describe('FactureService', () => {
  let service: FactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
