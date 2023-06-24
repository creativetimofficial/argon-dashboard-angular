import { Component } from '@angular/core';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent {
  display: boolean = false;

  changeDisplay() {
    this.display = !this.display
    console.log(this.display);
    
  }

}
