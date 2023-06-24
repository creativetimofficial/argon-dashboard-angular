import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDossiersComponent } from './document-dossiers.component';

describe('DocumentDossiersComponent', () => {
  let component: DocumentDossiersComponent;
  let fixture: ComponentFixture<DocumentDossiersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentDossiersComponent]
    });
    fixture = TestBed.createComponent(DocumentDossiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
