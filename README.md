# Little Dance Club

A cute, cartoony 3D dance party starring a friendly Tung Tung Tung Sahur log character and Panda. Designed for little movers.

## Open it

Open **index.html** in a current browser with WebGL enabled. No installation or build step is required. All fonts and 3D libraries are included locally. The scene and MIDI theme song work offline.

For a local server, run `python3 -m http.server 8000` in this folder, then visit http://localhost:8000.

## Play

- Tap **Let’s dance!** to start dancing and music together. Tap **Take a break** to pause both; the next tap resumes them.
- Choose **Bounce**, **Wiggle**, or **Spin**.
- Use the top-right sound button to mute/unmute music. Turning sound on starts the dance if it was paused. If audio startup fails, **Retry sound** makes a fresh playback attempt.
- Tap **Yay! Confetti** to celebrate.
- Tap either character or their name badge for a friendly greeting. Name badges also work with Tab and Enter/Space.

Sound starts only after interaction. The page respects the device’s reduced-motion preference by softening dances, disabling idle movement, and skipping confetti. There are no scores, accounts, trackers, or external requests. Switching away from the tab pauses music until you return.

## Upload to GitHub Pages

1. Create or choose your GitHub repository.
2. Upload this folder’s **contents** to the repository root. Keep `index.html`, `styles.css`, `dance.js`, and the entire `vendor` folder together.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select your branch (usually `main`) and **/ (root)**, then save.
5. GitHub will show your published address when deployment completes.

You can also use a `/docs` folder and select that folder in Pages settings. No API keys, environment variables, or package manager are needed.

## Files and credits

- `index.html`: the page and controls.
- `styles.css`: responsive layout and styling.
- `dance.js`: original procedural character models, animation, and playback controls.
- `theme-song-player.js`: local Web Audio synthesis, MIDI scheduling, pause/resume, mute, and looping.
- `audio/theme-song.mid`: the full 3:12 theme song, automatically transcribed from the user-uploaded recording.
- `audio/theme-song-data.js`: generated script data containing the same MIDI bytes, for offline/file-based playback.
- `vendor/midi.js`: @tonejs/midi 2.0.28 parser, MIT licensed; license included.
- `vendor/three.min.js`: Three.js 0.160.1, MIT licensed; license included.
- `vendor/`: Fredoka and DM Sans fonts, distributed under the SIL Open Font License; licenses included.

The characters and environment are built from 3D geometry, with a procedurally drawn wood texture. All models are generated in the browser; the music excerpt is bundled with the page.

## Music

The theme song is a full-length automatic MIDI transcription of the uploaded recording: about 3:12 and 2,240 detected notes. The source recording and earlier short MIDI loop have been removed from this version. The file and its MIDI track names use “Theme song.” Transcription is approximate; some notes/chords may need cleanup. It uses a soft keyboard-style sound rather than reproducing the original recording's instruments.

MIDI playback is synthesized locally using Web Audio and a bundled MIDI parser. The first dance tap unlocks audio and starts the music. The music loops, pauses and resumes with dancing, remembers mute during the session, and pauses when switching away from the tab. No external player, soundfont download, or runtime service is required. Browsers may require another tap if they block background resume.

`audio/theme-song.mid` is the canonical music file. `audio/theme-song-data.js` embeds those same bytes so opening `index.html` directly still works. After replacing the MIDI, regenerate the data file with:

```sh
python3 scripts/build-theme-song-data.py
```

No regeneration is required to use this checkout.

## Validation

Run the MIDI and audio-recovery checks with `node --test tests/*.test.cjs`. JavaScript syntax, full MIDI duration and notes, and the embedded MIDI's consistency are checked. Chromium verification covers sound starting with the dance button, pause/resume, mute, looping, rapid clicks, tab visibility, and mobile layout. Recovery checks cover failed output startup and replacement of closed/interrupted audio engines.
