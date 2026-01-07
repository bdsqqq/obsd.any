import { App, PluginSettingTab, Setting } from "obsidian";
import AnyFilePlugin from "./main";
import { DEFAULT_MAPPINGS, PROTECTED_EXTENSIONS } from "./defaults";

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

    // mappings table
    const tableContainer = containerEl.createDiv({
      cls: "any-file-table-container",
    });

    const table = tableContainer.createEl("table", { cls: "any-file-table" });
    const thead = table.createEl("thead");
    const headerRow = thead.createEl("tr");
    headerRow.createEl("th", { text: "extension" });
    headerRow.createEl("th", { text: "view type" });
    headerRow.createEl("th", { text: "" });

    const tbody = table.createEl("tbody");

    const mappings = this.plugin.settings.mappings;
    const sortedExtensions = Object.keys(mappings).sort();

    for (const ext of sortedExtensions) {
      this.renderMappingRow(tbody, ext, mappings[ext], fileViewTypes);
    }

    // add new mapping button
    new Setting(containerEl)
      .setName("add mapping")
      .setDesc("map a new extension to a view type")
      .addButton((btn) =>
        btn.setButtonText("+ add").onClick(() => {
          this.addNewMapping(tbody, fileViewTypes);
        })
      );

    // reset to defaults
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
              await this.plugin.saveSettings();
              await this.plugin.refreshMappings();
              this.display();
            }
          })
      );

    // protect defaults toggle
    new Setting(containerEl)
      .setName("protect default extensions")
      .setDesc(
        "warn before overriding obsidian's built-in extensions (.md, .canvas, .pdf, etc.)"
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.protectDefaults)
          .onChange(async (value) => {
            this.plugin.settings.protectDefaults = value;
            await this.plugin.saveSettings();
          })
      );

    // show registration errors if any
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

  private renderMappingRow(
    tbody: HTMLElement,
    ext: string,
    viewType: string,
    fileViewTypes: string[]
  ): void {
    const row = tbody.createEl("tr");

    // extension cell
    const extCell = row.createEl("td");
    const extInput = extCell.createEl("input", {
      type: "text",
      value: ext,
      cls: "any-file-ext-input",
    });
    extInput.addEventListener("change", async () => {
      const newExt = extInput.value.toLowerCase().replace(/^\./, "").trim();
      if (newExt && newExt !== ext) {
        if (this.shouldProtect(newExt)) {
          const confirmed = confirm(
            `.${newExt} is a protected obsidian extension. override anyway?`
          );
          if (!confirmed) {
            extInput.value = ext;
            return;
          }
        }
        delete this.plugin.settings.mappings[ext];
        this.plugin.settings.mappings[newExt] = viewType;
        await this.plugin.saveSettings();
        await this.plugin.refreshMappings();
        this.display();
      }
    });

    // view type cell
    const viewCell = row.createEl("td");
    const select = viewCell.createEl("select", { cls: "any-file-view-select" });
    for (const vt of fileViewTypes) {
      const option = select.createEl("option", { value: vt, text: vt });
      if (vt === viewType) option.selected = true;
    }
    // if current viewType not in list (maybe from old config), add it
    if (!fileViewTypes.includes(viewType)) {
      const option = select.createEl("option", { value: viewType, text: viewType });
      option.selected = true;
    }
    select.addEventListener("change", async () => {
      this.plugin.settings.mappings[ext] = select.value;
      await this.plugin.saveSettings();
      await this.plugin.refreshMappings();
    });

    // delete cell
    const delCell = row.createEl("td");
    const delBtn = delCell.createEl("button", {
      text: "×",
      cls: "any-file-delete-btn",
    });
    delBtn.addEventListener("click", async () => {
      delete this.plugin.settings.mappings[ext];
      await this.plugin.saveSettings();
      await this.plugin.refreshMappings();
      row.remove();
    });
  }

  private addNewMapping(tbody: HTMLElement, fileViewTypes: string[]): void {
    const ext = "newext";
    const viewType = "markdown";

    if (this.plugin.settings.mappings[ext]) {
      // find unique name
      let counter = 1;
      while (this.plugin.settings.mappings[`${ext}${counter}`]) {
        counter++;
      }
      this.plugin.settings.mappings[`${ext}${counter}`] = viewType;
      this.plugin.saveSettings().then(() => this.display());
      return;
    }

    this.plugin.settings.mappings[ext] = viewType;
    this.plugin.saveSettings().then(() => this.display());
  }

  private shouldProtect(ext: string): boolean {
    return (
      this.plugin.settings.protectDefaults &&
      PROTECTED_EXTENSIONS.includes(ext.toLowerCase())
    );
  }
}
