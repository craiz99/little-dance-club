"""Bundle the canonical MIDI as script data so index.html also works via file://."""
from base64 import b64encode
from pathlib import Path

root = Path(__file__).resolve().parents[1]
encoded = b64encode((root / "audio/theme-song.mid").read_bytes()).decode("ascii")
(root / "audio/theme-song-data.js").write_text(
    "// Generated from theme-song.mid by scripts/build-theme-song-data.py.\n"
    f'window.THEME_SONG_MIDI = "{encoded}";\n'
)
