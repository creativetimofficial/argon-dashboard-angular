import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent {

  displayForm: boolean = false;
  displayModalDoc: boolean = false;
  displayModalUser: boolean = false;
  displayList: boolean = true;
  displayCreateWorkflowButton : boolean = true;

  constructor() {}

  ngOnInit() {}

  initiateWorkflow() {
    this.displayList = false;
    this.displayCreateWorkflowButton = true;
    this.displayForm = true;
  }
}
