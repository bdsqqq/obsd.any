export const DEFAULT_MAPPINGS: Record<string, string> = {
  // plain text
  text: "markdown",

  // markup
  rst: "markdown",
  adoc: "markdown",
  asciidoc: "markdown",
  org: "markdown",
  wiki: "markdown",
  fountain: "markdown",
  rmd: "markdown",
  qmd: "markdown",
  mdx: "markdown",

  // code - javascript ecosystem
  mjs: "markdown",
  cjs: "markdown",

  // code - web
  htm: "markdown",
  less: "markdown",

  // code - systems
  c: "markdown",
  cpp: "markdown",
  h: "markdown",
  hpp: "markdown",
  rs: "markdown",
  go: "markdown",

  // code - scripting
  py: "markdown",
  rb: "markdown",
  php: "markdown",
  lua: "markdown",
  pl: "markdown",
  sh: "markdown",
  bash: "markdown",
  zsh: "markdown",
  fish: "markdown",
  ps1: "markdown",

  // code - jvm
  java: "markdown",
  kt: "markdown",
  scala: "markdown",
  groovy: "markdown",

  // data/config
  jsonc: "markdown",
  json5: "markdown",
  toml: "markdown",
  xml: "markdown",
  ini: "markdown",
  cfg: "markdown",
  conf: "markdown",
  env: "markdown",

  // special files (no extension prefix)
  gitignore: "markdown",
  gitattributes: "markdown",
  dockerignore: "markdown",
  editorconfig: "markdown",

  // data
  csv: "markdown",
  tsv: "markdown",
  sql: "markdown",
  graphql: "markdown",
  prisma: "markdown",

  // additional audio (obsidian misses some)
  aiff: "audio",
  aif: "audio",
  wma: "audio",

  // additional video
  avi: "video",
  wmv: "video",
  m4v: "video",
  flv: "video",

  // additional image
  ico: "image",
  tiff: "image",
  tif: "image",
};

// extensions obsidian already handles - we defer to obsidian by default
export const OBSIDIAN_HANDLED_EXTENSIONS = [
  // core obsidian
  "md",
  "canvas",
  "pdf",
  // images
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "bmp",
  "avif",
  // audio
  "mp3",
  "wav",
  "m4a",
  "ogg",
  "flac",
  // video
  "webm",
  "3gp",
  "mp4",
  "mkv",
  "mov",
  "ogv",
  // obsidian also registers these (discovered via errors)
  "css",
  "html",
  "js",
  "json",
  "jsx",
  "log",
  "sass",
  "scss",
  "ts",
  "tsx",
  "txt",
  "yaml",
  "yml",
];
