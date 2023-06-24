import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/utilisateur/utilisateur.service';
import { environment } from 'src/environments/environment';

interface Role {
  id?: number,
  titre?: string,
  description?: string,
}

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.scss']
})
export class AddUserFormComponent implements OnInit {
  roles: Role[];
  nom: string;
  prenom: string;
  email: string;
  username: string;
  fonction: string;
  role_id: number;
  user: any;

  constructor(private http: HttpClient, private userService : UserService) {}

  ngOnInit(): void {
    this.http.get<Role[]>(environment.apiBaseUrl+'/roles/all').subscribe(roles => {
      this.roles = roles
      console.log(this.roles);
      
    })
  }

  enregistrer() {
    console.log(this.role_id);
    
    this.user = {
      noms: this.nom+' '+this.prenom,
      email: this.email,
      username: this.username,
      fonction: this.fonction,
      role: {id: this.role_id}
    }

    this.userService.createUser(this.user);

    // this.http.post(environment.apiBaseUrl+'/users/add', this.user).subscribe(response => 
    //     console.log(response)
        
    //   );
  }


}
