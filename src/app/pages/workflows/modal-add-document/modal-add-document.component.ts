import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { documents, Document } from "src/app/variables/charts";

@Component({
  selector: "app-modal-add-document",
  templateUrl: "./modal-add-document.component.html",
  styleUrls: ["./modal-add-document.component.scss"],
})
export class ModalAddDocumentComponent implements OnInit {
  listFiles: Document[] = documents;
  searchFileResults: Document[] = [];
  selectedFiles: Document[] = [];
  workflowFiles: Document[] = [];
  modal: NgbModalRef;
  searchForm: FormGroup;
  search: string;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.searchFileResults = this.listFiles;
  }

  searchFile(): Document[] {
    let results = this.listFiles.filter((fileResult) =>
      fileResult.name.includes(this.search)
    );
    console.log(results);
    return (this.searchFileResults = results);
  }

  selectFile(id: number): void {
    if ((this.searchFileResults.length = 1)) {
      let selectedFile = this.searchFileResults[0];
      this.selectedFiles.push(selectedFile);
    } else if (this.searchFileResults.length > 1) {
      let selectedFile = this.searchFileResults[id - 1];
      this.selectedFiles.push(selectedFile);
    } else {
      this.selectedFiles = [];
    }
  }

  deleteFile(id: number): void {
    //let deletedFile = this.selectedFiles[id-1];
    if(this.selectedFiles.length = 1) {
      let deletedFile = this.selectedFiles.splice(0, 1);
    }
    let deletedFile = this.selectedFiles.splice(id - 1, 1);
  }
}
