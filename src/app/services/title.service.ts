import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService extends TitleStrategy implements OnDestroy {
  constructor(
    private readonly _title: Title,
    private _translateService: TranslateService
  ) {
    super();
  }

  private readonly _stopObservables$ = new Subject<void>();

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title?.length) {
      forkJoin([
        this._translateService.get('GENERAL.APP'),
        this._translateService.get(title),
      ])
        .pipe(takeUntil(this._stopObservables$))
        .subscribe(([appTitle, titleTranslate]) =>
          this._title.setTitle(`${appTitle} - ${titleTranslate}`)
        );
    }
  }

  ngOnDestroy(): void {
    this._stopObservables$.next();
    this._stopObservables$.complete();
  }
}
