import { Injectable } from '@angular/core';
import { ToastComponent } from './toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  private toastComponent: ToastComponent | undefined;

  public registerToast(toast: ToastComponent): void {
    this.toastComponent = toast;
  }

  public showToast(message: string, type: 'success' | 'error' | 'info', duration: number = 3000): void {
    if (this.toastComponent) {
      this.toastComponent.display(message, type, duration);
    }
  }
}
