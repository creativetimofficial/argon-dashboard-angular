import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentAddDossierComponent } from "../document-add-dossier/document-add-dossier.component";

interface Dossier {
  type: string;
  numberOfFile: number;
}
@Component({
  selector: "app-document-dossiers",
  templateUrl: "./document-dossiers.component.html",
  styleUrls: ["./document-dossiers.component.scss"],
})
export class DocumentDossiersComponent implements OnInit {
  //@Input() countDoc: () => number;
  @Input() dossier: Dossier;
  @Output() folderClicked = new EventEmitter<string>();
  @Input() dossiers: Dossier[] = [];
  closeResult = ''
  modalRef: any;

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
  }

  clikedFolder(docType: Dossier["type"]) {
    this.folderClicked.emit(docType);
  }

  addNewFolder() {}

  openModal() {
    
    this.modalRef = this.modalService.open(DocumentAddDossierComponent);
    this.modalRef.componentInstance.title = 'Nouveau ';
    this.modalRef.componentInstance.nameFolderCreated.subscribe((data: string) => {
      this.createFolder(data);
    })
    document.querySelector<HTMLElement>(".modal-backdrop").style.zIndex = "1";
    
    this.modalRef.result.then((result) => {
        console.log(result);
    }, (reason) => {
        console.log(reason);
    });
  }

  createFolder(data: string) {
    this.dossiers.push(
      {type: data, numberOfFile: 0}
    );
  }

}
