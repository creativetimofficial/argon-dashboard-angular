import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAddDossierComponent } from './document-add-dossier.component';

describe('DocumentAddDossierComponent', () => {
  let component: DocumentAddDossierComponent;
  let fixture: ComponentFixture<DocumentAddDossierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentAddDossierComponent]
    });
    fixture = TestBed.createComponent(DocumentAddDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
