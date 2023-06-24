import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//import { users } from 'src/app/variables/charts';
import { User } from 'src/app/models/utilisateur.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-modal-associate-user',
  templateUrl: './modal-associate-user.component.html',
  styleUrls: ['./modal-associate-user.component.scss']
})
export class ModalAssociateUserComponent implements OnInit{
  listUsers: User[] = [];
  searchResults: User[] = [];
  selectedUsers: User[] = [];
  workflowUsers: User[] = [];
  modal: NgbModalRef;
  searchForm: FormGroup;
  searchUser: string = '';

  @Output() save = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<User[]>(environment.apiBaseUrl+'/users/all').subscribe((users) => this.listUsers = users)
    console.log(this.listUsers);
    
    this.searchResults = this.listUsers;
    this.workflowUsers = this.selectedUsers;
  }

  searchInput() {
    let results = this.listUsers.filter(userResult => 
      userResult.fonction.includes(this.searchUser)
    )
    this.searchResults = results
  }

  search() {
    let results = this.listUsers.filter(userResult =>
      userResult.username.includes(this.searchUser)  
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
    this.activeModal.dismiss()
  }
}

