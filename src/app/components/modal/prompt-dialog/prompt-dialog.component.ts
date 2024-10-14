import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrl: './prompt-dialog.component.scss'
})
export class PromptDialogComponent {

  @ViewChild('modal') modalElement!: ElementRef;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmButtonLabel: string = '';
  @Input() cancelButtonLabel: string = '';
  @Output() confirmActionButtonClick = new EventEmitter<void>();
  @Output() cancelActionButtonClick = new EventEmitter<void>();
  @Input() buttonColorClass: string = "info"
  private backdropElement: HTMLElement;

  constructor(private renderer: Renderer2) {
    // Create the backdrop element and configure its styles
    this.backdropElement = this.renderer.createElement('div');
    this.renderer.addClass(this.backdropElement, 'modal-backdrop');
    this.renderer.addClass(this.backdropElement, 'fade');
  }

  open() {
    // Show the modal with fade effect
    this.renderer.addClass(this.modalElement.nativeElement, 'show');
    this.modalElement.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');

    // Append the backdrop element to the body with fade in
    this.renderer.appendChild(document.body, this.backdropElement);
    setTimeout(() => {
      this.renderer.addClass(this.backdropElement, 'show');
    }, 10); // Small delay to trigger CSS transition
  }

  close() {
    // Remove the modal's show class and hide it
    this.renderer.removeClass(this.modalElement.nativeElement, 'show');
    setTimeout(() => {
      this.modalElement.nativeElement.style.display = 'none';
    }, 150); // Delay to match CSS fade out duration

    // Remove the modal-open class from the body
    document.body.classList.remove('modal-open');

    // Fade out and remove the backdrop
    this.renderer.removeClass(this.backdropElement, 'show');
    setTimeout(() => {
      this.renderer.removeChild(document.body, this.backdropElement);
    }, 150); // Same delay as modal fade out
  }

  onComfirmButtonActionClick(): void {
    this.confirmActionButtonClick.emit(); 
    this.close(); 
  }

  onCancelButtonActionClick(): void {
    this.cancelActionButtonClick.emit(); 
    this.close(); 
  }
}
