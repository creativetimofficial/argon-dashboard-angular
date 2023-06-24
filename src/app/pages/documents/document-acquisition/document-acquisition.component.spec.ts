import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAcquisitionComponent } from './document-acquisition.component';

describe('DocumentAcquisitionComponent', () => {
  let component: DocumentAcquisitionComponent;
  let fixture: ComponentFixture<DocumentAcquisitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentAcquisitionComponent]
    });
    fixture = TestBed.createComponent(DocumentAcquisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
