import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-workflow-form',
  templateUrl: './add-workflow-form.component.html',
  styleUrls: ['./add-workflow-form.component.scss']
})
export class AddWorkflowFormComponent {
  statut: any;
  priorite: any;
  message: any;
  titre: any;
  echeance: any;
  //encapsulation: ViewEncapsulation.None;
  //closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  openLg(content) {
		this.modalService.open(content, { size: 'lg' });
	}

  openModalUser() {
    this.modalService.open(1);
  }

  closeModalUser(modalUser) {
    const modalRef = this.modalService.open(modalUser);
    modalRef.close;
  }
}
