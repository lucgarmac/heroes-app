import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleBarComponent } from './title-bar.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TitleBarComponent
  ],
  exports: [TitleBarComponent]
})
export class TitleBarModule { }
