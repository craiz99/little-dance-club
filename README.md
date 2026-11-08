# Little Dance Club

A cute, cartoony 3D dance party starring a friendly Tung Tung Tung Sahur log character and Panda. Designed for little movers.

## Open it

Open **index.html** in a current browser with WebGL enabled. No installation or build step is required. All fonts and 3D libraries are included locally. The scene and synthesized melody work offline.

For a local server, run `python3 -m http.server 8000` in this folder, then visit http://localhost:8000.

## Play

- Tap **Let’s dance!** to start dancing and the supplied melody together. Tap **Take a break** to pause both; the next tap resumes them.
- Choose **Bounce**, **Wiggle**, or **Spin**.
- Use the top-right sound button to mute/unmute music while the dance continues.
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
- `dance.js`: original procedural character models, animation, and Web Audio melody synthesis and playback controls.
- `vendor/three.min.js`: Three.js 0.160.1, MIT licensed; license included.
- `vendor/`: Fredoka and DM Sans fonts, distributed under the SIL Open Font License; licenses included.

The characters and environment are built from 3D geometry, with a procedurally drawn wood texture. No models or audio files need downloading.

## Music

The tune uses only the opening pattern, two repetitions of the next phrase, bridge transition, and two concluding repetitions supplied by the user in chat. It is a short repeating melody, not a transcription of the full song or the linked MuseScore arrangement.

No timing or explicit octave numbers were provided. The implementation interprets uppercase letters as octave 4 and lowercase letters as octave 5 (ABC-style notation), uses eighth notes at 100 BPM, holds each phrase's final note for one beat, and adds a quarter-beat rest between phrases. These are arrangement assumptions, not verified original-song timing. The soft keyboard sound is synthesized locally through Web Audio.

`golden-melody.mid` contains the same supplied notes and assumed rhythm as a standard MIDI file. The website does not need a MIDI library or a third-party player. It starts music only after a tap, remembers the mute choice, loops the excerpt, and pauses/resumes music with the dance button.

## Validation

JavaScript syntax and local file references were checked. The 3D scene was rendered in Chromium. Browser checks cover automatic audio start from the dance button, generated audio signal, pause/resume, mute, all dance modes, and the mobile layout.
