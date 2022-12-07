import { TestBed } from '@angular/core/testing';

import { ChauffeursService } from './chauffeurs.service';

describe('ChauffeursService', () => {
  let service: ChauffeursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChauffeursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
