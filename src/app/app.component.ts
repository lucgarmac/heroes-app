import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { delay, of } from 'rxjs';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { FooterModule } from './components/footer/footer.module';
import { LoadingModule } from './components/loading/loading.module';
import { LoadingService } from './components/loading/services/loading.service';
import { ENotificationType } from './components/notification/models/notification';
import { NotificationModule } from './components/notification/notification.module';
import { NotificationService } from './components/notification/services/notification.service';
import { TitleBarModule } from './components/title-bar/title-bar.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarModule,
    FooterModule,
    LoadingModule,
    NotificationModule,
    TitleBarModule,

    DialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private _loadingService: LoadingService,
    private _notificationService: NotificationService,
    private _dialog: Dialog
  ) {}

  responseDialog!: string | undefined;

  openDialog(): void {
    const dialogRef = this._dialog.open<string>(ConfirmModalComponent, {
      disableClose: true,
      data: {
        title: 'Título',
        message: 'Mensaje de confirmación',
        cancelText: null,
        confirmText: 'SI',
      },
    });

    dialogRef.closed.subscribe((result: string | undefined) => {
      this.responseDialog = result;
    });
  }

  ngOnInit(): void {
    this._loadingService.show('Ejemplo de loading');

    of([])
      .pipe(delay(600))
      .subscribe(() => this._loadingService.hide());

    this._notificationService.showNotification(
      'Test',
      ENotificationType.SUCCESS
    );
  }
}
