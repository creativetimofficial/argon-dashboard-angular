import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-associate-user',
  templateUrl: './modal-associate-user.component.html',
  styleUrls: ['./modal-associate-user.component.scss']
})
export class ModalAssociateUserComponent implements OnInit{
  searchResults: string[] = [];
  selectedItems: string[] = [];
  modal: NgbModalRef;
  searchForm: FormGroup

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }

  ngOnInit(): void {
  }

  search() {
    this.searchResults = ["u1", "u2", "u3", "u4", "u5"];
  }

  selectItem(item: string) {
    if(!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    }
  }

  deselectItem(item: string) {
    const index = this.selectedItems.indexOf(item);
    if(index !== -1) {
      this.selectedItems.splice(index, 1)
    }
  }
}

