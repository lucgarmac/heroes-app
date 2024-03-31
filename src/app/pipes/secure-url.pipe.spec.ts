import { TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SecureUrlPipe } from './secure-url.pipe';

describe('SecureUrlPipe', () => {

  let sanitizer: DomSanitizer;
  let pipe: SecureUrlPipe;


  const domSanitizerMock = {
    bypassSecurityTrustUrl: (url) => `blob:http//:localhost/a228072a-0f87-4934-8012-147779a396c4.png`
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        {provide: DomSanitizer, useValue: domSanitizerMock}
      ]
    });

    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SecureUrlPipe(sanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should empty string if not received a url', () => {
    const urlMock = '';
    const result = pipe.transform(urlMock);
    expect(result).toBe(urlMock);
  });

  it('should return a safe url', () => {
    const urlMock = 'http://localhost:4200/image.png';
    const result = pipe.transform(urlMock);
    expect(result).toContain('blob:')
  });
});
