import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { LoadingComponent } from '../loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _overlayRef: OverlayRef | null = null;

  constructor(private _overlay: Overlay) { }

  show(message?: string){
    if(!this._overlayRef) {
      this._overlayRef = this._overlay.create();
    }

    const component:ComponentPortal<LoadingComponent> = new ComponentPortal(LoadingComponent,null);
    const componentRef: ComponentRef<LoadingComponent> = this._overlayRef.attach(component);
    componentRef.instance.message = message ?? '';
  }

  hide(){
    if(this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
