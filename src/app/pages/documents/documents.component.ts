import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ViewerType } from "ngx-doc-viewer";

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
  reponse: any;
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    
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
      docPath: this.docPath,
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
    let selectFilesDiv = document.querySelector(
      "#filePlusViewer"
    ) as HTMLElement; //<htmlElement>
    selectFilesDiv.style.height = "90vh";
  }

  // files in contrat
  countContrat() {
    return (this.contratLenght = this.contratArray.length);
  }

  // afficher un document dans la visionneuse
  viewFile() {
    let fileName = document.querySelector(".fileName").innerHTML.split(" ")[1];
    // const newtab = fileNameTab.filter( tabfileName => {
    //   if ( tabfileName !== " " ) {
    //     console.log(tabfileName);
    //     return 
    //   }
    // })
    // const fileName = "";
    // for(let i = 0; i<= newtab.length; i++){
    //   const fileName =+ newtab[i];
    //   console.log(fileName);
    //   return fileName
    // }
    //let fileSize = document.querySelector(".fileSize").innerHTML;
    this.documents.find((document) => {
      console.log("find");
      console.log(document, document.name, fileName);
      if (document.name === fileName) {
        console.log(document.fileContent, document.docPath, this.reponse);

        return this.docPath;
      } else {
        console.error("problème ");
      }
    });
  }
}
