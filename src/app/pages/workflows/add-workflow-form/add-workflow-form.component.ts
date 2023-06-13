import { Component } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { ModalAssociateUserComponent } from "../modal-associate-user/modal-associate-user.component";
import { documents, Document } from "src/app/variables/charts";
interface User {
  id: number;
  name: string;
}

interface Tache {
  titre: string;
  detail: string;
  echeance?: Date;
  user?: User["id"];
  document?: Document["name"];
}

@Component({
  selector: "app-add-workflow-form",
  templateUrl: "./add-workflow-form.component.html",
  styleUrls: ["./add-workflow-form.component.scss"],
})
export class AddWorkflowFormComponent {
  statut: any;
  priorite: any;
  message: any;
  titre: any;
  echeance: any;
  addDocuments: any;
  // modal: NgbModal;
  modalRef: any;
  //encapsulation: ViewEncapsulation.None;
  //closeResult: string;

  users: User[] = [
    { id: 1, name: "zobel" },
    { id: 2, name: "concepteur JS" },
    { id: 3, name: "ulrich" },
  ];
  taches: Tache[] = [
    {
      titre: "t1",
      detail: "test",
    },
    {
      titre: "t2",
      detail: "test2",
    },
    {
      titre: "t3",
      detail: "test3",
    },
    {
      titre: "t4",
      detail: "test4",
    },
  ];
  documents: Document[] = documents;
  constructor(private modalService: NgbModal) {}

  addDoc() {}

  openModal() {
    this.modalRef = this.modalService.open(ModalAssociateUserComponent);
    this.modalRef.componentInstance.title = "Mon titre";
    document.querySelector<HTMLElement>(".modal-backdrop").style.zIndex = "1";

    this.modalRef.result.then(
      (result) => {
        console.log(result);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
}
