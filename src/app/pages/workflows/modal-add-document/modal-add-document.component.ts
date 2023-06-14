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
  search: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.searchFileResults = this.listFiles;
  }

  searchFileInput() {
    let results = this.listFiles.filter(fileResult =>
      fileResult.name.includes(this.search)
    );
    this.searchFileResults = results;
  }

  searchFile() {
    let results = this.listFiles.filter(fileResult =>
      fileResult.name.includes(this.search)
    );
    this.searchFileResults = results;
  }

  selectFile(id: number): void {
    let selectedFile = this.searchFileResults.find(selectedFile => {
      return selectedFile.id === id
    });

    if(!this.selectedFiles.includes(selectedFile)) {
      this.selectedFiles.push(selectedFile);
    }
  }

  deleteFile(id: number): void {
    let deletedFileId = this.selectedFiles.findIndex(file => file.id === id)
    this.selectedFiles.splice(deletedFileId, 1);
    
  }

  enregistrer() {
    this.workflowFiles = this.selectedFiles;
    this.activeModal.close('Close click')
  }
}
