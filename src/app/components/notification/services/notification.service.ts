import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification.component';
import { INotification } from '../models/notification';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService) { }

  show(config: INotification) {
    const {messageKey: message, type, closeInMillis} = config;
    const options = {
      duration: closeInMillis ?? undefined,
      data: {
        message:this._translateService.instant(message),
        type
      }
    };
    this._snackBar.openFromComponent(NotificationComponent, options );
  }

}
