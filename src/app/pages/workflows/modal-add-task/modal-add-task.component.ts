import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Task } from "../add-workflow-form/add-workflow-form.component";

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
  echeance: Date;
  workflowTask: Task;
  id: number = 0;

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {}
  
  ngOnInit(): void {}

  enregistrer() {
    this.workflowTask =
      {
        //id: this.id++,
        titre: this.titre,
        detail: this.detail,
        statut: this.statut,
        priorite: this.priorite,
        echeance: this.echeance
      }
    this.activeModal.close('Close click');
  }
  
}
