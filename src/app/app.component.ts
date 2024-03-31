import { Component, OnDestroy, WritableSignal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterModule } from './components/footer/footer.module';
import { TitleBarService } from './components/title-bar/services/title-bar.service';
import { TitleBarModule } from './components/title-bar/title-bar.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { Subject, takeUntil } from 'rxjs';

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
export class AppComponent implements OnDestroy {

  constructor(private _titleBarService: TitleBarService) {
    this._titleBarService.isValidUrl$
      .pipe(takeUntil(this._stopObservables$))
      .subscribe(isValid => this.isNotFoundPage.set(!isValid))
  }
  ngOnDestroy(): void {
    this._stopObservables$.next();
    this._stopObservables$.complete();
  }

  private _stopObservables$ = new Subject<void>();

  isNotFoundPage: WritableSignal<boolean> = signal(false);
}
