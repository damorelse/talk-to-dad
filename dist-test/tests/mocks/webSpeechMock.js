/**
 * Web Speech API Mock for Testing Environment
 */

export class MockSpeechSynthesisVoice {
  constructor(name, lang = 'en-US', voiceURI = name) {
    this.name = name;
    this.lang = lang;
    this.voiceURI = voiceURI;
    this.default = false;
    this.localService = true;
  }
}

export class MockSpeechSynthesisUtterance {
  constructor(text = '') {
    this.text = text;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.voice = null;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onboundary = null;
  }
}

export class MockSpeechSynthesis {
  constructor() {
    this.speaking = false;
    this.paused = false;
    this.pending = false;
    this.onvoiceschanged = null;
    this.voices = [
      new MockSpeechSynthesisVoice('Google US English', 'en-US', 'google-us-english'),
      new MockSpeechSynthesisVoice('Samantha', 'en-US', 'com.apple.speech.synthesis.voice.samantha'),
      new MockSpeechSynthesisVoice('Daniel', 'en-GB', 'com.apple.speech.synthesis.voice.daniel'),
      new MockSpeechSynthesisVoice('Alex', 'en-US', 'com.apple.speech.synthesis.voice.alex'),
      new MockSpeechSynthesisVoice('Google 國語（臺灣）', 'zh-TW', 'google-cmn-tw'),
      new MockSpeechSynthesisVoice('Mei-Jia', 'zh-TW', 'com.apple.speech.synthesis.voice.meijia'),
    ];
    this.lastSpokenText = null;
    this.speakHistory = [];
  }

  getVoices() {
    return [...this.voices];
  }

  speak(utterance) {
    this.speaking = true;
    this.lastSpokenText = utterance.text;
    this.speakHistory.push(utterance.text);

    if (utterance.onstart) utterance.onstart();

    if (utterance.text) {
      const words = utterance.text.split(' ');
      let charIdx = 0;
      words.forEach((w) => {
        if (utterance.onboundary) {
          utterance.onboundary({ name: 'word', charIndex: charIdx, elapsedTime: 10 });
        }
        charIdx += w.length + 1;
      });
    }

    setTimeout(() => {
      this.speaking = false;
      if (utterance.onend) utterance.onend();
    }, 20);
  }

  cancel() {
    this.speaking = false;
    this.pending = false;
    this.paused = false;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}
