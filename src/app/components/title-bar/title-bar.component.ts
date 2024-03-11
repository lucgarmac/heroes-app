import { Component, OnDestroy, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { routesMap, routesWithReturn } from './config/title-bar.config';
import { TitleBarUrl } from './models/title-bar';

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
    private _activatedRoute: ActivatedRoute
  ) {
    this._router.events
      .pipe(
        takeUntil(this._stopObservables$),
        filter((e) => e instanceof NavigationEnd),
        map((e) => <NavigationEnd>e)
      )
      .subscribe((e: NavigationEnd) => {
        this.isVisibleReturn.set(this._isUrlWithReturn(e.url,e.urlAfterRedirects));
        this.title.set(this._getTitleKey(e.url,e.urlAfterRedirects));

      });
  }


  private readonly _stopObservables$ = new Subject<void>();
  private readonly _defaultKeyUrl = '';

  isVisibleReturn: WritableSignal<boolean> = signal(false);
  title: WritableSignal<string> = signal(this._defaultKeyUrl);

  private _isUrlWithReturn(currentUrl: string, urlAfterRedirects: string): boolean {
    const routeUrl = this._getRouteCurrentUrl(currentUrl,urlAfterRedirects);
    return routeUrl ? routesWithReturn.includes(routeUrl.id) : false;
  }

  private _getTitleKey(currentUrl: string, urlAfterRedirects: string): string {
    const routeUrl = this._getRouteCurrentUrl(currentUrl,urlAfterRedirects);
    return routeUrl ? routeUrl.translateKey : this._defaultKeyUrl;
  }

  private _getParams(activatedRoute: ActivatedRoute): Params | null {
    const params = activatedRoute.snapshot.params;
    if (!Object.keys(params).length && !!activatedRoute.firstChild) {
      return this._getParams(activatedRoute.firstChild);
    }
    return params;
  }

  private _getUrlsWithParams(paramsDetected: Params | null): TitleBarUrl[] {
    if(!paramsDetected) {
      return [];
    }
    return routesMap
    .filter(
      (route) =>
        !!route.params?.length &&
        route.params.every((param) =>
          Object.keys(<object>paramsDetected).includes(param)
        )
    )
    .map((item) => {
      item.params?.forEach((param) =>
        item.path = item.path.replace(`:${param}`, paramsDetected[param])
      );
      return item;
    });
  }

  private _getRouteCurrentUrl(currentUrl: string, urlAfterRedirects: string): TitleBarUrl | null {
    const params = this._getParams(this._activatedRoute);
    const urlWithParams = this._getUrlsWithParams(params);
    const urls = params && !!Object.keys(<object>params)?.length
      ? urlWithParams
      : routesMap;

    const urlFound = urls.find(
      (route) => route.path === currentUrl || route.path === urlAfterRedirects
    );
    if (!urlFound) {
      return null;
    }
    return urlFound;
  }

  ngOnDestroy(): void {
    this._stopObservables$.next();
    this._stopObservables$.complete();
  }
}
