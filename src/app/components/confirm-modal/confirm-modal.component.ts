import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, WritableSignal, signal } from '@angular/core';
import { IConfirmModal } from './models/confirm-modal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [DialogModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent implements OnInit{

  constructor(
    private _translateService: TranslateService,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: IConfirmModal,
  ){}

  title: WritableSignal<string> = signal('');
  message: WritableSignal<string> = signal('');
  cancelText: WritableSignal<string> = signal('');
  confirmText: WritableSignal<string> = signal('');


  ngOnInit(): void {
    const {title,message,cancelText,confirmText} = this.data;
    this.title.set(title ?? '');
    this.message.set(message ?? '');
    this.cancelText.set(cancelText ?? this._translateService.instant('GENERAL.CANCEL'));
    this.confirmText.set(confirmText ?? this._translateService.instant('GENERAL.CONFIRM'));
  }
}
