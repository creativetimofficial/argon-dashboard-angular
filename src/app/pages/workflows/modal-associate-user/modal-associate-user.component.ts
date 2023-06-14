import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { users, User } from 'src/app/variables/charts';

@Component({
  selector: 'app-modal-associate-user',
  templateUrl: './modal-associate-user.component.html',
  styleUrls: ['./modal-associate-user.component.scss']
})
export class ModalAssociateUserComponent implements OnInit{
  listUsers: User[] = users;
  searchResults: User[] = [];
  selectedItems: User[] = [];
  workflowUsers: User[] = [];
  modal: NgbModalRef;
  searchForm: FormGroup;
  searchUser: string = '';

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.searchResults = this.listUsers;
  }

  searchInput() {
    let results = this.listUsers.filter(userResult => 
      userResult.name.includes(this.searchUser)
    )
    this.searchResults = results
  }

  search() {
    let results = this.listUsers.filter(userResult =>
      userResult.name.includes(this.searchUser)  
    )
    this.searchResults = results
  }

  selectUser(id: number) {
    // if(!this.selectedItems.includes(item)) {
    //   this.selectedItems.push(item);
    // }
  }

  deselectUser(id: number) {
    // const index = this.selectedItems.indexOf(item);
    // if(index !== -1) {
    //   this.selectedItems.splice(index, 1)
    // }
  }
}

