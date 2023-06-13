import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

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


  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {}
  
  ngOnInit(): void {}
}
