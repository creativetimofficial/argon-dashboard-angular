import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Task } from "src/app/models/tache.model";
import { User } from "src/app/variables/charts";

@Component({
  selector: "app-modal-add-task",
  templateUrl: "./modal-add-task.component.html",
  styleUrls: ["./modal-add-task.component.scss"],
})
export class ModalAddTaskComponent implements OnInit {
  titre: string;
  detail: string;
  statut: string; 
  priorite: string;
  echeance: string;
  workflowTask: Task;
  id: number = 0;
  ordre: number;
  id_function: number;
  titre_function: string;
  workflowUsers: User[]

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {}
  
  ngOnInit(): void {}

  enregistrer() {
    this.workflowTask =
      {
        id: this.id++,
        title: this.titre,
        description: this.detail,
        statut: this.statut,
        delay: this.echeance,
        order: this.ordre,
        users: this.workflowUsers
        //assignedFunction: {id: this.id_function, title: this.titre_function}
      }
    this.activeModal.close('Close click');
  }
  
}
