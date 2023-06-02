import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  docPath: string = "";
  name: string = "";
  type: string = "";
  size: string = "";
  typeDoc: string = "";
  statut: string = "";
  mot_cle: string = "";
  total: number;
  page = 1; // Page initiale
  display: boolean = false;
  displayInnerFolder: boolean = false;
  documents: any[] = [];
  contratArray: any[] = [];
  contratLenght: number;
  
  constructor() {}

  ngOnInit() {
    
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  fileDropped(event:any) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    const file = files[0];
    this.name = file.name;
    console.log(this.name);
    this.type = file.type;
    this.size = file.size+'ko';
    this.docPath = URL.createObjectURL(file);
    if (this.docPath !== "") {
      this.display = true;
    }
  }

  selectFile(): void {
    const input = document.createElement('input');
    input.type= 'file';
    input.style.display = 'none';
    input.accept = 'pdf, docx, xls'
    document.body.appendChild(input);
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      this.name = file.name;
      this.type = file.type;
      this.size = file.size+"ko";
      this.docPath = URL.createObjectURL(file);

      if (this.docPath !== "") {
        this.display = true;
      }
    }
    input.click();
  }

  onSubmit() {
    const motCles = this.mot_cle.split(',')
    this.documents.push({name: this.name, type: this.typeDoc, size: this.size, statut: this.statut, mot_cles: this.mot_cle})
    //console.log(this.documents);
    
    this.name = "";
    this.typeDoc = "";
    this.size = "";
    this.statut = "";
    this.mot_cle = "";
    this.total = this.documents.length; // Mettre à jour le nombre total d'éléments
    this.display = false;
  }

  clikedFolder() {
    this.contratArray = this.documents.filter(document=>{
      if(document.type === "contrat") {
        return document;
      }
    })
    this.display = true
    this.displayInnerFolder = true;
  }

  countContrat() {
    
    return  this.contratLenght = this.contratArray.length
    
  }
}
