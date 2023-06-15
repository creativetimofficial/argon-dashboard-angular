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
  selectedUsers: User[] = [];
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
    let selectedUser = this.searchResults.find(selectedUser => {
      return selectedUser.id === id
    });

    if(!this.selectedUsers.includes(selectedUser)) {
      this.selectedUsers.push(selectedUser);
    }
  }

  deselectUser(id: number) {
    let deselectedUserId = this.selectedUsers.findIndex(user => user.id === id)
    this.selectedUsers.splice(deselectedUserId, 1);
  }

  enregistrer() {
    this.workflowUsers = this.selectedUsers;
    this.activeModal.close('Close click')
  }
}

