import { App, PluginSettingTab, Setting } from "obsidian";
import AnyFilePlugin from "./main";
import { DEFAULT_MAPPINGS, OBSIDIAN_HANDLED_EXTENSIONS } from "./defaults";

const PANEL_VIEWS = [
  "graph",
  "localgraph",
  "backlink",
  "outgoing-link",
  "search",
  "file-explorer",
  "starred",
  "bookmarks",
  "tag-pane",
  "outline",
];

export class AnyFileSettingTab extends PluginSettingTab {
  plugin: AnyFilePlugin;

  constructor(app: App, plugin: AnyFilePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("any-file-settings");

    containerEl.createEl("h2", { text: ".any" });

    const fileViewTypes = this.getFileViewTypes();
    const grouped = this.groupByViewType();

    for (const viewType of fileViewTypes) {
      const extensions = grouped[viewType] || [];
      this.renderViewTypeSetting(containerEl, viewType, extensions);
    }

    this.renderObsidianDefaultsSetting(containerEl);

    new Setting(containerEl)
      .setName("reset to defaults")
      .setDesc("restore all mappings to default values")
      .addButton((btn) =>
        btn
          .setButtonText("reset")
          .setWarning()
          .onClick(async () => {
            const confirmed = confirm(
              "reset all mappings to defaults? this cannot be undone."
            );
            if (confirmed) {
              this.plugin.settings.mappings = { ...DEFAULT_MAPPINGS };
              this.plugin.settings.obsidianDefaults = [...OBSIDIAN_HANDLED_EXTENSIONS];
              await this.plugin.saveSettings();
              await this.plugin.refreshMappings();
              this.display();
            }
          })
      );

    if (Object.keys(this.plugin.registrationErrors).length > 0) {
      containerEl.createEl("h3", { text: "registration errors" });
      const errorList = containerEl.createEl("ul", { cls: "any-file-errors" });
      for (const [ext, error] of Object.entries(
        this.plugin.registrationErrors
      )) {
        errorList.createEl("li", { text: `.${ext}: ${error}` });
      }
    }
  }

  private getFileViewTypes(): string[] {
    // @ts-expect-error - viewRegistry.viewByType is private
    const allTypes = Object.keys(this.app.viewRegistry.viewByType);
    return allTypes.filter((t) => !PANEL_VIEWS.includes(t)).sort();
  }

