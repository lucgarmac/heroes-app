import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterModule } from './components/footer/footer.module';
import { LoadingModule } from './components/loading/loading.module';
import { NotificationModule } from './components/notification/notification.module';
import { TitleBarModule } from './components/title-bar/title-bar.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarModule,
    FooterModule,
    TitleBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
