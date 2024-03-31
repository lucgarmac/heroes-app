import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropDirective } from '../../directives/drag-drop.directive';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DragDropDirective,
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
})
export class FileUploaderComponent {
  private readonly _extensionsAllowed = ['jpg', 'webp', 'png'];

  @Output() fileUpload = new EventEmitter<File>();

  @ViewChild('inputFile') inputFileComponent!: ElementRef;

  fileSelected: WritableSignal<File | null> = signal(null);
  filename: WritableSignal<string | null | undefined> = signal(null);
  messageError: WritableSignal<string | null | undefined> = signal(null);

  private _getFileExtension(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1);
  }

  private _removeFileSelected() {
    this.fileSelected.set(null);
    this.filename.set(null);
    this.inputFileComponent.nativeElement.files = null;
  }

  private _updateFileSelected(file: File) {
    const fileSelectedExtension = this._getFileExtension(file.name);
    if (!this._extensionsAllowed.includes(fileSelectedExtension)) {
      this.messageError.set(
        'COMPONENTS.FILE_UPLOADER.VALIDATIONS.EXTENSION_NOT_ALLOWED'
      );
      this.fileUpload.emit(null);
      return;
    }

    if (file.size === 0) {
      this.messageError.set('COMPONENTS.FILE_UPLOADER.VALIDATIONS.FILE_EMPTY');
      this.fileUpload.emit(null);
      return;
    }

    this.fileSelected.set(file);
    this.filename.set(this.fileSelected()?.name);
    this.fileUpload.emit(this.fileSelected());
  }

  onFileSelected(event: any) {
    this._removeFileSelected();

    if (!event?.target?.files?.length) {
      this.messageError.set(
        'COMPONENTS.FILE_UPLOADER.VALIDATIONS.FILE_NOT_SELECTED'
      );
      this.fileUpload.emit(null);
      return;
    }

    this._updateFileSelected(event.target.files[0]);
  }

  onRemoveFile() {
    this._removeFileSelected();
    this.fileUpload.emit(null);
  }

  onDataTransferReceived(items: DataTransferItem[]) {
    if (!items.length) {
      this.messageError.set(
        'COMPONENTS.FILE_UPLOADER.VALIDATIONS.FILE_NOT_SELECTED'
      );
      this.fileUpload.emit(null);
      return;
    }
    this._updateFileSelected(items[0].getAsFile());
  }
}
