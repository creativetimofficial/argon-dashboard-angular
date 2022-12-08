import { Component, Inject, OnInit } from '@angular/core';
import { MissionsService } from 'src/app/services/missions.service';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MissionModel} from 'src/app/models/missionModel';
import { ClientsService } from 'src/app/services/client.service';

declare var $: any;

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})

export class MissionComponent implements OnInit {
  
  dataSource = [];
  dataMission = [];
  
  constructor(private missionService: MissionsService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllMissions();
  }

  refresh() {
    this.getAllMissions();
  }

  getAllMissions() {
    this.missionService.getAllMissions().subscribe(
      (res: any) => {
        console.log(res);
        this.dataSource = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getMission(id) {
    this.missionService.getMission(id).subscribe(
      (res: any) => {
        console.log(res);
        this.dataMission = res;
      },
      (err: any) => {
        console.log(err);
      });
  }

  supprimerMission(id) {
    this.missionService.deleteMission(id).subscribe((res: any) => {
      this.refresh();
      this.showNotification('top', 'right', 'Le mission a été supprimer', 'danger');
    });
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogMission, {
      width: '500px',
      data: {dateMission : '', destination : '', description : '',qte:'',prixHT:'',pourcentageTVA:'',prixTotale:''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

  openEditDialog(i, dm, des, dec,qt,ph,ptva,pt): void {
    const dialogRef = this.dialog.open(EditDialogMission, {

      width: '500px',
      data: {id: i, dateMission: dm, destination: des, description: dec,qte:qt,prixHT:ph,pourcentageTVA:ptva,prixTotale:pt}
    });
    this.getMission(i);
    
    console.log(this.dataMission);

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
  selector: 'dialog-mission',
  templateUrl: 'dialog-mission.html',
})

export class DialogMission {
  clients=[];
  constructor(
    public dialogRef: MatDialogRef<DialogMission>,
    @Inject(MAT_DIALOG_DATA) public data: MissionModel,
    private clientService:ClientsService,
    private missionService: MissionsService) {
      this.clientService.getAllClients().subscribe(res=>{
        this.clients=res as any;
      })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    var cam = {
      'dateMission': this.data.dateMission,
      'destination': this.data.destination,
      'description': this.data.description,
      'qte': this.data.qte,
      'prixHT': this.data.prixHT ,
      'pourcentageTVA': this.data.pourcentageTVA,
      'prixTotale': this.data.prixTotale,
      'client': JSON.parse(this.data.client)
    };
    console.log(this.data.client)
    console.log(cam.client);
    console.log(cam);
    this.missionService.addMission(cam).subscribe((res: any) => {
      
      //this.showNotification('top', 'right', 'Le mission a été ajouter', 'success');

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
    selector: 'edit-dialog-mission',
    templateUrl: 'edit-dialog-mission.html',
  })
  
  export class EditDialogMission {
  
  
    constructor(
      public dialogRef: MatDialogRef<EditDialogMission>,
      @Inject(MAT_DIALOG_DATA) public data: MissionModel,
      private missionService: MissionsService,) {
    }
  
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    submitEdit() {
      // nibha el id mel data mission
      var id = this.data.id;
      
      var cam = {
        'dateMission': this.data.dateMission,
        'destination': this.data.destination,
        'description': this.data.description,
        'qte': this.data.qte ,
        'prixHT': this.data.prixHT,
        'pourcentageTVA': this.data.pourcentageTVA,
        'prixTotale': this.data.prixTotale,
      };
      this.missionService.updateMission(id, cam).subscribe((res: any) => {
       // this.showNotification('top', 'right', 'Le mission a été modifier', 'success');
  
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
  

  