import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSiteComponent } from './update-site.component';

describe('UpdateSiteComponent', () => {
  let component: UpdateSiteComponent;
  let fixture: ComponentFixture<UpdateSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSiteComponent]
    });
    fixture = TestBed.createComponent(UpdateSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
