import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadSiteComponent } from './read-site.component';

describe('ReadSiteComponent', () => {
  let component: ReadSiteComponent;
  let fixture: ComponentFixture<ReadSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadSiteComponent]
    });
    fixture = TestBed.createComponent(ReadSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
