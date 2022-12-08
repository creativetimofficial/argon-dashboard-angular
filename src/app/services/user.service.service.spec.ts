import { TestBed } from '@angular/core/testing';

import {  UserService } from './user.service.service';

describe('User.ServiceService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
