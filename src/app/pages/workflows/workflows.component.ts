import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent {

  display: boolean = false;

  constructor() {}

  ngOnInit() {}

  initiateWorkflow() {
    this.display = true; 
  }
}