  private groupByViewType(): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    for (const [ext, viewType] of Object.entries(this.plugin.settings.mappings)) {
      if (!grouped[viewType]) grouped[viewType] = [];
      grouped[viewType].push(ext);
    }
    for (const viewType of Object.keys(grouped)) {
      grouped[viewType].sort();
    }
    return grouped;
  }

  private renderViewTypeSetting(
    containerEl: HTMLElement,
    viewType: string,
    extensions: string[]
  ): void {
    const setting = new Setting(containerEl)
      .setName(viewType)
      .setDesc("");

    let errorEl: HTMLElement | null = null;

    setting.addText((text) => {
      text
        .setPlaceholder("txt, log, json, ...")
        .setValue(extensions.join(", "));

      text.inputEl.addClass("any-file-ext-list");

      errorEl = setting.controlEl.createEl("div", { cls: "any-file-hint" });

      text.inputEl.addEventListener("input", () => {
        const value = text.getValue();
        const result = this.parseAndValidate(value, viewType);
        
        if (result.errors.length > 0) {
          text.inputEl.addClass("any-file-input-error");
          if (errorEl) {
            errorEl.empty();
            errorEl.addClass("any-file-hint-error");
            for (const err of result.errors) {
              errorEl.createEl("div", { text: err });
            }
          }
        } else {
          text.inputEl.removeClass("any-file-input-error");
          if (errorEl) {
            errorEl.empty();
            errorEl.removeClass("any-file-hint-error");
          }
        }
      });

      text.inputEl.addEventListener("blur", async () => {
        const value = text.getValue();
        const result = this.parseAndValidate(value, viewType);
        
        if (result.errors.length === 0) {
          await this.applyExtensions(viewType, result.extensions);
          this.display();
        }
      });
    });
  }

  private renderObsidianDefaultsSetting(containerEl: HTMLElement): void {
    const currentDefaults = this.plugin.settings.obsidianDefaults;
    const removed = OBSIDIAN_HANDLED_EXTENSIONS.filter(
      (ext) => !currentDefaults.includes(ext)
    );

    const setting = new Setting(containerEl)
      .setName("use obsidian's native behaviour for")
      .setDesc("");

    let hintEl: HTMLElement | null = null;

    setting.addText((text) => {
      text
        .setPlaceholder("md, pdf, png, ...")
        .setValue(currentDefaults.join(", "));

      text.inputEl.addClass("any-file-ext-list");

      hintEl = setting.controlEl.createEl("div", { cls: "any-file-hint" });
      this.updateHint(hintEl, removed);

      text.inputEl.addEventListener("input", () => {
        const value = text.getValue();
        const parsed = this.parseExtensionList(value);
        const nowRemoved = OBSIDIAN_HANDLED_EXTENSIONS.filter(
          (ext) => !parsed.includes(ext)
        );
        if (hintEl) this.updateHint(hintEl, nowRemoved);
      });

      text.inputEl.addEventListener("blur", async () => {
        const value = text.getValue();
        const parsed = this.parseExtensionList(value);
        this.plugin.settings.obsidianDefaults = parsed;
        await this.plugin.saveSettings();
        await this.plugin.refreshMappings();
        this.display();
      });
    });
  }

  private updateHint(hintEl: HTMLElement, removed: string[]): void {
    if (removed.length > 0) {
      hintEl.addClass("any-file-hint-warning");
      hintEl.setText(
        `└ you're NOT using obsidian's native behaviour for ${removed.map((e) => `.${e}`).join(", ")}`
      );
    } else {
      hintEl.removeClass("any-file-hint-warning");
      hintEl.setText("");
    }
  }

  private parseExtensionList(value: string): string[] {
    return value
      .split(/[,\s]+/)
      .map((s) => s.toLowerCase().replace(/^\./, "").trim())
      .filter((s) => s.length > 0 && /^[a-z0-9]+$/.test(s));
  }

  private parseAndValidate(
    value: string,
    currentViewType: string
  ): { extensions: string[]; errors: string[] } {
    const extensions: string[] = [];
    const errors: string[] = [];

    const rawTokens = value
      .split(/[,\s]+/)
      .map((s) => s.toLowerCase().replace(/^\./, "").trim())
      .filter((s) => s.length > 0);
    const seen = new Set<string>();

    for (const ext of rawTokens) {
      if (!/^[a-z0-9]+$/.test(ext)) {
        errors.push(`.${ext} contains invalid characters (only a-z, 0-9 allowed)`);
        continue;
      }

      if (seen.has(ext)) {
        errors.push(`duplicate: .${ext}`);
        continue;
      }
      seen.add(ext);

      if (this.isObsidianDefault(ext)) {
        errors.push(`.${ext} is in obsidian defaults`);
        continue;
      }

      const conflict = this.findConflict(ext, currentViewType);
      if (conflict) {
        errors.push(`.${ext} in ${conflict}`);
        continue;
      }

      extensions.push(ext);
    }

    return { extensions, errors };
  }

  private isObsidianDefault(ext: string): boolean {
    return this.plugin.settings.obsidianDefaults.includes(ext.toLowerCase());
  }

  private findConflict(ext: string, currentViewType: string): string | null {
    const existingViewType = this.plugin.settings.mappings[ext];
    if (existingViewType && existingViewType !== currentViewType) {
      return existingViewType;
    }
    return null;
  }

  private async applyExtensions(viewType: string, newExtensions: string[]): Promise<void> {
    const oldExtensions = Object.entries(this.plugin.settings.mappings)
      .filter(([_, vt]) => vt === viewType)
      .map(([ext, _]) => ext);

    for (const ext of oldExtensions) {
      delete this.plugin.settings.mappings[ext];
    }

    for (const ext of newExtensions) {
      this.plugin.settings.mappings[ext] = viewType;
    }

    await this.plugin.saveSettings();
    await this.plugin.refreshMappings();
  }
}
