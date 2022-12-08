import { Component, Inject, OnInit } from '@angular/core';
import { ChauffeursService } from 'src/app/services/chauffeurs.service';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChauffeurModel } from 'src/app/models/chauffeurModel';


@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css']
})
export class ChauffeurComponent implements OnInit {

  dataSource = [];
  dataChauffeur = [];

  constructor(private chauffeurService: ChauffeursService,
              public dialog: MatDialog) { }

  refresh(){
    this.getAllChauffeurs()
  }

  ngOnInit(): void {
    this.getAllChauffeurs()
  }
  

  getAllChauffeurs(){

    this.chauffeurService.getAllChauffeurs().subscribe(
      (res:any)=>{
        console.log(res)
        this.dataSource=res
      },
      (err:any)=>{
        console.log(err)

      }
    )
  }
  getChauffeur(id) {
    this.chauffeurService.getChauffeur(id).subscribe(
      (res: any) => {
        console.log(res);
        this.dataChauffeur = res;
      },
      (err: any) => {
        console.log(err);
      });
  }
  supprimerChauffeur(id){
    this.chauffeurService.deleteChauffeur(id).subscribe((res:any)=>{
      this.refresh();
      // this.showNotification('top','right',"Le chauffeur a été supprimer",'danger')
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogChauffeur, {
      width: '500px',
      data: {nom:"",prenom:"",numCompte:"",codeCNSS:"",numTel:"",adresse:""}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }
  
  openEditDialog(i, nom, prenom, numC, codeC, numT, add): void {
    const dialogRef = this.dialog.open(EditDialogChauffeur, {

      width: '500px',
      data: {id: i, nom: nom, prenom: prenom, numCompte: numC, codeCNSS: codeC, numTel:numT, adresse: add }
    });
    this.getChauffeur(i);
    
    console.log(this.dataChauffeur);

    dialogRef.afterClosed().subscribe(result => {

      this.refresh();
    });
  }

} 


@Component({
  selector: 'dialog-chauffeur',
  templateUrl: 'dialog-chauffeur.html',
})

export class DialogChauffeur  {
;

constructor(
  public dialogRef: MatDialogRef<DialogChauffeur>,
  @Inject(MAT_DIALOG_DATA) public data: ChauffeurModel,
  private chauffeurService:ChauffeursService,
  ){}
 
 
onNoClick(): void {
  this.dialogRef.close();
}
submit(){
  var chauff={
    "nom": this.data.nom,
    "prenom": this.data.prenom,
    "numCompte": this.data.numCompte,
    "codeCNSS":this.data.codeCNSS,
    "numTel":this.data.numTel,
    "adresse":this.data.adresse
  }
  this.chauffeurService.addChauffeur(chauff).subscribe((res:any)=>{
   // this.showNotification('top','right',"Le chauffeur a été ajouter",'success')

    this.dialogRef.close();

  })
}

jsonToStr(data){return JSON.stringify(data);}

}



@Component({
  selector: 'edit-dialog-chauffeur',
  templateUrl: 'edit-dialog-chauffeur.html',
})

export class EditDialogChauffeur{


  constructor(
    public dialogRef: MatDialogRef<EditDialogChauffeur>,
    @Inject(MAT_DIALOG_DATA) public data: ChauffeurModel,
    private chauffeurService: ChauffeursService,) {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  submitEdit() {
    // nibha el id mel data camion
    var id = this.data.id;

    var chauff = {
      'nom': this.data.nom,
      'prenom': this.data.prenom,
      'numCompte': this.data.numCompte,
      'codeCNSS': this.data.codeCNSS,
      'numTel': this.data.numTel,
      'adresse': this.data.adresse,
    };
    this.chauffeurService.updateChauffeur(id, chauff).subscribe((res: any) => {
     // this.showNotification('top', 'right', 'Le chauffeur a été modifier', 'success');

      this.dialogRef.close();

    });
  }

}



