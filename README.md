# .any

map any file extension to any view.

## what it does

maps file extensions to obsidian's built-in views (markdown, image, audio, video, pdf, canvas). no new views created—just unlocks existing obsidian functionality for more file types.

## features

- **61 default mappings** for common file types (code, configs, text, media)
- **settings UI** with per-view-type extension lists
- **dynamic view discovery** - works with views from other plugins too
- **protected extensions** - warns before overriding .md, .canvas, etc.
- **clean unload** - properly unregisters when disabled

## default mappings

### text/code → markdown view
`.py`, `.sh`, `.sql`, `.rs`, `.go`, `.c`, `.cpp`, and 50+ more

note: obsidian natively handles `.txt`, `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.yaml`, `.yml`, `.html`, `.css`, and more—the plugin skips these (doesn't register them).

### media extensions
- **audio**: `.aiff`, `.aif`, `.wma` (supplements obsidian's defaults)
- **video**: `.avi`, `.wmv`, `.m4v`, `.flv`
- **image**: `.ico`, `.tiff`, `.tif`

## usage

1. install the plugin
2. open settings → .any
3. add/edit/remove extension mappings as needed
4. changes apply immediately (no restart needed)

## settings

| option | description |
|--------|-------------|
| per-view-type extension lists | text inputs for each available view type (markdown, image, audio, video, pdf, canvas). edit comma-separated extensions directly. |
| reset to defaults | restore all mappings to defaults |
| use obsidian's native behavior | defer to obsidian for extensions it already handles (`.txt`, `.js`, `.ts`, etc.). when enabled, the plugin skips registering these. |

## api notes

uses obsidian's `registerExtensions()` API. deregistration uses the undocumented but stable `app.viewRegistry.unregisterExtensions()` method.

## prior art

inspired by [custom-file-extensions-plugin](https://github.com/MeepTech/obsidian-custom-file-extensions-plugin). key improvements:
- proper settings UI (no raw JSON editing)
- extensive defaults out of the box
- dynamic view type discovery

## installation

### manual
1. download latest release
2. extract to `.obsidian/plugins/dot-any/`
3. enable in settings → community plugins

### brat (beta testing)
1. install [BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. add `bdsqqq/obsd.any` via BRAT

## development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
```

## license

MIT
