# Little Dance Club

A cute, cartoony 3D dance party starring a friendly Tung Tung Tung Sahur log character and Panda. Designed for little movers.

## Open it

Open **index.html** in a current browser with WebGL enabled. No installation or build step is required. All fonts and 3D libraries are included locally. The scene and bundled MP3 excerpt work offline.

For a local server, run `python3 -m http.server 8000` in this folder, then visit http://localhost:8000.

## Play

- Tap **Let’s dance!** to start dancing and music together. Tap **Take a break** to pause both; the next tap resumes them.
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
- `dance.js`: original procedural character models, animation, and MP3 playback controls.
- `audio/golden-dance.mp3`: a 60-second excerpt of the user-uploaded MP3, with normalized volume and short fades.
- `vendor/three.min.js`: Three.js 0.160.1, MIT licensed; license included.
- `vendor/`: Fredoka and DM Sans fonts, distributed under the SIL Open Font License; licenses included.

The characters and environment are built from 3D geometry, with a procedurally drawn wood texture. All models are generated in the browser; the music excerpt is bundled with the page.

## Music

The soundtrack is the first 60 seconds of the MP3 uploaded by the user in chat (a 192-second stereo recording). The excerpt is encoded as a 128 kbps MP3, normalized to -18 LUFS with a -2 dB true-peak target, and given a short fade-in/fade-out. Playback volume defaults to 45%. It replaces the earlier synthesized note loop.

The bundled audio uses native HTML audio, with no external player or service. It loads only after a dance tap, loops automatically, preserves its position when paused, remembers mute during the session, and pauses when switching away from the tab. Returning to the tab resumes music while dancing remains active. Browsers may require another tap if they block background resume.

## Validation

JavaScript syntax and local file references were checked. Chromium checks cover starting the actual MP3 with the dance button, audio progress, pause/resume, mute, looping, dance controls, and mobile layout. The generated MP3's format, duration, and size were verified with ffprobe.
