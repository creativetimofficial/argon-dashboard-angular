import { Component, EventEmitter, Input, Output } from "@angular/core";

interface Dossier {
  type: string;
  numberOfFile: number;
}
@Component({
  selector: "app-document-dossiers",
  templateUrl: "./document-dossiers.component.html",
  styleUrls: ["./document-dossiers.component.scss"],
})
export class DocumentDossiersComponent {
  //@Input() countDoc: () => number;
  @Input() dossier: Dossier;
  @Output() folderClicked = new EventEmitter<string>();
  @Input() dossiers: Dossier[] = [];

  clikedFolder(docType: Dossier["type"]) {
    this.folderClicked.emit(docType);
  }

  addNewFolder() {}
  // callCountMethod() {
  //   this.countDoc();
  // }
  
}
