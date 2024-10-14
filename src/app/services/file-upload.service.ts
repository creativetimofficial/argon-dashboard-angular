import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/compat/storage";
import { finalize, forkJoin, Observable, switchMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  uploadFile(file: File): Observable<string> {
    const filePath = `uploads/documents/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      task
        .snapshotChanges()
        .pipe(
          finalize(() =>
            fileRef.getDownloadURL().subscribe((url) => {
              observer.next(url);
              observer.complete();
            })
          )
        )
        .subscribe();
    });
  }

  uploadFiles(files: File[]): Observable<any> {
    const uploadObservables: Observable<any>[] = [];
    files.forEach((file) => {
      const filePath = `uploads/documents/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      const uploadTask = new Observable<string>((observer) => {
        task
          .snapshotChanges()
          .pipe(
            finalize(() =>
              fileRef.getDownloadURL().subscribe((url) => {
                observer.next(url);
                observer.complete();
              })
            )
          )
          .subscribe();
      });
      // Push the observable (containing the download URL) into the array
      uploadObservables.push(uploadTask);
    });
    return forkJoin(uploadObservables);
  }

  deleteFile(filePath: string): Observable<any> {
    const fileRef = this.storage.refFromURL(filePath);
    return fileRef.delete();
  }

  deleteFiles(filePaths: string[]): Observable<any[]> {
    debugger;
    const deleteObservables: Observable<any>[] = [];

    filePaths.forEach((filePath) => {
      const fileRef = this.storage.refFromURL(filePath);
      deleteObservables.push(fileRef.delete());
    });

    return forkJoin(deleteObservables);
  }

  saveImageMetadata(metadata: any): Promise<any> {
    return this.firestore.collection("images").add(metadata);
  }
}
