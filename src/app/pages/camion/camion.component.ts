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

  supprimerCamion(id) {
    this.camionService.deleteCamion(id).subscribe((res: any) => {
      this.refresh();
      this.showNotification('top', 'right', 'Le camion a été supprimer', 'danger');
    });
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCamion, {
      width: '500px',
      data: {immatriculation: '', numCarteGrise: '', kilometrage: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

  openEditDialog(i, imm, numC, km): void {
    const dialogRef = this.dialog.open(EditDialogCamion, {

      width: '500px',
      data: {id: i, immatriculation: imm, numCarteGrise: numC, kilometrage: km}
    });
    this.getCamion(i);
    
    console.log(this.dataCamion);

    dialogRef.afterClosed().subscribe(result => {

      this.refresh();
    });
  }

  showNotification(from, align, message, tpe) {
    // const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: 'notifications',
      message: message

    }, {
      type: tpe,
      timer: 100,
      placement: {
        from: from,
        align: align
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="fas fa-bell" style="margin-right: 7px;"></i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
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
      'kilometrage': this.data.kilometrage,
    };
    this.camionService.addCamion(cam).subscribe((res: any) => {
      //this.showNotification('top', 'right', 'Le camion a été ajouter', 'success');

      this.dialogRef.close();
    });
  }

  showNotification(from, align, message, tpe) {
    // const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: 'notifications',
      message: message

    }, {
      type: tpe,
      timer: 100,
      placement: {
        from: from,
        align: align
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="fas fa-bell" style="margin-right: 7px;"></i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }
  }


  @Component({
    selector: 'edit-dialog-camion',
    templateUrl: 'edit-dialog-camion.html',
  })
  
  export class EditDialogCamion {
  
  
    constructor(
      public dialogRef: MatDialogRef<EditDialogCamion>,
      @Inject(MAT_DIALOG_DATA) public data: CamionModel,
      private camionService: CamionsService,) {
    }
  
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    submitEdit() {
      // nibha el id mel data camion
      var id = this.data.id;
      
      var cam = {
        'immatriculation': this.data.immatriculation,
        'numCarteGrise': this.data.numCarteGrise,
        'kilometrage': this.data.kilometrage,
      };
      this.camionService.updateCamion(id, cam).subscribe((res: any) => {
       // this.showNotification('top', 'right', 'Le camion a été modifier', 'success');
  
        this.dialogRef.close();
  
      });
    }
  
  
    showNotification(from, align, message, tpe) {
      // const type = ['','info','success','warning','danger'];
  
      const color = Math.floor((Math.random() * 4) + 1);
  
      $.notify({
        icon: 'notifications',
        message: message
  
      }, {
        type: tpe,
        timer: 100,
        placement: {
          from: from,
          align: align
        },
        template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="fas fa-bell" style="margin-right: 7px;"></i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
    }
  }
  

  