# Little Dance Club

A cute, cartoony 3D dance party starring a friendly Tung Tung Tung Sahur log character and Panda. Designed for little movers.

## Open it

Open **index.html** in a current browser with WebGL enabled. No installation or build step is required. All fonts and 3D libraries are included locally; the scene works offline. Golden playback requires an internet connection to MuseScore.

For a local server, run `python3 -m http.server 8000` in this folder, then visit http://localhost:8000.

## Play

- Tap **Let’s dance!** to start dancing and reveal the Golden piano player. Tap Play inside the MuseScore player to start music. Tap **Take a break** to pause dancing and stop/reset music.
- Choose **Bounce**, **Wiggle**, or **Spin**.
- Use the top-right **Music** button to open the player, or **Stop music** to stop playback.
- Tap **Yay! Confetti** to celebrate.
- Tap either character or their name badge for a friendly greeting. Name badges also work with Tab and Enter/Space.

Sound starts only after interaction. The page respects the device’s reduced-motion preference by softening dances, disabling idle movement, and skipping confetti. The scene has no scores or accounts. The music player loads MuseScore only after a Music or Let’s dance! click; MuseScore controls its own cookies, external requests, playback controls, and availability.

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
- `dance.js`: original procedural character models, animation, and music-player lifecycle controls.
- `vendor/three.min.js`: Three.js 0.160.1, MIT licensed; license included.
- `vendor/`: Fredoka and DM Sans fonts, distributed under the SIL Open Font License; licenses included.

The characters and environment are built from 3D geometry, with a procedurally drawn wood texture. No models or audio files need downloading.

## Music and validation

Golden plays through the [official MuseScore embed of the user-selected simplified piano score](https://musescore.com/user/5872086/scores/26406532). The site does not copy or host the composition, MIDI, sheet music, or audio. MuseScore requires its own Play tap; our dance button cannot control that cross-origin player's playback. Taking a break or selecting Stop music removes the frame and stops/resets playback. Closing the player does not stop the dancing.

JavaScript syntax and local file references were checked. The 3D scene was rendered in Chromium. The original dance controls were checked in a Node simulation. The MuseScore player was tested in Chromium, including actual media progress after clicking its Play control. Music availability depends on MuseScore and internet access.
