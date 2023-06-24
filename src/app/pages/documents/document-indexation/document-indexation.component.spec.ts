import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentIndexationComponent } from './document-indexation.component';

describe('DocumentIndexationComponent', () => {
  let component: DocumentIndexationComponent;
  let fixture: ComponentFixture<DocumentIndexationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentIndexationComponent]
    });
    fixture = TestBed.createComponent(DocumentIndexationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
