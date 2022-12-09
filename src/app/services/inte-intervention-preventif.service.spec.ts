import { TestBed } from '@angular/core/testing';

import { InteInterventionPreventifService } from './inte-intervention-preventif.service';

describe('InteInterventionPreventifService', () => {
  let service: InteInterventionPreventifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteInterventionPreventifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
