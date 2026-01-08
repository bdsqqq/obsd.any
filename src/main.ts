import { Plugin } from "obsidian";
import { AnyFileSettings, Extension, ViewType } from "./types";
import { DEFAULT_MAPPINGS, OBSIDIAN_HANDLED_EXTENSIONS } from "./defaults";
import { AnyFileSettingTab } from "./settings";

const CURRENT_SETTINGS_VERSION = 2;

const DEFAULT_SETTINGS: AnyFileSettings = {
  mappings: { ...DEFAULT_MAPPINGS },
  obsidianDefaults: [...OBSIDIAN_HANDLED_EXTENSIONS],
  settingsVersion: CURRENT_SETTINGS_VERSION,
};

export default class AnyFilePlugin extends Plugin {
  settings: AnyFileSettings = DEFAULT_SETTINGS;
  registeredExtensions: Set<Extension> = new Set();
  registrationErrors: Record<Extension, string> = {};

  async onload() {
    await this.loadSettings();
    this.registerAllExtensions();
    this.addSettingTab(new AnyFileSettingTab(this.app, this));
  }

  onunload() {
    this.unregisterAllExtensions();
  }

  async loadSettings() {
    const loaded = await this.loadData();
    if (loaded) {
      this.settings = {
        mappings: { ...DEFAULT_SETTINGS.mappings, ...loaded.mappings },
        obsidianDefaults: loaded.obsidianDefaults ?? [...DEFAULT_SETTINGS.obsidianDefaults],
        settingsVersion: CURRENT_SETTINGS_VERSION,
      };
    } else {
      this.settings = {
        mappings: { ...DEFAULT_SETTINGS.mappings },
        obsidianDefaults: [...DEFAULT_SETTINGS.obsidianDefaults],
        settingsVersion: CURRENT_SETTINGS_VERSION,
      };
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  registerAllExtensions() {
    for (const [ext, viewType] of Object.entries(this.settings.mappings)) {
      if (this.settings.obsidianDefaults.includes(ext)) {
        continue;
      }
      this.registerSingleExtension(ext, viewType);
    }
  }

  registerSingleExtension(ext: Extension, viewType: ViewType) {
    try {
      this.registerExtensions([ext], viewType);
      this.registeredExtensions.add(ext);
      delete this.registrationErrors[ext];
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`any-file: failed to register .${ext} - ${msg}`);
      this.registrationErrors[ext] = msg;
    }
  }

  unregisterAllExtensions() {
    for (const ext of this.registeredExtensions) {
      try {
        // @ts-expect-error - obsidian's public API has registerExtensions() but no
        // corresponding unregister. viewRegistry.unregisterExtensions() exists on the
        // internal ViewRegistry class. without this, extensions stay registered until
        // obsidian restarts, breaking the refresh-on-settings-change flow.
        this.app.viewRegistry.unregisterExtensions([ext]);
      } catch {
        console.warn(`any-file: failed to unregister .${ext}`);
      }
    }
    this.registeredExtensions.clear();
  }

  syncRegistrations() {
    this.unregisterAllExtensions();
    this.registrationErrors = {};
    this.registerAllExtensions();
  }
}
