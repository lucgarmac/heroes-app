import { Injectable } from '@angular/core';
import { IParams } from '../../../models/params';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleBarService {

  private _paramsTitleSubject = new Subject<IParams>();

  paramsTitle$ = this._paramsTitleSubject.asObservable();

  setParamsTitle(params: IParams) {
    this._paramsTitleSubject.next(params);
  }
}
