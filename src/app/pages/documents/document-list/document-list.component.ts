import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent {
  @Input() displayInnerFolder: boolean;
  @Input() typeDocArray: [];
}
