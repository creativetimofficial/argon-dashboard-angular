import { Component, OnInit } from '@angular/core';

interface Food{
  value:String,
  viewValue:String
}
@Component({
  selector: 'app-searchstudent',
  templateUrl: './searchstudent.component.html',
  styleUrls: ['./searchstudent.component.scss']
})
export class SearchstudentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
}
