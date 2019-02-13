import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  public copy: string;

  constructor() { }

  ngOnInit() {
  }
  onClick(event){
    var target = event.target;

    target.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });
    var ok = target.getAttribute('data-clipboard-text');
    console.log(ok)
    this.copy = ok;
  }
}
