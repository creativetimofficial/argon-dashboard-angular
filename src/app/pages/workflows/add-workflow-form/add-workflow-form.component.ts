import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';

import { ModalAssociateUserComponent } from '../modal-associate-user/modal-associate-user.component';

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
  // modal: NgbModal;
  modalRef: any;
  //encapsulation: ViewEncapsulation.None;
  //closeResult: string;

  constructor(private modalService: NgbModal) {}

  openModal() {
    
    this.modalRef = this.modalService.open(ModalAssociateUserComponent);
    this.modalRef.componentInstance.title = 'Mon titre';
    document.querySelector<HTMLElement>(".modal-backdrop").style.zIndex = "1";
    
    this.modalRef.result.then((result) => {
        console.log(result);
    }, (reason) => {
        console.log(reason);
    });
  }

  //ngOnInit() {}

  // openModal() {
  //   const dialogRef = this.dialog.open(ModalAssociateUserComponent, {
  //     //hasBackdrop: false,
  //     backdropClass: "modal-backdrop",
  //     panelClass: 'modal-dialog',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Modal result: ${result}`);
  //   });
  // }
  // openLg(content) {
	// 	this.modalService.open(content, { size: 'lg' });
	// }

  // openModalUser() {
  //   this.modalService.open(1);
  // }

  // closeModalUser(modalUser) {
  //   const modalRef = this.modalService.open(modalUser);
  //   modalRef.close;
  // }
}
