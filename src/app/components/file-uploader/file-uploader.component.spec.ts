import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderComponent } from './file-uploader.component';
import { TranslateModule } from '@ngx-translate/core';

describe('FileUploaderComponent', () => {
  let component: FileUploaderComponent;
  let fixture: ComponentFixture<FileUploaderComponent>;

  let emitSpy: jasmine.Spy;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FileUploaderComponent,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    emitSpy = spyOn(component.fileUpload, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set an error and emit a null value when a file is not selected', () => {
    component.onFileSelected(null);

    expect(component.fileSelected()).toBe(null);
    expect(component.filename()).toBe(null);
    expect(component.inputFileComponent.nativeElement.files.length).toBe(0);
    expect(component.messageError()).toBe('COMPONENTS.FILE_UPLOADER.VALIDATIONS.FILE_NOT_SELECTED');
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('should set an error and emit a null value when a file contains an invalid extendsion', () => {
    component.onFileSelected({
      target: {
        files: [
          {name: 'test.txt'}
        ]
      }
    });

    expect(component.messageError()).toBe('COMPONENTS.FILE_UPLOADER.VALIDATIONS.EXTENSION_NOT_ALLOWED');
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('should set an error and emit a null value when a file contains an invalid extendsion', () => {
    component.onFileSelected({
      target: {
        files: [
          {
            name: 'test.png',
            size: 0
          }
        ]
      }
    });

    expect(component.messageError()).toBe('COMPONENTS.FILE_UPLOADER.VALIDATIONS.FILE_EMPTY');
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('should update internal file selected and emit this value when selected file is valid', () => {
    const mockFile = new File(['hello world'], 'test.png');
    component.onFileSelected({
      target: {
        files: [ mockFile]
      }
    });

    expect(component.messageError()).toBe(null);
    expect(component.fileSelected()).toBe(mockFile);
    expect(component.filename()).toBe('test.png');
    expect(emitSpy).toHaveBeenCalledWith(mockFile);
  });

  it('should clear file selected when remove current file', ()=> {
    const mockFile = new File(['hello world'], 'test.png');
    component.onFileSelected({
      target: {
        files: [ mockFile]
      }
    });
    component.onRemoveFile();

    expect(component.fileSelected()).toBe(null);
    expect(component.filename()).toBe(null);
    expect(component.inputFileComponent.nativeElement.files.length).toBe(0);
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('should set an error and emit a null value when data transfer list received is empty', () => {

    component.onDataTransferReceived([]);

    expect(component.messageError()).toBe('COMPONENTS.FILE_UPLOADER.VALIDATIONS.FILE_NOT_SELECTED');
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('should update internal file selected and emit this value when data transfer is valid', () => {
    const mockFile = new File(['hello world'], 'test.png');

    const dataTransferItemMock = {
      kind: 'file',
      type: 'text/plain',
      getAsString: (callback: FunctionStringCallback | null): void => callback(''),
      getAsFile: (): File => mockFile,
      webkitGetAsEntry: () => null
    }

    component.onDataTransferReceived([dataTransferItemMock]);

    expect(component.messageError()).toBe(null);
    expect(component.fileSelected()).toBe(mockFile);
    expect(component.filename()).toBe('test.png');
    expect(emitSpy).toHaveBeenCalledWith(mockFile);
  });
});
