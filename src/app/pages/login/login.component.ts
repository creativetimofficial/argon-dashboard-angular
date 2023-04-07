import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  onButtonClick() {
    this.router.navigate(['dashboard']);
  }

}

