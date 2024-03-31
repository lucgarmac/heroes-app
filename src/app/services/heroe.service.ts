import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ENotificationType } from '../components/notification/models/notification';
import { NotificationService } from '../components/notification/services/notification.service';
import { IHeroeDetail, IHeroePostRequest, IHeroeSearch, IPatchRequest } from '../models/heroe';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class HeroeService {
  constructor(
    private _httpClient: HttpClient,
    private _httpService: HttpService,
    private _notificationService: NotificationService
  ) {}

  /**
   * TODO: Pending url base
   */
  private _baseUrl = environment.heroesApi;

  /********************************
   * *****TODO: Mock variables*****
   ********************************/
  private _basePath = '/assets/config';
  private _getPathUrl = (urlItem: string): string =>
    `${this._basePath}/${urlItem}`;
  private _heroesMock!: IHeroeDetail[];
  private _delayMock = 250;
  ////////////////////////////////////

  private _getHeroesMock(): Observable<IHeroeDetail[]> {
    if (this._heroesMock?.length) {
      return of(this._heroesMock);
    }

    return this._httpClient
      .get<IHeroeDetail[]>(this._getPathUrl('heroes.json'))
      .pipe(tap((response) => (this._heroesMock = response)));
  }

  findHeroes(name: string): Observable<IHeroeSearch[]> {
    if (isDevMode()) {
      return this._getHeroesMock().pipe(
        map((heroesDetail: IHeroeDetail[]) =>
          heroesDetail
            .filter((heroe) =>
              heroe.name.toUpperCase().includes(name.toUpperCase())
            )
            .map((heroe) => <IHeroeSearch>{ id: heroe.id, name: heroe.name })
        ),
        delay(this._delayMock)
      );
    }

    return this._httpClient.get<IHeroeSearch[]>(`${this._baseUrl}`, {
      params: this._httpService.parseToHttpParams({ name }),
    });
  }

  getDetail(id: string): Observable<IHeroeDetail | null> {
    if (isDevMode()) {
      return this._getHeroesMock().pipe(
        map(
          (heroesDetail: IHeroeDetail[]) =>
            heroesDetail.find((heroe) => heroe.id.toString() === id) || null
        )
      );
    }

    return this._httpClient.get<IHeroeDetail>(`${this._baseUrl}/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createHeroe(body: IHeroePostRequest): Observable<object> {
    if (isDevMode()) {
      return of({ id: 9999 }).pipe(
        tap({
          next: (_) =>
            this._notificationService.show({
              messageKey: 'HEROES.CREATE.RESPONSE.OK',
              type: ENotificationType.SUCCESS,
              closeInMillis: 3000,
            }),
          error: (_) =>
            this._notificationService.show({
              messageKey: 'HEROES.CREATE.RESPONSE.KO',
              type: ENotificationType.ERROR,
            }),
        }),
        delay(this._delayMock)
      );
    }

    return this._httpClient.post<object>(`${this._baseUrl}`, body).pipe(
      tap({
        next: (_) =>
          this._notificationService.show({
            messageKey: 'HEROES.CREATE.RESPONSE.OK',
            type: ENotificationType.SUCCESS,
            closeInMillis: 3000,
          }),
        error: (_) =>
          this._notificationService.show({
            messageKey: 'HEROES.CREATE.RESPONSE.KO',
            type: ENotificationType.ERROR,
          }),
      })
    );;
  }

  updateHeroe(body: IPatchRequest[]): Observable<object> {
    if (isDevMode()) {
      return of({ updated: true }).pipe(
        tap({
          next: (_) =>
            this._notificationService.show({
              messageKey: 'HEROES.EDIT.RESPONSE.OK',
              type: ENotificationType.SUCCESS,
              closeInMillis: 3000,
            }),
          error: (_) =>
            this._notificationService.show({
              messageKey: 'HEROES.EDIT.RESPONSE.KO',
              type: ENotificationType.ERROR,
            }),
        }),
        delay(this._delayMock)
      );
    }

    return this._httpClient.post<object>(`${this._baseUrl}`, body).pipe(
      tap({
        next: (_) =>
          this._notificationService.show({
            messageKey: 'HEROES.EDIT.RESPONSE.OK',
            type: ENotificationType.SUCCESS,
            closeInMillis: 3000,
          }),
        error: (_) =>
          this._notificationService.show({
            messageKey: 'HEROES.EDIT.RESPONSE.KO',
            type: ENotificationType.ERROR,
          }),
      })
    );;
  }

  deleteHeroe(id: string): Observable<object> {
    if (isDevMode()) {
      return of({ deleted: true }).pipe(
        tap({
          next: (_) =>
            this._notificationService.show({
              messageKey: 'HEROES.DELETE.RESPONSE.OK',
              type: ENotificationType.SUCCESS,
              closeInMillis: 3000,
            }),
          error: (_) =>
            this._notificationService.show({
              messageKey: 'HEROES.DELETE.RESPONSE.KO',
              type: ENotificationType.ERROR,
            }),
        }),
        delay(this._delayMock)
      );
    }

    return this._httpClient.delete<object>(`${this._baseUrl}/${id}`).pipe(
      tap({
        next: (_) =>
          this._notificationService.show({
            messageKey: 'HEROES.DELETE.RESPONSE.OK',
            type: ENotificationType.SUCCESS,
            closeInMillis: 3000,
          }),
        error: (_) =>
          this._notificationService.show({
            messageKey: 'HEROES.DELETE.RESPONSE.KO',
            type: ENotificationType.ERROR,
          }),
      })
    );
  }
}
