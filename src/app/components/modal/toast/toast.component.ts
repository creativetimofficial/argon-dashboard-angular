import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() message: string = ''
  @Input() show: boolean = false;
  @Input() type: 'success' | 'error' | 'info' = 'success'; // You can extend this as needed
  timeout: any;

  display(message: string, type: 'success' | 'error' | 'info', duration: number = 3000): void {
    this.message = message;
    this.type = type;
    this.show = true;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide(): void {
    this.show = false;
  }

}
