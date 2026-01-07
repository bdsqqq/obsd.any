import { Plugin } from "obsidian";
import { AnyFileSettings } from "./types";
import { DEFAULT_MAPPINGS } from "./defaults";
import { AnyFileSettingTab } from "./settings";

const DEFAULT_SETTINGS: AnyFileSettings = {
  mappings: { ...DEFAULT_MAPPINGS },
  protectDefaults: true,
};

export default class AnyFilePlugin extends Plugin {
  settings: AnyFileSettings = DEFAULT_SETTINGS;
  registeredExtensions: Set<string> = new Set();
  registrationErrors: Record<string, string> = {};

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
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  registerAllExtensions() {
    for (const [ext, viewType] of Object.entries(this.settings.mappings)) {
      this.registerSingleExtension(ext, viewType);
    }
  }

  registerSingleExtension(ext: string, viewType: string) {
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
        // @ts-expect-error - private API, no public unregister method
        this.app.viewRegistry.unregisterExtensions([ext]);
      } catch (e) {
        console.warn(`any-file: failed to unregister .${ext}`);
      }
    }
    this.registeredExtensions.clear();
  }

  /**
   * re-register all extensions after settings change.
   * unregisters old mappings first to avoid conflicts.
   */
  async refreshMappings() {
    this.unregisterAllExtensions();
    this.registerAllExtensions();
  }
}
