import { Component } from "@angular/core";

interface Personne {
  nom: string;
  role: string;
}
interface Document {
  id: number;
  titre: string;
}
interface Workflow {
  titre: string;
  message: string;
  Echeances: Date;
  statut: string;
  priorite: string;
  personneAssignees: Personne[];
  documentAssignes: Document[];
}

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent {
  statuts: string[] = [
    "Pas démarré",
    "En cours",
    "Suspendu",
    "Annulé",
    "Terminé",
  ];
  priorites: string[] = ["normale", "moyenne", "élevé"];
  personnes: Personne[] = [
    {
      nom: "Woumpe Paplice",
      role: "Super administrateur",
    },
    {
      nom: "Aymard Waufo",
      role: "administrateur",
    },
    {
      nom: "Sylvie Younga",
      role: "Editeur",
    },
    {
      nom: "Armand Emane Engbwe",
      role: "Employé",
    },
  ];
  Documents: Document[] = [
    {
      id: 1,
      titre: "contrat hermados",
    },
    {
      id: 2,
      titre: "facture matériel IR",
    },
    {
      id: 3,
      titre: "demande de congé",
    },
  ];

  workflowTab: Workflow[] = [
    {
      titre: "Validation de contrat",
      message:
        "Bonjour DG, bien vouloir signer le contrat de location de materiel avec la société HEMADOS",
      Echeances: new Date(2023, 5, 1, 13, 0),
      statut: this.statuts[0],
      priorite: this.priorites[2],
      personneAssignees: [this.personnes[0]],
      documentAssignes: [this.Documents[0]],
    },
    
    {
      titre: "Valider une facture",
      message:
        "Bonjour DG, bien vouloir valider la facture a envoyer au client MybestFollowUp",
      Echeances: new Date(2023, 6, 1, 13, 0),
      statut: this.statuts[0],
      priorite: this.priorites[2],
      personneAssignees: [this.personnes[0]],
      documentAssignes: [this.Documents[1]],
    },

    {
      titre: "Permission pour abscence",
      message:
        "Bonjour M., bien vouloir approuver ou rejeter mon abscence",
      Echeances: new Date(2023, 5, 1, 13, 0),
      statut: this.statuts[0],
      priorite: this.priorites[0],
      personneAssignees: [
        this.personnes[0],
        this.personnes[1],
        this.personnes[2],
      ],
      documentAssignes: [this.Documents[2]],
    },
  ];

  deleteWorkflow(id: number) {
    console.log('workflow delete');
    
  }
}
