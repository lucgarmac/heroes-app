import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';



@NgModule({
  imports: [
    CommonModule,
    LoadingComponent
  ],
  exports: [LoadingComponent]
})
export class LoadingModule { }
