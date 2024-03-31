import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropDirective } from './drag-drop.directive';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<div
    appDragDrop
    (dataReceived)="onDataTransferReceived($event)"
  ></div>`,
  imports: [DragDropDirective],
})
class TestComponent {
  onDataTransferReceived(event: any) {}
}

describe('DragDropDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: DragDropDirective;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [DragDropDirective, TestComponent],
    }).createComponent(TestComponent);

    directive = fixture.debugElement.children[0].injector.get(DragDropDirective);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });


  it('should emit an empty array if there are not items in data transfer', () => {
    spyOn(component, 'onDataTransferReceived');
    directive.onDrop(new DragEvent('drop'));
    expect(component.onDataTransferReceived).toHaveBeenCalledWith([]);
  });

  it('should emit an array when drop items', ()=> {
    spyOn(component, 'onDataTransferReceived');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File(['test'], 'text.png'));
    directive.onDrop(new DragEvent('drop', {dataTransfer}));
    expect(component.onDataTransferReceived).toHaveBeenCalledWith([dataTransfer.items[0]]);
  })
});
