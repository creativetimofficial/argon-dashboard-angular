import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-view-file-modal',
  templateUrl: './document-view-file-modal.component.html',
  styleUrls: ['./document-view-file-modal.component.scss']
})
export class DocumentViewFileModalComponent {
  @Input() filePath: string;

  constructor(public activeModal: NgbActiveModal) {}
}
