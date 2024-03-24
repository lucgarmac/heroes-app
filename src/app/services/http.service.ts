import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  parseToHttpParams(request: any) {
    let httpParams = new HttpParams();
    Object.keys(request).forEach(key => {
      httpParams = httpParams.append(key, request[key])
    })
    return httpParams;
  }

}
