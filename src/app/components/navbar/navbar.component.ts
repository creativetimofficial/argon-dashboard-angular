import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public genericPath: string;
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
          this.genericPath = "/"+this.listTitles[item].title.toLowerCase() 
          return this.listTitles[item].title;
        } else if(titlee === "/workflows/inities") {
          this.genericPath = "/workflows/inities"
          return "Workflow initiés"
        } else if(titlee === "/workflows/attribuees") {
          this.genericPath = "/workflows/attribuees"
          return "Tâches attribuées"
        }
    }
    return 'Dashboard';
  }

}
