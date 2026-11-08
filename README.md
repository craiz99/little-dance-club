# Little Dance Club

A cute, cartoony 3D dance party starring a friendly Tung Tung Tung Sahur log character and Panda. Designed for little movers.

## Open it

Open **index.html** in a current browser with WebGL enabled. No installation or build step is required. All fonts and libraries are included locally; the page works offline.

For a local server, run `python3 -m http.server 8000` in this folder, then visit http://localhost:8000.

## Play

- Tap **Let’s dance!** to start dancing with a gentle original tune. Tap **Take a break** to pause.
- Choose **Bounce**, **Wiggle**, or **Spin**.
- Toggle sound using the top-right music button.
- Tap **Yay! Confetti** to celebrate.
- Tap either character or their name badge for a friendly greeting. Name badges also work with Tab and Enter/Space.

Sound starts only after interaction. The page respects the device’s reduced-motion preference by softening dances, disabling idle movement, and skipping confetti. There are no ads, scores, trackers, accounts, or external requests.

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
- `dance.js`: original procedural character models, animation, and Web Audio music.
- `vendor/three.min.js`: Three.js 0.160.1, MIT licensed; license included.
- `vendor/`: Fredoka and DM Sans fonts, distributed under the SIL Open Font License; licenses included.

The characters and environment are built from 3D geometry, with a procedurally drawn wood texture. No models or audio files need downloading.

## Validation

JavaScript syntax and local file references were checked. A Node simulation using the actual Three.js geometry classes checked scene construction, finite transforms, all dance modes, play/pause, sound controls, synthesized music, greetings, confetti, and reduced motion. Browser rendering, device performance, and audible playback still need a live-browser review; the managed environment did not provide its browser QA tool.
