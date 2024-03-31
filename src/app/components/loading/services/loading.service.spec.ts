import { TestBed } from '@angular/core/testing';

import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { LoadingComponent } from '../loading.component';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  let overlay: Overlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        LoadingComponent
      ],
      providers: [Overlay]
    });

    service = TestBed.inject(LoadingService);
    overlay = TestBed.inject(Overlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an overlay and show modal with a empty message when show method is invoked', () => {
    const overlayRef = overlay.create();
    const createSpy = spyOn(overlay, 'create')
      .and.callThrough()
      .and.returnValue(overlayRef);
    const attachSpy = spyOn(overlayRef, 'attach').and.callThrough();

    service.show();

    const componentRef = attachSpy.calls.mostRecent().returnValue;

    expect(createSpy).toHaveBeenCalled();
    expect(attachSpy).toHaveBeenCalled();
    expect(componentRef.instance.messageKey).toBe('');
  });

  it('should create an overlay and show modal with a message when show method is invoked', () => {
    const overlayRef = overlay.create();
    const createSpy = spyOn(overlay, 'create')
      .and.callThrough()
      .and.returnValue(overlayRef);
    const attachSpy = spyOn(overlayRef, 'attach').and.callThrough();
    const messageMock = 'Test';

    service.show(messageMock);

    const componentRef = attachSpy.calls.mostRecent().returnValue;

    expect(createSpy).toHaveBeenCalled();
    expect(attachSpy).toHaveBeenCalled();
    expect(componentRef.instance.messageKey).toBe(messageMock);
  });

  it('should detach overlay when hide method is invoked', () => {
    const overlayRef = overlay.create();
    const createSpy = spyOn(overlay, 'create')
    .and.callThrough()
    .and.returnValue(overlayRef);
    const attachSpy = spyOn(overlayRef, 'attach').and.callThrough();
    const detachSpy = spyOn(overlayRef, 'detach');

    service.show();
    expect(createSpy).toHaveBeenCalled();
    expect(attachSpy).toHaveBeenCalled();

    service.hide();
    expect(detachSpy).toHaveBeenCalled();
  });

});
