import { Component, OnDestroy, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { IParams } from './../../models/params';
import { TitleBarService } from './services/title-bar.service';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [TranslateModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.scss',
})
export class TitleBarComponent implements OnDestroy {
  constructor(
    private _router: Router,
    private _titleBarService: TitleBarService
  ) {
    this._router.events
      .pipe(
        takeUntil(this._stopObservables$),
        filter((e) => e instanceof NavigationEnd),
        map((e) => <NavigationEnd>e)
      )
      .subscribe((e: NavigationEnd) => {
        this.isVisibleReturn.set(
          this._titleBarService.isUrlWithReturn(e.url, e.urlAfterRedirects)
        );
        this.title.set(
          this._titleBarService.getTitleKey(e.url, e.urlAfterRedirects)
        );
        this.routeNavigate.set(
          this._titleBarService.getRouteNavigate(e.url, e.urlAfterRedirects)
        );

        this._titleBarService.setIsValidUrl(
          !!this._titleBarService.getRouteCurrentUrl(e.url, e.urlAfterRedirects)
        );
      });

    this._titleBarService.paramsTitle$.subscribe((params) =>
      this.paramsTitle.set(params)
    );
  }

  private readonly _stopObservables$ = new Subject<void>();
  private readonly _defaultKeyUrl = '';

  isVisibleReturn: WritableSignal<boolean> = signal(false);
  title: WritableSignal<string> = signal(this._defaultKeyUrl);
  paramsTitle: WritableSignal<IParams> = signal({});
  routeNavigate: WritableSignal<string> = signal('');

  ngOnDestroy(): void {
    this._stopObservables$.next();
    this._stopObservables$.complete();
  }
}
