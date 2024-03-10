import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENotificationType } from '../models/notification';
import { NotificationComponent } from '../notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  showNotification(message: string, type: ENotificationType, closeInMillis?: number) {
    const options = {
      duration: closeInMillis ?? undefined,
      data: {
        message,
        type
      }
    };
    this._snackBar.openFromComponent(NotificationComponent, options );
  }

}
