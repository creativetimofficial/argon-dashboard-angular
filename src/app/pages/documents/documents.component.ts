import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ViewerType } from "ngx-doc-viewer";
import { documents } from "src/app/variables/charts";


export interface Dossier {
  type: string;
  numberOfFile: number;
}


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
  display: boolean = true;
  displayInnerFolder: boolean = false;
  
  //typeDocArrayLength: number = 0;
  dossiers: Dossier[] = [
    { type: "Tout", numberOfFile: 0},
    { type: "Contrats", numberOfFile: 0},
    { type: "Factures", numberOfFile: 0},
    { type: "Payements", numberOfFile: 0},
  ];
  documents = documents;

  typeDocArray: any[] = [];
  
  viewer: ViewerType;
  reponse: any;
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.countDoc()
    
  }

  // onSubmit() {
  //   //const motCles = this.mot_cle.split(",");

  //   this.documents.push({
  //     name: this.name,
  //     typeDoc: this.typeDoc,
  //     type: this.type, 
  //     size: this.size,
  //     statut: this.statut,
  //     mot_cles: this.mot_cle,
  //     docPath: this.docPath,
  //   });
  //   //console.log(this.documents);
  //   this.typeDocArray = this.documents.filter((document) => {
  //     if (document.type === "contrat") {
  //       return document;
  //     }
  //   });
  //   this.name = "";
  //   this.typeDoc = "";
  //   this.size = "";
  //   this.statut = "";
  //   this.mot_cle = "";
  //   this.docPath = "";
  //   this.fileContent = null;
  //   this.total = this.documents.length; // Mettre à jour le nombre total d'éléments
  //   this.display = false;
  // }

  // view contaning file in a specific folder
  clikedFolder(docType: string) {
    this.selectFolderAndCreateArray(docType);

    this.display = false;
    this.displayInnerFolder = true;
    let selectFilesDiv = document.querySelector(
      "#filePlusViewer"
    ) as HTMLElement; //<htmlElement>
    selectFilesDiv.style.height = "90vh";
  }

  selectFolderAndCreateArray(doctype: string) {
    this.handleFolderCliked(doctype);
  }

  handleFolderCliked(docType: string) {
    //this.documents.filter(document => document.typeDoc)
    this.typeDocArray = this.documents.filter(document => document.typeDoc === docType);
    return this.documents.filter(document => document.typeDoc === docType);
  }

  // files in contrat
  countDoc() {
    for(let i = 0; i < this.dossiers.length ; i++) {
      
      const docType = this.dossiers[i].type
      const arraylength = this.handleFolderCliked(docType).length
      this.dossiers[ i].numberOfFile = arraylength;
    }
  }

  // // afficher un document dans la visionneuse
  // viewFile(docPath) {
  //   let fileName = document.querySelector(".fileName").innerHTML.split(" ")[1];
  //   // const newtab = fileNameTab.filter( tabfileName => {
  //   //   if ( tabfileName !== " " ) {
  //   //     console.log(tabfileName);
  //   //     return 
  //   //   }
  //   // })
  //   // const fileName = "";
  //   // for(let i = 0; i<= newtab.length; i++){
  //   //   const fileName =+ newtab[i];
  //   //   console.log(fileName);
  //   //   return fileName
  //   // }
  //   //let fileSize = document.querySelector(".fileSize").innerHTML;
  //   this.documents.find((document) => {
  //     console.log("find");
  //     console.log(document, document.name, fileName);
  //     if (document.name === fileName) {
  //       console.log(document.fileContent, document.docPath, this.reponse);

  //       return document.docPath;
  //     } else {
  //       console.error("problème ");
  //     }
  //   });
  // }
}
