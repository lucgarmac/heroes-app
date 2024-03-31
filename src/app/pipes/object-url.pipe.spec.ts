import { ObjectUrlPipe } from './object-url.pipe';

describe('ObjectUrlPipe', () => {
  const pipe = new ObjectUrlPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return value when received a url', ()=> {
    const valueMock = 'test';
    const result = pipe.transform(valueMock);
    expect(result).toBe(valueMock);
  });

  it('should return an object url when received a blob', () => {
    const blob = new Blob(['test'], {type: 'text/plain'});
    const result = pipe.transform(blob);
    expect(result).toContain('blob:');
  });
});
