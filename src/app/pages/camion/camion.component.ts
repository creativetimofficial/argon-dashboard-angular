import { Component, Inject, OnInit } from '@angular/core';
import { CamionsService } from 'src/app/services/camions.service';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CamionModel} from 'src/app/models/camionModel';

declare var $: any;

@Component({
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styleUrls: ['./camion.component.css']
})

export class CamionComponent implements OnInit {
  
  dataSource = [];
  dataCamion = [];
  
  constructor(private camionService: CamionsService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllCamions();
  }

  refresh() {
    this.getAllCamions();
  }

  getAllCamions() {
    this.camionService.getAllCamions().subscribe(
      (res: any) => {
        console.log(res);
        this.dataSource = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getCamion(id) {
    this.camionService.getCamion(id).subscribe(
      (res: any) => {
        console.log(res);
        this.dataCamion = res;
      },
      (err: any) => {
        console.log(err);
      });
  }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCamion, {
      width: '500px',
      data: {immatriculation: '', numCarteGrise: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

}


@Component({
  selector: 'dialog-camion',
  templateUrl: 'dialog-camion.html',
})

export class DialogCamion {

  constructor(
    public dialogRef: MatDialogRef<DialogCamion>,
    @Inject(MAT_DIALOG_DATA) public data: CamionModel,
    private camionService: CamionsService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    var cam = {
      'immatriculation': this.data.immatriculation,
      'numCarteGrise': this.data.numCarteGrise,
      'kilometrage': this.data.kilometrage
    };
    this.camionService.addCamion(cam).subscribe((res: any) => {

      this.dialogRef.close();

    });
  }
  }