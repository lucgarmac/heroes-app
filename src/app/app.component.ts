import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { FooterModule } from './components/footer/footer.module';
import { LoadingModule } from './components/loading/loading.module';
import { LoadingService } from './components/loading/services/loading.service';
import { of, delay } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarModule, FooterModule, LoadingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  constructor(private _loadingService: LoadingService){}

  ngOnInit(): void {
    this._loadingService.show('Ejemplo de loading')

    of([]).pipe(delay(600)).subscribe( () => this._loadingService.hide())

  }
}
