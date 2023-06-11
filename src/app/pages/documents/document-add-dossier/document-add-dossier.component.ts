import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentDossiersComponent } from '../document-dossiers/document-dossiers.component';

interface Dossier {
  type: string;
  numberOfFile: number;
}

@Component({
  selector: 'app-document-add-dossier',
  templateUrl: './document-add-dossier.component.html',
  styleUrls: ['./document-add-dossier.component.scss']
})
export class DocumentAddDossierComponent implements OnInit {
  //searchForm: FormGroup;
  newFolderName: string;
  @Output() nameFolderCreated = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit(): void {
  }

  createNewFolder(): void {
    this.nameFolderCreated.emit(this.newFolderName);

    this.activeModal.close();
  }
}
