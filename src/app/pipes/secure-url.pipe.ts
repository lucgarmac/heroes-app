import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'secureUrl',
  standalone: true
})
export class SecureUrlPipe implements PipeTransform {

  constructor(private _domSanitize: DomSanitizer){}

  transform(url: string): SafeUrl {
    if(!url) {
      return '';
    }
    return this._domSanitize.bypassSecurityTrustUrl(url);
  }

}
