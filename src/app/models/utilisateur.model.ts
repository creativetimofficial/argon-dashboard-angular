import { Task } from "./tache.model";

export interface User {
    id: number,
    name: string,
    date_naissance?: Date;
    sexe?: boolean,
    email?: string,
    numero?: number,
    user_name?: string,
    password?: string, 
    id_role?: number,
    id_site?: number,
    id_sign?: number,
    id_tache?: number,
    taches?: number[],
    workflows?: [],
    service: string
  }