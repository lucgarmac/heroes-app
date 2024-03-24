import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [TranslateModule, MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  @Input() messageKey: string = '';
}
