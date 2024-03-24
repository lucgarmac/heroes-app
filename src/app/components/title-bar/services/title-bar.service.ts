import { Injectable } from '@angular/core';
import { IParams } from '../../../models/params';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { routesWithReturn, routesMap } from '../config/title-bar.config';
import { TitleBarUrl } from '../models/title-bar';

@Injectable({
  providedIn: 'root'
})
export class TitleBarService {

  constructor(private _activatedRoute: ActivatedRoute){}

  private _paramsTitleSubject$ = new Subject<IParams>();

  paramsTitle$ = this._paramsTitleSubject$.asObservable();

  private _getParams(activatedRoute: ActivatedRoute): Params | null {
    const params = activatedRoute.snapshot.params;
    if (!Object.keys(params).length && !!activatedRoute.firstChild) {
      return this._getParams(activatedRoute.firstChild);
    }
    return params;
  }

  private _getUrlsWithParams(paramsDetected: Params | null): TitleBarUrl[] {
    if (!paramsDetected) {
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
      .map((item) => ({
          ...item,
          path: this._getUrlWithParamsReplaced(item.path, item.params, paramsDetected)
        })
      );
  }

  private _getUrlWithParamsReplaced(path: string, params: string[] | undefined, paramsDetected: Params | null): string {

    if(!params?.length || !paramsDetected) {
      return path;
    }

    let newPath = path;
    params.forEach(param => newPath = newPath.replace(`:${param}`, paramsDetected[param]));
    return newPath;
  }

  getRouteCurrentUrl(
    currentUrl: string,
    urlAfterRedirects: string,
  ): TitleBarUrl | null {
    const params = this._getParams(this._activatedRoute);
    const urlWithParams = this._getUrlsWithParams(params);
    const urls =
      params && !!Object.keys(<object>params)?.length
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

  setParamsTitle(params: IParams) {
    this._paramsTitleSubject$.next(params);
  }

  isUrlWithReturn(
    currentUrl: string,
    urlAfterRedirects: string
  ): boolean {
    const routeUrl = this.getRouteCurrentUrl(currentUrl, urlAfterRedirects);
    return routeUrl
      ? routesWithReturn.map((route) => route.route).includes(routeUrl.id)
      : false;
  }

  getTitleKey(currentUrl: string, urlAfterRedirects: string): string {
    const routeUrl = this.getRouteCurrentUrl(currentUrl, urlAfterRedirects);
    return routeUrl ? routeUrl.translateKey : '';
  }

  getRouteNavigate(
    currentUrl: string,
    urlAfterRedirects: string
  ): string {
    const routeUrl = this.getRouteCurrentUrl(currentUrl, urlAfterRedirects);
    const idUrlReturn = routeUrl
      ? routesWithReturn.find((item) => item.route === routeUrl.id)?.return
      : '';
    return idUrlReturn
      ? routesMap.find((item) => item.id === idUrlReturn)?.path ?? ''
      : '';
  }

}
