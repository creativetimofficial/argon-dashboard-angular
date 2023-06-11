import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentViewFileModalComponent } from '../document-view-file-modal/document-view-file-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var window: any;
@Component({
  selector: 'app-document-acquisition',
  templateUrl: './document-acquisition.component.html',
  styleUrls: ['./document-acquisition.component.scss'],
})

export class DocumentAcquisitionComponent implements OnInit {
  @Input() page: number;
  @Input() documents: any[] = [];
  @Input() name: string;
  @Input() type: string;
  @Input() size: string;
  typeDoc: string = 'Tout';
  @Input() docPath: string;
  @Input() countDoc: () => void;
  formModal: any;
  @Output() viewIconCliked = new EventEmitter<string>();

  private request: string = "http://10.0.100.115:8080";
  //@Input() typeDocArrayLength: number;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  } 

  ngOnInit(): void {
    //this.loadFile("manuella.pdf");
  }

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
    const formData = this.createFormData(files);
    this.sendFile(formData)
    
    this.handleFiles(file);
  }

  selectFile(): void {
    const input = document.createElement("input");
    input.type = "file";
    input.setAttribute('multiple', 'true');
    input.name = "file";
    input.style.display = "none";
    input.accept = "pdf";
    document.body.appendChild(input);
    input.onchange = (event: any) => {
      const files = event.target.files;
      const file = files[0];
      const formData = this.createFormData(files);
      //envois du contenu de l'input(fichiers) au backend
      //this.sendFile(formData)
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

  createFormData(files: File[]) {
    const formData = new FormData;

      for( let file of files) {
        formData.append( 'files', file, file.name )
      }
      return formData;
  }

  sendFile(formData: FormData){
    this.http.post(this.request+"/files/uploadM", formData).subscribe(response => {
      //console.log(response);
    })
  }

  loadFile(fileName: string) {
    return this.http.get(this.request+"/files/view/"+fileName).subscribe(  //{responseType: "blob"}
      (res: any) => {
        this.docPath = res.url
        // const file = new Blob([res], { type: 'application/pdf' });
        // const fileURL = URL.createObjectURL(file);
        // this.docPath = fileURL;
      }
    );
  }
    // .subscribe(response => {
    //   console.log(response);
    // })

  //permet de gerer les fichers importés dans l'application
  async handleFiles(file: File) {
    this.name = file.name;
    this.type = file.type.split('application/')[1]
    
    const sizeKilo = file.size
    this.size = sizeKilo+"";
    this.docPath = URL.createObjectURL(file);

    this.documents.push({
      name: this.name,
      type: this.type,
      size: this.size,
      typeDoc : this.typeDoc,
      //action: this.action,
      //docPath: this.docPath,
      docPath: this.docPath //this.http.get(this.request+"/files/view/manuella.pdf")     //this.loadFile('manuella.pdf')
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

  deleteFile(name: string) {
    const indexFile = this.documents.indexOf(name);
    console.log(indexFile);
    
    let deletedFile = this.documents.splice(indexFile, 1);
    deletedFile = null;
    console.log(this.documents);
  }

  indexation() {

  }

  viewFile(filePath: string) {
    const modalRef = this.modalService.open(DocumentViewFileModalComponent);
    modalRef.componentInstance.filePath = filePath;
    document.querySelector<HTMLElement>(".modal-backdrop").style.zIndex = "1";
    document.querySelector<HTMLElement>(".modal-dialog").classList.add("modal-lg", "modal-dialog-scrollable");
    // document.querySelector<HTMLElement>("#viewer").style.height = "800px";
    // document.querySelector<HTMLElement>("#toolbar").style.display = "block";
    //modal-dialog-scrollable
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
