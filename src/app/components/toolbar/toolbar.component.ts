import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { TitleService } from '../../services/title.service';
import { Language, MenuItem } from './models/toolbar';
import { ToolbarService } from './services/toolbar.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  providers: [ToolbarService],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  constructor(
    private _toolbarService: ToolbarService,
    private _translateService: TranslateService,
    private _titleService: TitleService,
    private _router: Router
  ) {}

  private _stopObservables$ = new Subject<void>();

  menuItems: WritableSignal<MenuItem[]> = signal([]);
  languages: WritableSignal<Language[]> = signal([]);

  ngOnInit(): void {
    forkJoin([
      this._toolbarService.getMenu(),
      this._toolbarService.getLanguages()
    ]).pipe(takeUntil(this._stopObservables$))
    .subscribe(([menuItems, languages]) => {
      this.menuItems.set(menuItems);
      this.languages.set(languages);
    })
  }

  onSelectLanguage(language: string) {
    this._translateService.setDefaultLang(language);
    this._translateService.use(language);
    this._titleService.updateTitle(this._router.routerState.snapshot);
  }

  ngOnDestroy(): void {
    this._stopObservables$.next();
    this._stopObservables$.complete();
  }
}
