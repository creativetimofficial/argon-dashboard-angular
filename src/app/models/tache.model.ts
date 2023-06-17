import { Function } from "./function.model";

export interface Task {
    id: number; // identifiant unique de la tâche
    title: string; // titre de la tâche
    description: string; // description de la tâche
    statut: string; // définir l'état de la tâche en cours, terminée ou annulée
    delay?: string // délais d'execution de la tâche
    assignedFunction: Function; // fonction utilisateur assignée à la tâche
    order: number; // ordre d'exécution de la tâche
  }