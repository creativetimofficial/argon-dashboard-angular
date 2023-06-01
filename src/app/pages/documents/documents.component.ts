import { Component } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
  docPath: string = "";
  name: string = "";
  type: string = "";
  size: string = "";
  typeDoc: string = "";
  statut: string = "";
  mot_cle: string = "";
  display: boolean = false;
  documents: any[] = [];
  constructor() {}

  ngOnInit() {}

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
    this.size = file.size+'Ko';
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
      this.size = file.size+"Ko";
      this.docPath = URL.createObjectURL(file);

      if (this.docPath !== "") {
        this.display = true;
      }
    }
    input.click();
  }

  onSubmit() {
    const motCles = this.mot_cle.split(',')
    this.documents.push({name: this.name, type: this.typeDoc, size: this.size+'ko', statut: this.statut, mot_cles: motCles})
    console.log(this.documents);
    
    this.name = "";
    this.typeDoc = "";
    this.size = "";
    this.statut = "";
    this.mot_cle = "";
    this.display = false;
  }
}
