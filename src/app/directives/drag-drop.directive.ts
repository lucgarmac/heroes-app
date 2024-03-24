import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true,
})
export class DragDropDirective {
  @Output() dataReceived = new EventEmitter<DataTransferItem[]>();

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event?.dataTransfer?.items?.length) {
      this.dataReceived.emit([]);
      return;
    }

    const dataTransferItems: DataTransferItem[] = Object.keys(
      event.dataTransfer.items
    ).map((_, i) => event.dataTransfer.items[i]);
    this.dataReceived.emit(dataTransferItems);
  }
}
