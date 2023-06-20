import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() save = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.searchResults = this.listUsers;
    this.workflowUsers = this.selectedUsers;
  }

  searchInput() {
    let results = this.listUsers.filter(userResult => 
      userResult.service.includes(this.searchUser)
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

    // test sur l'utilisitaeur, là on verifie s'il existe dans le tableau avant de l'ajouter
    if(!this.selectedUsers.includes(selectedUser)) {
      this.selectedUsers.push(selectedUser);
      this.workflowUsers = this.selectedUsers
    }
  }

  deselectUser(id: number) {
    let deselectedUserId = this.selectedUsers.findIndex(user => user.id === id)
    this.selectedUsers.splice(deselectedUserId, 1);
    this.workflowUsers = this.selectedUsers;
  }

  enregistrer() {
    this.workflowUsers = this.selectedUsers;
    console.log(this.workflowUsers);
    
    this.save.emit(this.workflowUsers);
    this.activeModal.close()
  }
}

