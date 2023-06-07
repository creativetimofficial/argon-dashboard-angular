import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-associate-user',
  templateUrl: './modal-associate-user.component.html',
  styleUrls: ['./modal-associate-user.component.scss']
})
export class ModalAssociateUserComponent implements OnInit{
  searchResults: string[] = [];
  selectedItems: string[] = [];
  modal: NgbModalRef;
  searchForm: FormGroup

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }

  ngOnInit(): void {
  }

  search() {
    this.searchResults = ["u1", "u2", "u3", "u4", "u5"];
  }

  selectItem(item: string) {
    if(!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    }
  }

  deselectItem(item: string) {
    const index = this.selectedItems.indexOf(item);
    if(index !== -1) {
      this.selectedItems.splice(index, 1)
    }
  }

  save() {
    document.querySelector<HTMLElement>(".modal").classList.remove('show', 'd-block')
    document.querySelector<HTMLElement>(".modal-backdrop").classList.remove('show')
    document.querySelector<HTMLElement>("modal-backdrop").style.removeProperty("z-index")
    document.querySelector<HTMLElement>("body").classList.remove('modal-open')
    document.querySelector<HTMLElement>("body").style.removeProperty("padding-right")  //classList.remove('modal-open')
    document.querySelector<HTMLElement>("body").style.removeProperty("overflow") 
  }

  close() {
    document.querySelector<HTMLElement>(".modal").classList.remove('show', 'd-block')
    document.querySelector<HTMLElement>(".modal-backdrop").classList.remove('show')
    document.querySelector<HTMLElement>("modal-backdrop").style.removeProperty('z-index')
    document.querySelector<HTMLElement>("body").classList.remove('modal-open')
    document.querySelector<HTMLElement>("body").style.removeProperty("padding-right")  //classList.remove('modal-open')
    document.querySelector<HTMLElement>("body").style.removeProperty("overflow") 
  }

  // openModal(content: any) {
  //   this.modal = this.modalService.open(content, { ariaLabelledBy: 'modal-title', size: 'lg' });
  //   this.modal.result.then((result) => {
  //     console.log(result);
  //   }, (reason) => {
  //     console.log(reason);
  //   });
  // }
}

