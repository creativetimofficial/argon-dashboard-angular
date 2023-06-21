import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { ModalAssociateUserComponent } from "../modal-associate-user/modal-associate-user.component";
import { documents, Document } from "src/app/variables/charts";
import { ModalAddDocumentComponent } from "../modal-add-document/modal-add-document.component";
import { ModalAddTaskComponent } from "../modal-add-task/modal-add-task.component";
import { Workflow } from "src/app/models/workflow.model";
import { Task } from "src/app/models/tache.model";
import { User } from "src/app/models/utilisateur.model";
// export interface Task {
//   id?: number;
//   titre?: string;
//   detail?: string;
//   statut?: string;
//   priorite?: string;
//   echeance?: Date;
//   user?: User["id"];
//   document?: Document["name"];
// }

// interface TaskUser {
//   id_task: Task["id"];
//   id_user: User["id"];
//   //ordre?: number;
// }

// interface Workflow {
//   id: number;
//   titre: string;
//   detail: string;
//   priorite: string;
//   echeance?: Date;
//   statut: string;
//   documents?: number[];
//   users?: number[];
//   tasks?: number[];
//   taskUser?: TaskUser[];
// }

@Component({
  selector: "app-add-workflow-form",
  templateUrl: "./add-workflow-form.component.html",
  styleUrls: ["./add-workflow-form.component.scss"],
})
export class AddWorkflowFormComponent implements OnInit {
  statut: string;
  priorite: string;
  message: string;
  titre: string;
  echeance: Date;
  addDocuments: Document[];
  id: number = 0;
  workflowUsers: User[] = [];

  modalRef: any;
  documents: Document[] = documents;

  workflow: Workflow = {
    id: this.id++,
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: null,
    tasks: [],
    documents: []
  };
  task: Task = {
    id: null,
    title: "",
    description: "",
    status: "",
    //assignedFunction: { id: null, title: "" },
    users: [],
    order: null,
  };

  workflowTask: Task[] = [];

  // addTask(task: Task): void {
  //   this.workflowTask.push(task);
  //   console.log(this.workflowTask);

  //   this.workflow.tasks = this.workflowTask
  //   //this.workflow.tasks.push(this.task);
  //   console.log(this.workflow);

  // }

  numTasks: number;

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {}

  createTasks() {
    if (this.numTasks && this.numTasks > 0) {
      if (this.workflowTask.length > 0) {
        this.workflowTask = [];
        for (let i = 1; i <= this.numTasks; i++) {
          this.workflowTask.push({
            id: i,
            title: "",
            description: "",
            status: "",
            users: [],
            order: null,
          });
        }
      } else if (this.workflowTask.length === 0) {
        for (let i = 1; i <= this.numTasks; i++) {
          this.workflowTask.push({
            id: i,
            title: "",
            description: "",
            status: "",
            users: [],
            order: null,
          });
        }
      }
    }
  }

  openModal(test: string, id_task?: number) {
    if (test === "user") {
      this.modalRef = this.modalService.open(ModalAssociateUserComponent);
      this.modalRef.componentInstance.save.subscribe(
        (workflowUsers: User[]) => {

          for (let user of workflowUsers) {

            const existingUser = this.workflowUsers.find(u => u.id === user.id);
            if(existingUser) {
              existingUser.taches.push(id_task);
            } else {
              this.workflowUsers.push({...user, taches: [id_task]});
            }
            //user = { ...user, id_tache: id_task };
            console.log(this.workflowUsers);
          }

          // for (let user of workflowUsers) {
          //   user = { ...user, id_tache: id_task };
          //   this.workflowUsers.push(user);
          // }
        }
      );
    } else if (test === "file") {
      this.modalRef = this.modalService.open(ModalAddDocumentComponent);
    } else if (test === "task") {
      this.modalRef = this.modalService.open(ModalAddTaskComponent);
    }

    this.modalRef.componentInstance.title = "Mon titre";
    document.querySelector<HTMLElement>(".modal-backdrop").style.zIndex = "1";
    document
      .querySelector<HTMLElement>(".modal-dialog")
      .classList.add("modal-lg");

    document
      .querySelector<HTMLElement>(".modal-dialog")
      .classList.add("modal-dialog-scrollable");

    this.modalRef.result.then(
      (result: any) => {
        console.log(result);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  saveTasks() {
    if (this.workflowTask && this.workflowTask.length > 0) {
      if (!this.workflow.tasks) {
        this.workflow.tasks = [];
      }
      this.workflowTask.forEach((task: Task, index: number) => {
        console.log(task);
        
        if (
          task.title &&
          task.description &&
          task.users &&
          task.order
        ) {
          console.log(this.workflowUsers);
          let taskUsers = this.workflowUsers.filter(
            (user) => user.taches.includes(task.id)
          );
          console.log(taskUsers);
          
          task = { ...task, users: taskUsers };

          // const indexs = this.workflow.tasks.findIndex(
          //   (task) => task.id === this.workflow.tasks[index].id
          // );

          const existTask = this.workflow.tasks.find((tache) => tache === task);

          if (!existTask) {
            this.workflow.tasks.push(task);
            console.log(this.workflow);
          } else {
            console.log(`la tache ${existTask.title} existe deja`);
          }
        }
      });
      this.workflowUsers.forEach((user) => {
        user.taches = this.workflow.tasks
          .filter((task) => task.users.some(u => u.id === user.id))
          .map((task) => task.id);
      });
    }
  }

  deleteTask(taskId: number) {
    const index = this.workflowTask.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      this.workflowTask.splice(index, 1);
    }

    const index1 = this.workflow.tasks.findIndex((task) => task.id === taskId);
    if (index1 !== -1) {
      this.workflow.tasks.splice(index, 1);
    }
  }

  enregistrer() {
    this.workflow = {
      ...this.workflow,
      id: this.id,
      title: this.titre,
      description: this.message,
      priority: this.priorite,
      dueDate: this.echeance,
      status: this.statut,
    };
    console.log(this.workflow);
  }

  // // Fonction appelée lorsqu'une tâche est sélectionnée
  // onTaskSelect(task_id: number, index: number) {
  //   // Trouver la tâche sélectionnée
  //   console.log(task_id);

  //   const task = this.availableTasks.find(task => task.id === task_id);
  //   console.log(this.availableTasks);

  //   console.log(task.id);

  //   if (!task) {
  //     return "error";
  //   }
  //   // Ajouter l'id de la tache selectionnée dans le tableau des paire taskUser
  //   this.taskUser.push({ ...this.taskUser[index], id_task: task.id });
  //   console.log(this.taskUser);
  //   //this.availableTasks = this.availableTasks.filter(task => task.id !== task_id)
  //   this.availableTasks.splice(this.availableTasks.indexOf(task), 1);
  //   //availableTaskList.splice(availableTaskList.indexOf(task), 1);
  //   console.log(this.availableTasks);

  // }

  // // Fonction appelée lorsqu'un user est sélectionnée
  // onUserSelect(user_id: number, index: number) {
  //   const user = this.usersWorkflow.find((u) => u.id === user_id);
  //   //console.log(user);

  //   if (!user) {
  //     return "error";
  //   }
  //   this.taskUser.push({ ...this.taskUser[index], id_user: user.id });
  //   console.log(this.taskUser);

  // }

  // sendWorkflow() {}

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


