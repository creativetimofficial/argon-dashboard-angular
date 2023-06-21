import { Document } from "./document.model";
import { Task } from "./tache.model";

export interface Workflow {
    id: number; // identifiant unique du workflow
    title: string; // titre du workflow
    description: string; // description du workflow
    status: string; // statut actuel du workflow
    priority: string; // priorité du workflow
    dueDate: Date; // date d'échéance du workflow
    tasks: Task[]; // tableau de tâches associées au workflow
    documents?: Document[]
    //notifications: Notification[]; // tableau de notifications à envoyer
  }