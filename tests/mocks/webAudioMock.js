/**
 * Web Audio API Mock for Testing Environment
 */

export class MockAudioNode {
  connect(dest) {
    return dest;
  }
  disconnect() {}
}

export class MockAudioParam {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }
  setValueAtTime(value, time) {
    this.value = value;
  }
  exponentialRampToValueAtTime(value, time) {
    this.value = value;
  }
  linearRampToValueAtTime(value, time) {
    this.value = value;
  }
}

export class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = new MockAudioParam(1.0);
  }
}

export class MockOscillatorNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
    this.started = false;
    this.stopped = false;
  }

  start(time = 0) {
    this.started = true;
  }

  stop(time = 0) {
    this.stopped = true;
  }
}

export class MockAudioContext {
  constructor() {
    this.state = 'suspended';
    this.currentTime = 0;
    this.destination = new MockAudioNode();
    this.createdOscillators = [];
  }

  createGain() {
    return new MockGainNode();
  }

  createOscillator() {
    const osc = new MockOscillatorNode();
    this.createdOscillators.push(osc);
    return osc;
  }

  createBuffer(channels, length, sampleRate) {
    return { channels, length, sampleRate };
  }

  createBufferSource() {
    return {
      buffer: null,
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  async resume() {
    this.state = 'running';
  }

  async suspend() {
    this.state = 'suspended';
  }

  async close() {
    this.state = 'closed';
  }
}
