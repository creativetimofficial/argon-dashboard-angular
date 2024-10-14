import { Component, OnInit, ElementRef, Input } from '@angular/core';
// import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RouteInfo } from 'src/app/models/util/routes.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // @Input() routes: RouteInfo[];

  public focus;
  public listTitles: any[];
  public location: Location;
  public urlParent: string = '';
  public fullName: string ='';
  public initials: string='';

  constructor(location: Location,  private element: ElementRef, private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.location = location;
  }
  

  ngOnInit() {

    this.fullName = this.authService.getUserFullName();
    this.initials = this.authService.getUserInitials();
    this.urlParent = this.activatedRoute.parent.toString();
    console.log(this.urlParent);
  }
  
  // getTitle(){
  //   const titlee = this.location.prepareExternalUrl(this.location.path()); //eg. /student/dashboard
  //   const titleArr = titlee.split("/");
  //   let title = "Dashboard";
  //   if (titleArr.length > 0) {
  //     title = titleArr.pop();
  //   }
  //   return title; // default  is Dashboard
  // }

  getTitle() {
    const titlee = this.location.prepareExternalUrl(this.location.path()); // Get the URL path
    const titleArr = titlee.split("/").filter(item => item); 
  
    let title = "Dashboard"; 
  
    if (titleArr.length >= 2) {
      title = `${titleArr[1]}`; // Start with the third element (e.g., "products")
      for (let i = 2; i < titleArr.length; i++) {
        title += ` > ${titleArr[i]}`; // Append the remaining parts (e.g., "wae")
      }
    } else if (titleArr.length === 2) {
      title = titleArr[1]; 
    }
  
    return title;
  }
 

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }

}
