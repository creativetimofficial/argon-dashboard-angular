import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { ModalAssociateUserComponent } from "../modal-associate-user/modal-associate-user.component";
import { documents, Document, User } from "src/app/variables/charts";
import { ModalAddDocumentComponent } from "../modal-add-document/modal-add-document.component";
import { ModalAddTaskComponent } from "../modal-add-task/modal-add-task.component";
export interface Task {
  id?: number;
  titre?: string;
  detail?: string;
  statut?: string;
  priorite?: string;
  echeance?: Date;
  user?: User["id"];
  document?: Document["name"];
}

interface TaskUser {
  id_task: Task["id"];
  id_user: User["id"];
  //ordre?: number;
}

interface Workflow {
  id: number;
  titre: string;
  detail: string;
  priorite: string;
  echeance?: Date;
  statut: string;
  documents?: number[];
  users?: number[];
  tasks?: number[];
  taskUser?: TaskUser[];
}

@Component({
  selector: "app-add-workflow-form",
  templateUrl: "./add-workflow-form.component.html",
  styleUrls: ["./add-workflow-form.component.scss"],
})
export class AddWorkflowFormComponent implements OnInit {
  statut: string;
  priorite: string;
  message: any;
  titre: string;
  echeance: string;
  addDocuments: Document[];
  workflowUsers: User[];
  tasksWorkflow: Task[] = [
    { id: 1, titre: "t1" },
    { id: 2, titre: "t2" },
    { id: 3, titre: "t3" },
    { id: 4, titre: "t4" }
  ];
  usersWorkflow: User[] = [
    { id: 1, name: "zobel" },
    { id: 2, name: "ulrich" },
  ];

  //les tableaux pour stocker les paires task-user et les tâches disponibles
  availableTasks: Task[] = this.tasksWorkflow;
  taskUser: TaskUser[] = [];

  modalRef: any;
  workflow: Workflow;
  //userId: User["id"];
  documents: Document[] = documents;

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
  }

  addDoc() {}

  openModal(test: string) {
    if (test === "user") {
      this.modalRef = this.modalService.open(ModalAssociateUserComponent);
    } else if (test === "file") {
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

  // Fonction appelée lorsqu'une tâche est sélectionnée
  onTaskSelect(task_id: number, index: number) {
    // Trouver la tâche sélectionnée
    console.log(task_id);
    
    const task = this.availableTasks.find(task => task.id === task_id);
    console.log(this.availableTasks);
    
    console.log(task.id);
    
    if (!task) {
      return "error";
    }
    // Ajouter l'id de la tache selectionnée dans le tableau des paire taskUser
    this.taskUser.push({ ...this.taskUser[index], id_task: task.id });
    console.log(this.taskUser);
    //this.availableTasks = this.availableTasks.filter(task => task.id !== task_id)
    this.availableTasks.splice(this.availableTasks.indexOf(task), 1);
    //availableTaskList.splice(availableTaskList.indexOf(task), 1);
    console.log(this.availableTasks);
    
  }

  // Fonction appelée lorsqu'un user est sélectionnée
  onUserSelect(user_id: number, index: number) {
    const user = this.usersWorkflow.find((u) => u.id === user_id);
    //console.log(user);
    
    if (!user) {
      return "error";
    }
    this.taskUser.push({ ...this.taskUser[index], id_user: user.id });
    console.log(this.taskUser);
    
  }

  enregistrer() {
    console.log(this.taskUser);
  }

  sendWorkflow() {}

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
