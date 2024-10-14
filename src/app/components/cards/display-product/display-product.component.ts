import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-display-product',
  templateUrl: './display-product.component.html',
  styleUrl: './display-product.component.scss'
})
export class DisplayProductComponent implements OnInit{



  @Input() product: any;
  @Output() select = new EventEmitter<any>();

  onSelect() {
    this.select.emit(this.product);
  }

  ngOnInit(): void {
    console.log(this.product)
  }

}
