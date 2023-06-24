import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesComponent } from './sites.component';

describe('SitesComponent', () => {
  let component: SitesComponent;
  let fixture: ComponentFixture<SitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SitesComponent]
    });
    fixture = TestBed.createComponent(SitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
