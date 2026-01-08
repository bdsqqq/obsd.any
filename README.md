# .any

map any file extension to any obsidian view.

## install

### manual
1. download latest release
2. extract to `.obsidian/plugins/dot-any/`
3. enable in settings → community plugins

### brat
1. install [BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. add `bdsqqq/obsd.any`

## usage

open settings → .any. you'll see a text input for each view type (markdown, image, audio, video, pdf, canvas). add comma-separated extensions to map them.

changes apply immediately—no restart needed.

## what it does

uses obsidian's `registerExtensions()` to route file types to built-in views. no custom views created; just unlocks existing obsidian functionality for more extensions.

ships with defaults for common cases:
- **code/config** → markdown view: `.py`, `.rs`, `.go`, `.sh`, `.toml`, `.c`, `.cpp`, etc.
- **extra audio** → audio view: `.aiff`, `.wma` (obsidian misses these)
- **extra video** → video view: `.avi`, `.wmv`, `.m4v`, `.flv`
- **extra image** → image view: `.ico`, `.tiff`

obsidian already handles `.txt`, `.js`, `.ts`, `.json`, `.yaml`, `.md`, `.png`, `.mp3`, etc.—the plugin skips these by default. you can override this in settings if you want.

## how it works

**view discovery**: pulls available view types from `app.viewRegistry.viewByType`, filtering out panel views (graph, backlinks, etc.). works with views from other plugins too.

**protected extensions**: maintains a list of extensions obsidian handles natively. warns you if you remove one from the list (you're opting out of obsidian's behavior).

**clean unload**: uses the undocumented but stable `app.viewRegistry.unregisterExtensions()` to properly deregister when disabled. without this, extensions stay registered until obsidian restarts.

## prior art

inspired by [custom-file-extensions-plugin](https://github.com/MeepTech/obsidian-custom-file-extensions-plugin). that plugin does the same thing and has view discovery too. main difference: we use per-view-type text inputs instead of a single json blob, and ship with defaults so it works out of the box. they have mobile-specific settings we don't.

## development

```bash
npm install
npm run dev
npm run build
```

## license

MIT
