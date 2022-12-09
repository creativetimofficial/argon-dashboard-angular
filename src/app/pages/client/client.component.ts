import { Component, Inject, OnInit } from '@angular/core';

import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ClientModel} from 'src/app/models/clientModel';
import { ClientsService } from 'src/app/services/client.service';

declare var $: any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})

export class ClientComponent implements OnInit {

  dataSource = [];
  dataClient = [];

  constructor(private clientService: ClientsService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllClients();
  }

  refresh() {
    this.getAllClients();
  }

  getAllClients() {
    this.clientService.getAllClients().subscribe(
      (res: any) => {
        console.log(res);
        this.dataSource = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getClient(id) {
    this.clientService.getClient(id).subscribe(
      (res: any) => {
        console.log(res);
        this.dataClient = res;
      },
      (err: any) => {
        console.log(err);
      });
  }

  supprimerClient(id) {
    this.clientService.deleteClient(id).subscribe((res: any) => {
      this.refresh();
      this.showNotification('top', 'right', 'Le client a été supprimer', 'danger');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogClient, {
      width: '500px',
      data: {nom: '', email: '',numTel:'', address: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

  openEditDialog(i, nm, em, tl, ad): void {
    const dialogRef = this.dialog.open(EditDialogClient, {

      width: '500px',
      data: {id: i, nom: nm, email: em, numTel: tl, address: ad}
    });
    this.getClient(i);

    console.log(this.dataClient);

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
  selector: 'dialog-client',
  templateUrl: 'dialog-client.html',
})

export class DialogClient {

  constructor(
    public dialogRef: MatDialogRef<DialogClient>,
    @Inject(MAT_DIALOG_DATA) public data: ClientModel,
    private clientService: ClientsService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    var cl = {
      'nom': this.data.nom,
      'email': this.data.email,
      'numTel':this.data.numTel,
      'address': this.data.address,
    };
    this.clientService.addClient(cl).subscribe((res: any) => {
      //this.showNotification('top', 'right', 'Le client a été ajouter', 'success');

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
    selector: 'edit-dialog-client',
    templateUrl: 'edit-dialog-client.html',
  })

  export class EditDialogClient {


    constructor(
      public dialogRef: MatDialogRef<EditDialogClient>,
      @Inject(MAT_DIALOG_DATA) public data: ClientModel,
      private clientService: ClientsService,) {
    }


    onNoClick(): void {
      this.dialogRef.close();
    }

    submitEdit() {
      // nibha el id mel data client
      var id = this.data.id;

      var cl = {
        'nom': this.data.nom,
        'email': this.data.email,
        'numTel':this.data.numTel,
        'address': this.data.address,
      };
      this.clientService.updateClient(id, cl).subscribe((res: any) => {
       // this.showNotification('top', 'right', 'Le client a été modifier', 'success');

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


