# Phosfox / phosfox.us static site

A dependency-free static portfolio and project-notes site for `phosfox.us`.

## Local preview

From this directory:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

No build step is required. The site is `index.html`, `assets/site.css`, and
`assets/site.js`.

## Before publishing

The public project facts in the site are deliberately specific, but review
them once for wording you want to own. In particular:

- llm-password is presented as ECE 202C research, separate from AlmostBear, and links to its GitHub repository.
- AlmostBear names your deployment scope and labels broader application
  features as team work.
- Operand is described as a Fly.io-hosted two-player arithmetic game.
- Keywulf and EffiGov Voice Desk are featured with architecture and test evidence.
  EffiGov is explicitly a local demo; API tests do not establish voice behavior.
- See `VERIFICATION.md` for this update's review, publication and rollback steps.
- Mandelbrot Explorer is intentionally omitted from this version.
- No general GitHub-profile, LinkedIn, email address, or resume-PDF link is included because
  those URLs were not supplied. Add them only after setting their actual URLs.

## Password lab

The browser-only generator:

- samples from 256 three-letter and 256 four-letter visual/action words;
- uses one four-letter position and three three-letter positions;
- chooses one of 10 attachment styles;
- uses `crypto.getRandomValues()` rather than `Math.random()`;
- sends nothing to a server.

Its displayed "~47 nominal selection bits" refers to the generator's uniform
internal selections. It is a manual-password format, not a replacement for
password-manager-generated passwords on high-consequence accounts.

## Deployment

Read `DEPLOYMENT.md`.

## Theme toggle

The header includes a persisted theme toggle:

- **Dark** is the ember / dark portfolio presentation.
- **Light** is a dense, squared-off, high-contrast presentation with a blue / green / red accent rhythm.

The selection is stored in the visitor's browser with `localStorage`. Both
modes use the same orange five-pip die logo and favicon.


## v9 corrections

- Added spacing below the Password Lab heading.
- Reworded generator copy to describe its actual chunk and punctuation selection.
- Corrected the project limit text to use the public name `llm-password`.
- Removed modulo bias from the three-digit random selection.
