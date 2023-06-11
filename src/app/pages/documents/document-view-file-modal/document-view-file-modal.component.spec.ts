import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewFileModalComponent } from './document-view-file-modal.component';

describe('DocumentViewFileModalComponent', () => {
  let component: DocumentViewFileModalComponent;
  let fixture: ComponentFixture<DocumentViewFileModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentViewFileModalComponent]
    });
    fixture = TestBed.createComponent(DocumentViewFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
