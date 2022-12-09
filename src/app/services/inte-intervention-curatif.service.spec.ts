import { TestBed } from '@angular/core/testing';

import { InteInterventionCuratifService } from './inte-intervention-curatif.service';

describe('InteInterventionCuratifService', () => {
  let service: InteInterventionCuratifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteInterventionCuratifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
