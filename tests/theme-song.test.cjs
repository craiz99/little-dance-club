const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { Midi } = require('../vendor/midi.js');

const root = path.join(__dirname, '..');
const bytes = fs.readFileSync(path.join(root, 'audio/theme-song.mid'));
const song = new Midi(bytes);

test('the theme song retains the full recording and detected notes', () => {
  const notes = song.tracks.flatMap(track => track.notes);
  const duration = Math.max(...song.tracks.map(track => song.header.ticksToSeconds(track.endOfTrackTicks || 0)));
  assert.equal(notes.length, 2240);
  assert.ok(Math.abs(duration - 192.156719) < .01);
  for (const track of song.tracks) assert.equal(track.name, 'Theme song');
  for (const note of notes) {
    assert.ok(Number.isFinite(note.time) && note.time >= 0);
    assert.ok(Number.isFinite(note.duration) && note.duration > 0);
    assert.ok(note.time + note.duration <= duration);
    assert.ok(note.midi >= 0 && note.midi <= 127);
    assert.ok(note.velocity > 0 && note.velocity <= 1);
  }
  for (let start = 0; start < 180; start += 30) {
    assert.ok(notes.some(note => note.time >= start && note.time < start + 30));
  }
  assert.ok(notes.some(note => note.time > 180));
});

test('offline MIDI data is identical to the canonical file', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'audio/theme-song-data.js'), 'utf8'), context);
  assert.deepEqual(Buffer.from(context.window.THEME_SONG_MIDI, 'base64'), bytes);
});
