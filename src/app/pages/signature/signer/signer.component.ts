import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signer',
  templateUrl: './signer.component.html',
  styleUrls: ['./signer.component.scss']
})
export class SignerComponent implements OnInit {
  formModal: any;
  basUrl: string = environment.apiBaseUrl;
  name: string;
  type: string;
  size: string;
  docPath: string;
  displayViewer: boolean = false;
  @ViewChild('signatureCanvas', { static: true }) signatureCanvas: ElementRef;
  private signatureLocation: {x: number, y: number} = {x: 0, y: 0};
  private isSelected: boolean = false;
  selectedAreaLeft: number;
  selectedAreaTop: number;
  selectedAreaWidth: number;
  selectedAreaHeight: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  onDocumentClick(event: MouseEvent) {
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(x, y);
    
    this.selectedAreaLeft = x;
  this.selectedAreaTop = y;
  this.selectedAreaWidth = 100; // Remplacer par la largeur de la zone sélectionnée
  this.selectedAreaHeight = 50; // Remplacer par la hauteur de la zone sélectionnée
  setTimeout(() => {
    this.selectedAreaLeft = null;
    this.selectedAreaTop = null;
    this.selectedAreaWidth = null;
    this.selectedAreaHeight = null;
  }, 5000);
    // recuperer les coodonnées de l'emplacement cliqué 
    // const rect = this.signatureCanvas.nativeElement.getBoundingClientRect();
    // this.signatureLocation.x = event.clientX - rect.left;
    // this.signatureLocation.y = event.clientY - rect.top;

    //ajouter la classe css pour le contour de la zone de signature 
    this.isSelected = true;
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
      if(file) {
        this.displayViewer = !this.displayViewer
      }
    };
    input.click();
  }

  async handleFiles(file: File) {
    this.name = file.name;
    this.type = file.type.split('application/')[1]
    
    const sizeKilo = file.size
    this.size = sizeKilo+"";
    this.docPath = URL.createObjectURL(file);
  }

  createFormData(files: File[]) {
    const formData = new FormData;

      for( let file of files) {
        formData.append( 'files', file, file.name )
      }
      return formData;
  }

  sendFile(formData: FormData){
    this.http.post(this.basUrl+"/files/uploadM", formData).subscribe(response => {
      //console.log(response);
    })
  }

  // loadFile(fileName: string) {
  //   return this.http.get(this.request+"/files/view/"+fileName).subscribe(  //{responseType: "blob"}
  //     (res: any) => {
  //       this.docPath = res.url
  //       // const file = new Blob([res], { type: 'application/pdf' });
  //       // const fileURL = URL.createObjectURL(file);
  //       // this.docPath = fileURL;
  //     }
  //   );
  // }
}

