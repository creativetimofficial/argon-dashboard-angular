import { Component, Input, Output,EventEmitter } from '@angular/core';
import { Document } from '../documents.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent {
  @Input() display: boolean;
  @Input() displayInnerFolder: boolean;
  @Input() typeDocArray: Document[];
  @Input() docPath: string;
  @Output() modifyDisplays = new EventEmitter< {boolean1: boolean, boolean2: boolean} >();
  // afficher un document dans la visionneuse
  viewFile(docPath: string) {
    this.docPath = docPath;
    // let fileName = document.querySelector(".fileName").innerHTML.split(" ")[1];
   
    // this.typeDocArray.find((typeDoc) => {
    //   console.log("find");
    //   console.log(typeDoc, typeDoc.name, fileName);
    //   if (typeDoc.name === fileName) {
    //     console.log(typeDoc.fileContent, typeDoc.docPath);

    //     return typeDoc.docPath;
    //   } else {
    //     console.error("problème ");
    //   }
    // });
  }

  changeDisplay() {
    const display = !this.display;
    const displayInnerFolder = !this.displayInnerFolder;
    this.modifyDisplays.emit({boolean1: display, boolean2: displayInnerFolder});
    // console.log(this.displayInnerFolder);
    // console.log(this.display);
    
    // this.displayInnerFolder = true;
    // this.display = false;
  }
}
