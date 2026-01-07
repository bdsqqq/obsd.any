export const DEFAULT_MAPPINGS: Record<string, string> = {
  // plain text
  txt: "markdown",
  text: "markdown",
  log: "markdown",

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
  js: "markdown",
  mjs: "markdown",
  cjs: "markdown",
  ts: "markdown",
  tsx: "markdown",
  jsx: "markdown",

  // code - web
  html: "markdown",
  htm: "markdown",
  css: "markdown",
  scss: "markdown",
  sass: "markdown",
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
  json: "markdown",
  jsonc: "markdown",
  json5: "markdown",
  yaml: "markdown",
  yml: "markdown",
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

export const PROTECTED_EXTENSIONS = [
  "md",
  "canvas",
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "bmp",
  "avif",
  "mp3",
  "wav",
  "m4a",
  "ogg",
  "flac",
  "webm",
  "3gp",
  "mp4",
  "mkv",
  "mov",
  "ogv",
];
