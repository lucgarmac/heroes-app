import {
  Component,
  Inject,
  WritableSignal,
  inject,
  signal
} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef
} from '@angular/material/snack-bar';
import { ENotificationType } from './models/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatSnackBarActions, MatSnackBarAction, MatSnackBarLabel],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this._updateData(data);
  }
  message: WritableSignal<string> = signal('');
  classNotification: WritableSignal<string> = signal('notification');
  notificationTypeEnum = ENotificationType;

  snackBarRef = inject(MatSnackBarRef);

  private _updateData(data: any) {
    this.message.set(data.message);
    this._setNotificationType(data.type);
  }

  private _setNotificationType(value: ENotificationType) {
    if (!value) {
      this.classNotification.set('notification');
    }
    this.classNotification.set(
      `notification bg-${value}-subtle text-${value}-emphasis`
    );
  }
}
