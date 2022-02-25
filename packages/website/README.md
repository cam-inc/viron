# Website

This is a workspace for the [documentation website](https://discovery.viron.plus/).

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Adding a Content

Create a mdx file written in English and place it under `docs` or `blog` directory. Then, translate them into Japanese following the steps described below.

## i18n

Using [Docusaurus i18n function](https://docusaurus.io/docs/i18n/introduction/), English and Japanese are supported. English is set to be the default language.

### For Markdown files

The goal is to place all markdown files at designated directories and rewrite them into Japanese.

```console
# For documentation files.
$ mkdir -p i18n/ja/docusaurus-plugin-content-docs/current
$ cp -r docs/** i18n/ja/docusaurus-plugin-content-docs/current

# For blog files.
$ mkdir -p i18n/ja/docusaurus-plugin-content-blog
$ cp -r blog/** i18n/ja/docusaurus-plugin-content-blog

# For page files.
$ mkdir -p i18n/ja/docusaurus-plugin-content-pages
$ cp -r src/pages/**.md i18n/ja/docusaurus-plugin-content-pages
$ cp -r src/pages/**.mdx i18n/ja/docusaurus-plugin-content-pages
```

Translate all copied files as you like.

### For JSX files

```console
$ npm run write-translations:ja --workspace=@viron/website
```

Execute this command to extract and initialize the JSON translation files for Japanese. Then translate them into Japanese. This task is mandatory every time you edit jsx files.


## Local Development

```console
$ npm run develop --workspace=@viron/website
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

```console
$ npm run develop:ja --workspace=@viron/website
```

This command does the same above but locale is set to Japanese.

## Testing Builds Locally

```console
$ npm run build --workspace=@viron/website
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

```console
$ npm run serve --workspace=@viron/website
```

This command serves generated static content in the `build` directory.
