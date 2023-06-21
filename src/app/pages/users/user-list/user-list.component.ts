import { Component } from '@angular/core';
import { User } from 'src/app/models/utilisateur.model';
import { users } from 'src/app/variables/charts';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  users: User[] = users;
}
