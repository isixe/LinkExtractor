# Link Extractor

A free, privacy-first tool for batch link extraction, validation, and export. All processing happens locally in your browser — nothing is uploaded to any server.

## Features

- **Batch URL Extraction** — Automatically extract all links from plain text and multiple file formats (TXT, JSON, MD, HTML, XML, CSV, JS, TS, JSX, TSX)
- **Link Validation** — Concurrently check each link's availability with 5 threads; detect success, failure, and timeout with HTTP status codes
- **Multiple Export Formats** — Export results as TXT, JSON, or CSV for data analysis, documentation, and reporting
- **Smart Filtering** — Filter links by status: all, valid, invalid, pending
- **Re-verification** — Re-check individual failed or timed-out links without re-extracting everything
- **Domain Grouping** — Group links by domain for organized browsing
- **Search** — Search through extracted links by URL

## Tech Stack

| Category             | Technology                            |
| -------------------- | ------------------------------------- |
| Framework            | Astro 6.3 + React 19                  |
| Language             | TypeScript                            |
| Styling              | Tailwind CSS 4                        |
| Internationalization | i18next + react-i18next (auto-detect) |
| Runtime              | Node.js >= 22.12.0                    |

## Installation

### Prerequisites

- Node.js >= 22.12.0
- pnpm (recommended) or npm

### Clone & Install

```bash
git clone https://github.com/yourusername/link-extractor.git
cd link-extractor
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:4321`.

### Build for Production

```bash
pnpm build
```

Output is written to `./dist/`.

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
link-extractor/
├── public/                  # Static assets
├── src/
│   ├── assets/
│   │   └── icons/           # SVG icon components
│   ├── components/
│   │   ├── link-extractor.tsx  # Main orchestrator component
│   │   ├── text-input.tsx      # Text paste input
│   │   ├── file-upload.tsx     # Drag & drop / file picker
│   │   ├── link-card.tsx       # Individual link display
│   │   ├── domain-group.tsx    # Domain-grouped link list
│   │   ├── filter-bar.tsx      # Status filter buttons
│   │   ├── action-bar.tsx      # Copy/export/check/clear toolbar
│   │   ├── header.tsx          # Site header
│   │   ├── language-toggle.tsx # Language switcher
│   │   ├── theme-toggle.tsx    # Theme toggle
│   │   ├── progress.tsx        # Progress bar
│   │   ├── badge.tsx           # Badge component
│   │   ├── button.tsx          # Button component
│   │   └── icons.tsx           # Icon exports
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── link-utils.ts       # Link extraction/validation/export logic
│   │   ├── utils.ts            # General utilities (cn)
│   │   └── i18n/               # i18n alias (deprecated)
│   ├── locales/
│   │   ├── i18n.ts             # i18next configuration
│   │   ├── en/common.json      # English translations
│   │   └── zh/common.json      # Chinese translations
│   ├── pages/
│   │   └── index.astro         # Single-page entry
│   ├── providers/              # App providers
│   ├── styles/
│   │   └── global.css          # Global styles & CSS variables
│   ├── types/
│   │   └── app.d.ts            # TypeScript type declarations
│   └── utils/                  # Utility functions
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Supported File Formats

| Format | Extensions                   |
| ------ | ---------------------------- |
| Text   | `.txt`, `.md`, `.csv`        |
| Code   | `.js`, `.ts`, `.jsx`, `.tsx` |
| Web    | `.html`, `.htm`, `.xml`      |
| Data   | `.json`                      |

Upload files via drag & drop or file picker, or paste text directly.

## License

This project is licensed under the [MIT](LICENSE) License.