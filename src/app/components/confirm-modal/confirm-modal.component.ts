import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IConfirmModal } from './models/confirm-modal';
import { IParams } from '../../models/params';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [DialogModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent implements OnInit {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: IConfirmModal
  ) {}

  @Output() closeModal = new EventEmitter<void>();

  title: WritableSignal<string> = signal('');
  message: WritableSignal<string> = signal('');
  messageParams: WritableSignal<IParams> = signal({});
  cancelText: WritableSignal<string> = signal('');
  confirmText: WritableSignal<string> = signal('');

  ngOnInit(): void {
    const { title, message, messageParams, cancelText, confirmText } =
      this.data;
    this.title.set(title ?? '');
    this.message.set(message ?? '');
    this.messageParams.set(messageParams ?? {});
    this.cancelText.set(cancelText ?? 'GENERAL.CANCEL.TITLE');
    this.confirmText.set(confirmText ?? 'GENERAL.CONFIRM');
  }
}
