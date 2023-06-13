import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-document',
  templateUrl: './modal-add-document.component.html',
  styleUrls: ['./modal-add-document.component.scss']
})
export class ModalAddDocumentComponent implements OnInit {
  searchFileResults: object[] = [];
  selectedFiles: object[] = [];
  modal: NgbModalRef;
  searchForm: FormGroup;
  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {}
  
  ngOnInit(): void {
    this.searchFileResults = [
      {id: 1, name: "contrat de bail"},
      {id: 2, name: "Facture achats 06-062023"},
      {id: 3, name: "Demande permission"},
      {id: 4, name: "My best follow up"},

    ]
  }

  searchFile() {
    
  }
}

