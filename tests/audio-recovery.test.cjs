const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { Midi } = require('../vendor/midi.js');

const root = path.join(__dirname, '..');
const encoded = fs.readFileSync(path.join(root, 'audio/theme-song.mid')).toString('base64');

function environment(failFirstOutput = false) {
  const contexts = [];
  const parameter = () => ({ value: 0, setValueAtTime() {}, setTargetAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} });
  const node = () => ({ connect() {}, disconnect() {}, start() {}, stop() {}, gain: parameter(), frequency: parameter() });
  class AudioContext {
    constructor() {
      this.state = 'suspended'; this.currentTime = 0; this.sampleRate = 44100;
      this.destination = {}; this.fails = failFirstOutput && contexts.length === 0;
      contexts.push(this);
    }
    async resume() {
      if (this.fails || this.state === 'closed') throw new Error('Audio output failed');
      this.state = 'running';
    }
    async suspend() { this.state = 'suspended'; }
    async close() { this.state = 'closed'; }
    createBuffer() { return {}; }
    createBufferSource() { return node(); }
    createGain() { return node(); }
    createOscillator() { return node(); }
    createDynamicsCompressor() {
      return { ...node(), threshold: parameter(), knee: parameter(), ratio: parameter(), attack: parameter(), release: parameter() };
    }
  }
  const context = {
    window: { Midi, AudioContext },
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    setInterval: () => 1, clearInterval() {},
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'theme-song-player.js'), 'utf8'), context);
  return { player: new context.window.ThemeSongPlayer(encoded), contexts };
}

test('a retry uses a fresh audio engine after output startup fails', async () => {
  const { player, contexts } = environment(true);
  await assert.rejects(player.play(), /Audio output failed/);
  assert.equal(player.context, null);
  assert.equal(player.running, false);
  await player.play();
  assert.equal(contexts.length, 2);
  assert.equal(player.context.state, 'running');
  assert.equal(player.running, true);
  player.pause();
});

for (const state of ['closed', 'interrupted']) {
  test(`a ${state} engine is replaced without restarting the song`, async () => {
    const { player, contexts } = environment();
    await player.play();
    player.context.currentTime = 12.5;
    const position = player.currentTime;
    player.context.state = state;
    await player.play();
    assert.equal(contexts.length, 2);
    assert.equal(player.context.state, 'running');
    assert.ok(Math.abs(player.currentTime - position) < .05);
    player.pause();
  });
}
