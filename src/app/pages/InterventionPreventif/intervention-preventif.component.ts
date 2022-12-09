 import { Component, Inject, OnInit } from '@angular/core';
 import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {InterventionPreventifModel} from 'src/app/models/interventionPreventifModel';
 import { CamionsService } from 'src/app/services/camions.service';

declare var $: any;
import { InterventionPreventifService } from 'src/app/services/inte-intervention-preventif.service';
 @Component({
  selector: 'app-intervention-preventif',
  templateUrl: './intervention-preventif.component.html',
  styleUrls: ['./intervention-preventif.component.css']
})

export class InterventionPreventifComponent implements OnInit {
  dataSource = [];
  dataInterventionPreventif  = [];
  constructor(private interventionPreventifService: InterventionPreventifService,
    public dialog: MatDialog) { }

ngOnInit(): void {
this.getAllInterventionPreventifs();
}

refresh() {
this.getAllInterventionPreventifs();
}

getAllInterventionPreventifs() {
this.interventionPreventifService.getAllInterventionPreventifs().subscribe(
(res: any) => {
console.log(res);
this.dataSource = res;
},
(err: any) => {
console.log(err);
}
);
}

getInterventionPreventif(id) {
this.interventionPreventifService.getInterventionPreventif(id).subscribe(
(res: any) => {
console.log(res);
this.dataInterventionPreventif = res;
},
(err: any) => {
console.log(err);
});
}

supprimerInterventionPreventif(id) {
this.interventionPreventifService.deleteInterventionPreventif(id).subscribe((res: any) => {
this.refresh();
this.showNotification('top', 'right', 'Le interventionPreventif a été supprimer', 'danger');
});
}

openDialog(): void {
  const dialogRef = this.dialog.open(DialogInterventionPreventif, {
    width: '500px',
    data: {dateInterventionPreventif : '', dateInt : '', kilometrage : '', prochaineKm: '', description: '', camion: '' }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    this.refresh();
  });
}

openEditDialog(i, dm, des, dec, qt, ph): void {
  const dialogRef = this.dialog.open(EditDialogInterventionPreventif, {

    width: '500px',
    data: {id: i, dateInterventionPreventif: dm, kilometrage: des, prochaineKm: dec, description:qt, camion:ph }
  });
  this.getInterventionPreventif(i);

  console.log(this.dataInterventionPreventif);

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
selector: 'dialog-interventionPreventif',
templateUrl: 'dialog-interventionPreventif.html',
})

// tslint:disable-next-line:component-class-suffix
export class DialogInterventionPreventif {

camions=[];

constructor(
  public dialogRef: MatDialogRef<DialogInterventionPreventif>,
  @Inject(MAT_DIALOG_DATA) public data: InterventionPreventifModel,
   private camionService:CamionsService,
   private interventionPreventifService: InterventionPreventifService) {

    this.camionService.getAllCamions().subscribe(res=>{
      this.camions=res as any;
    })
}
onNoClick(): void {
  this.dialogRef.close();
}
submit() {
  console.log(this.data.camion);

  var cam = {
    'dateInt': this.data.dateInt,
    'kilometrage': this.data.kilometrage,
    'prochaineKm': this.data.prochaineKm,
    'description': this.data.description,
    'camion': JSON.parse(this.data.camion)

  };

console.log(cam);

  this.interventionPreventifService.addInterventionPreventif(cam).subscribe((res: any) => {

    //this.showNotification('top', 'right', 'Le interventionPreventif a été ajouter', 'success');

    this.dialogRef.close();
  });
}
jsonToStr(data){
  return JSON.stringify(data);}

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
  selector: 'edit-dialog-interventionPreventif',
  templateUrl: 'edit-dialog-interventionPreventif.html',
})

export class EditDialogInterventionPreventif {


  constructor(
    public dialogRef: MatDialogRef<EditDialogInterventionPreventif>,
    @Inject(MAT_DIALOG_DATA) public data: InterventionPreventifModel,
    private interventionPreventifService: InterventionPreventifService,
    ) {


  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  submitEdit() {
    // nibha el id mel data interventionPreventif
    var id = this.data.id;

    var cam = {
      'dateInt': this.data.dateInt,
      'kilometrage': this.data.kilometrage,
      'prochaineKm': this.data.prochaineKm,
      'description': this.data.description,

    };
    this.interventionPreventifService.updateInterventionPreventif(id, cam).subscribe((res: any) => {
     // this.showNotification('top', 'right', 'Le interventionPreventif a été modifier', 'success');
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





