/**
 * Test Environment Global Setup
 */

import { MockSpeechSynthesis, MockSpeechSynthesisUtterance } from './mocks/webSpeechMock.js';
import { MockAudioContext } from './mocks/webAudioMock.js';
import { MockMediaRecorder } from './mocks/mediaRecorderMock.js';

const mockSpeech = new MockSpeechSynthesis();

// Configure Globals
if (typeof global !== 'undefined') {
  global.window = global.window || {
    speechSynthesis: mockSpeech,
    AudioContext: MockAudioContext,
    webkitAudioContext: MockAudioContext,
    addEventListener: () => {},
    removeEventListener: () => {},
    confirm: () => true,
  };

  global.speechSynthesis = mockSpeech;
  global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  global.AudioContext = MockAudioContext;
  global.MediaRecorder = MockMediaRecorder;

  global.document = global.document || {
    documentElement: {
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
      },
    },
    createElement: () => ({
      href: '',
      download: '',
      click: () => {},
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
  };

  try {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'iPad-Safari-Mock',
        mediaDevices: {
          getUserMedia: async () => ({
            getTracks: () => [{ stop: () => {} }],
          }),
        },
      },
      configurable: true,
      writable: true,
    });
  } catch {
    if (global.navigator) {
      try {
        global.navigator.mediaDevices = {
          getUserMedia: async () => ({
            getTracks: () => [{ stop: () => {} }],
          }),
        };
      } catch {}
    }
  }

  global.Audio = class MockAudio {
    constructor(src = '') {
      this.src = src;
      this.paused = true;
      this.currentTime = 0;
      this.onended = null;
      this.onerror = null;
    }
    play() {
      this.paused = false;
      setTimeout(() => {
        this.paused = true;
        if (this.onended) this.onended();
      }, 10);
      return Promise.resolve();
    }
    pause() {
      this.paused = true;
    }
  };

  global.ort = {
    env: {
      wasm: {
        wasmPaths: '/wasm/',
        numThreads: 1,
        simd: true,
      },
    },
    Tensor: class MockTensor {
      constructor(type, data, dims) {
        this.type = type;
        this.data = data;
        this.dims = dims;
      }
    },
    InferenceSession: {
      create: async () => ({
        run: async () => ({
          output: {
            data: new Float32Array(22050),
          },
        }),
      }),
    },
  };
}

export { mockSpeech };
