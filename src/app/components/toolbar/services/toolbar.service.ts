import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Language, MenuItem } from '../models/toolbar';

@Injectable()
export class ToolbarService {
  constructor(private _httpClient: HttpClient) {}

  private _basePath = '/assets/config';

  private _getPathUrl = (urlItem: string): string =>
    `${this._basePath}/${urlItem}`;

  getMenu(): Observable<MenuItem[]> {
    return this._httpClient
      .get<MenuItem[]>(this._getPathUrl('menu.json'))
      .pipe(catchError(() => of([])));
  }

  getLanguages(): Observable<Language[]> {
    return this._httpClient
      .get<Language[]>(this._getPathUrl('languages.json'))
      .pipe(catchError(() => of([])));
  }
}
