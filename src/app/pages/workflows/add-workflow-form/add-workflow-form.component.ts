import { Component } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { ModalAssociateUserComponent } from "../modal-associate-user/modal-associate-user.component";
import { documents, Document, User } from "src/app/variables/charts";
import { ModalAddDocumentComponent } from "../modal-add-document/modal-add-document.component";
import { ModalAddTaskComponent } from "../modal-add-task/modal-add-task.component";
export interface Task {
  id?: number,
  titre?: string,
  detail?: string,
  statut?: string,
  priorite?: string;
  echeance?: Date,
  user?: User["id"],
  document?: Document["name"],
}

interface TaskUser {
  id_task: Task["id"];
  id_user: User["id"];
  ordre: number;
}

interface Workflow {
  id: number,
  titre: string,
  detail: string,
  priorite: string,
  echeance?: Date,
  statut: string,
  documents?: number[],
  users?: number[],
  tasks?: number[],
  taskUser?: TaskUser[]
}

@Component({
  selector: "app-add-workflow-form",
  templateUrl: "./add-workflow-form.component.html",
  styleUrls: ["./add-workflow-form.component.scss"],
})
export class AddWorkflowFormComponent {
  statut: string;
  priorite: string;
  message: any;
  titre: string;
  echeance: string;
  addDocuments: Document[];
  workflowUsers: User[];
  modalRef: any;

  usersWorkflow: User[] = [
    {id: 1, name: "zobel"}, {id:2, name: "ulrich"}
  ];
  tasksWorkflow: Task[] = [
    {id:1, titre: "t1"}, {id: 2, titre: 't2'}
  ];
  workflow: Workflow;
  userId: User["id"];
  documents: Document[] = documents;
  id_user: any;
  id_task: any;
  selectedUser: any[];
  selectedTask: any[];

  constructor(private modalService: NgbModal) {}

  addDoc() {}

  openModal(test: string) {
    if (test === "user") {
      this.modalRef = this.modalService.open(ModalAssociateUserComponent);
    } else if(test=== "file") {
      this.modalRef = this.modalService.open(ModalAddDocumentComponent);
    } else if (test === "task") {
      this.modalRef = this.modalService.open(ModalAddTaskComponent);
    }

    this.modalRef.componentInstance.title = "Mon titre";
    document.querySelector<HTMLElement>(".modal-backdrop").style.zIndex = "1";
    document
      .querySelector<HTMLElement>(".modal-dialog")
      .classList.add("modal-lg", "modal-dialog-scrollable");

    this.modalRef.result.then(
      (result: any) => {
        console.log(result);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  enregistrer() {
    const data = [];
    for (let i = 0; i < this.tasksWorkflow.length; i++) {
      data.push({id_user: this.selectedTask[i], id_task: this.selectedUser[i]});
    }
    console.log(data)

  }

  sendWorkflow() {
    
  }

  // submitForm() {
  //   const data = [];
  //   for (let i = 0; i < this.tasksWorkflow.length; i++) {
  //     const task = this.tasksWorkflow[i];
  //     const user = this.usersWorkflow[i];
  //     data.push({id_user: this.id_user, id_task: this.id_task});
  //   }
  //   console.log(data); // afficher les données dans la console
  //   // Ajouter ici le code pour enregistrer les données dans votre backend
  // }
}
