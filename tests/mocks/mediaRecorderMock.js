/**
 * MediaRecorder API Mock for Testing Environment
 */

export class MockMediaRecorder {
  static isTypeSupported(type) {
    return type === 'audio/webm' || type === 'audio/mp4';
  }

  constructor(stream, options = {}) {
    this.state = 'inactive';
    this.stream = stream;
    this.options = options;
    this.ondataavailable = null;
    this.onstop = null;
  }

  start(timeslice = 100) {
    this.state = 'recording';
  }

  stop() {
    this.state = 'inactive';
    if (this.ondataavailable) {
      this.ondataavailable({ data: { size: 1024 } });
    }
    if (this.onstop) {
      this.onstop();
    }
  }
}
