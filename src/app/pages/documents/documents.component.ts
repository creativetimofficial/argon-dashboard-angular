import { Component, OnInit } from "@angular/core";
import { ViewerType } from 'ngx-doc-viewer';

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent implements OnInit {
  docPath: any;
  fileContent: any;
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
  viewer: ViewerType;

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
  }

  //permet de gerer les fichers importés dans l'application
  async handleFiles(file: File) {
    this.name = file.name;
    this.type = file.type;
    this.size = file.size + "ko";
    this.docPath = URL.createObjectURL(file);

    if (this.name !== "") {
      this.display = true;
    }

    const fileContent = await this.readFileContent(file);
    this.fileContent = fileContent;
  }

  //cette fonction permet de recupérer le contenu d'un fichier
  private async readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = (e:any) => {

        const contentFile = new Blob([new Uint8Array(e.target.result)]); //, { type: 'application/pdf'}
        //this.docPath = URL.createObjectURL(contentFile);
        console.log(this.docPath);
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  onSubmit() {
    //const motCles = this.mot_cle.split(",");

    this.documents.push({
      name: this.name,
      type: this.typeDoc,
      size: this.size,
      statut: this.statut,
      mot_cles: this.mot_cle,
      fileContent: this.fileContent,
      docPath : this.docPath
    });
    //console.log(this.documents);
    this.contratArray = this.documents.filter((document) => {
      if (document.type === "contrat") {
        return document;
      }
    });
    this.name = "";
    this.typeDoc = "";
    this.size = "";
    this.statut = "";
    this.mot_cle = "";
    this.docPath = "";
    this.fileContent = null;
    this.total = this.documents.length; // Mettre à jour le nombre total d'éléments
    this.display = false;
  }

  // view contaning file in a specific folder
  clikedFolder() {
    this.display = true;
    this.displayInnerFolder = true;
    let selectFilesDiv = document.querySelector("#filePlusViewer") as HTMLElement; //<htmlElement>
    selectFilesDiv.style.height = "90vh";
  }

  // files in contrat
  countContrat() {
    return (this.contratLenght = this.contratArray.length);
  }

  // afficher un document dans la visionneuse
  viewFile() {
    let fileName = document.querySelector(".fileName").innerHTML.split(' ')[1];
    //let fileSize = document.querySelector(".fileSize").innerHTML;
    this.documents.find(document => {
      console.log("find");
      console.log(document, document.name, fileName);
      if (document.name === fileName) {
        console.log(document.fileContent, document.docPath);
        
        return (this.docPath = document.docPath);
      } else {
        console.log("error");
        
      }
    });
  }
}
