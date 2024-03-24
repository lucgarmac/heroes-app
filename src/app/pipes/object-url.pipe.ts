import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectUrl',
  standalone: true
})
export class ObjectUrlPipe implements PipeTransform {

  transform(value: string | Blob | MediaSource): string {
    if(typeof value === 'string') {
      return value;
    }
    return URL.createObjectURL(value);
  }

}
