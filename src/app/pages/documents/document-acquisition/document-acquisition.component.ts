import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-document-acquisition',
  templateUrl: './document-acquisition.component.html',
  styleUrls: ['./document-acquisition.component.scss']
})

export class DocumentAcquisitionComponent {
  @Input() page: number;
  @Input() documents: any[] = [];
  @Input() name: string;
  @Input() type: string;
  @Input() size: string;
  typeDoc: string = 'Tout';
  @Input() docPath: string;
  @Input() countDoc: () => void;
  //@Input() typeDocArrayLength: number;

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  fileDropped(event: any) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    const file = files[0];

    this.handleFiles(file);
  }

  selectFile(): void {
    const input = document.createElement("input");
    input.type = "file";
    input.name = "file";
    input.style.display = "none";
    input.accept = "pdf";
    document.body.appendChild(input);
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      this.handleFiles(file);
    };
    input.click();

    this.countDoc();
    // this.http
    //   .get("http://10.0.100.111:8080/files/view", { responseType: "arraybuffer" })
    //   .subscribe(
    //     (response) => {
    //       const blob = new Blob([response], {type: 'application/pdf'});
    //       console.log(blob);
          
    //       this.docPath = URL.createObjectURL(blob);
    //       console.log(this.docPath);
          
    //     }, (error) => {
    //       console.log(error);
          
    //     }
    //   );
  }

  //permet de gerer les fichers importés dans l'application
  async handleFiles(file: File) {
    this.name = file.name;
    this.type = file.type.split('application/')[1]
    console.log(this.type);
    
    const sizeKilo = file.size
    console.log(sizeKilo);
    
    this.size = sizeKilo+"";
    this.docPath = URL.createObjectURL(file);

    this.documents.push({
      name: this.name,
      type: this.type,
      size: this.size,
      typeDoc : this.typeDoc,
      //action: this.action,
      docPath: this.docPath,
    });

    //this.typeDocArrayLength = this.documents.length

    //this.docPath = "http://10.0.100.111:8080/files/view"; //URL.createObjectURL(file);
    //console.log(this.docPath);

    // if (this.name !== "") {
    //   this.display = true;
    // }

    // const fileContent = await this.readFileContent(file);
    // this.fileContent = fileContent;
  }

  //cette fonction permet de recupérer le contenu d'un fichier
  // private async readFileContent(file: File): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onload = (e: any) => {
  //       const contentFile = new Blob([new Uint8Array(e.target.result)]); //, { type: 'application/pdf'}
  //       this.docPath = URL.createObjectURL(contentFile);

  //       resolve(reader.result as string);
  //     };

  //     reader.onerror = () => {
  //       reject(reader.error);
  //     };

  //     reader.readAsArrayBuffer(file);
  //   });
  // }

  //  selectFile() {
  //     this.buttonClicked.emit();
  //  }

  //  fileDropped(event: any) {
  //   this.buttonClicked.emit();
  //  }
}
