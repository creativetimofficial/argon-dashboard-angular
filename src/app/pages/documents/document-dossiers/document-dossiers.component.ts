import { Component, EventEmitter, Output } from "@angular/core";

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
  @Output() buttonClicked = new EventEmitter<void>();
  dossiers: Dossier[] = [
    { type: "Tout", numberOfFile: 0 },
    { type: "Contrats", numberOfFile: 0 },
    { type: "Factures", numberOfFile: 0 },
    { type: "Payements", numberOfFile: 0 },
  ];

  clikedFolder() {
    this.buttonClicked.emit();
  }
  
}
