import { TestBed } from '@angular/core/testing';

import { CertificatService } from './certificat.service';

describe('CertificatService', () => {
  let service: CertificatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
