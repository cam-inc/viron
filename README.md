<h1 align="center">Viron</h1>

<h2 align="center">OAS-driven Frontend-NoCode Administration Console</h2>

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![Read the Docs](https://img.shields.io/readthedocs/pip.svg)](https://discovery.viron.plus/docs/introduction/)
[![GitHub last commit](https://img.shields.io/github/last-commit/cam-inc/viron.svg)]()

## What is Viron

Viron is a **web-based** administration tool, which

- is based on and leverages **[OpenAPI Specification](https://oai.github.io/Documentation/)**,
- offers **Frontend-Node** console with **fine-tuned GUI**,
- and is an **Open-Source Software**.

Viron enables you to eliminate all the Frontend-matter tasks when administrating your API servers.

## The Idea

OpenAPI Specification, a.k.a. `OAS`, is a `YAML` or `JSON` file that defines an interface to a set of **RESTful** APIs. By interpreting an OAS document, the readers understand things such as:

- The overall idea for the APIs.
- How to call a particular API.
- How to construct request payloads.
- What type of schema do the APIs return.
- The ways to authenticate.
- And much more.

Viron evaluates and leverages OAS documents, interprets those above, and then constructs a **GUI** for you.

## Viron is For Those Who:

- have a `RESTful` administration API server.
- do not have time to make an administration website `from scratch`.
- have good knowledge of OpenAPI Specification.

## Viron is NOT For Those Who:

- require a complex administration website that an OAS document `can not define`.
- have a GraphQL administration API server.

## Contributors

| [<img src="https://avatars1.githubusercontent.com/u/381941?s=130&v=4" width="130px;"/><br />fkei](https://github.com/fkei) <br /> 🤔 💻  | [<img src="https://avatars0.githubusercontent.com/u/10769038?s=130&v=4" width="130px;"/><br />cathcheeno](https://github.com/cathcheeno)<br /> 💻  | [<img src="https://avatars2.githubusercontent.com/u/2404059?s=130&v=4" width="130px;"/><br />noritama](https://github.com/noritama)<br /> 💻  | [<img src="https://avatars1.githubusercontent.com/u/35751869?s=130&v=4" width="130px;"/><br />babarl](https://github.com/babarl)<br /> 🎨 | [<img src="https://avatars2.githubusercontent.com/u/3895795?s= 130&v=4" width="130px;"/><br />MuuKojima](https://github.com/MuuKojima)<br /> 💻  | [<img src="https://avatars2.githubusercontent.com/u/12236042?s=130&v=4" width="130px;"/><br />tosaka07](https://github.com/tosaka07)<br /> 💻  | [<img src="https://avatars0.githubusercontent.com/u/11499282?s=130&v=4" width="130px;"/><br />Jung0](https://github.com/Jung0)<br /> 💻  |
| :---: | :---: | :---: | :---: | :---: | :---: | :---:
[<img src="https://avatars1.githubusercontent.com/u/26865061?s=130&v=4" width="130px;"/><br />Takahisa<br />Kodama](https://github.com/TakahisaKodama)<br /> 💻  |

## License

[MIT LICENSE](./LICENSE)

## Changelog

[Changelog](https://discovery.viron.plus/docs/References/changelog/)

---

## Development

### Setup

```
$ git clone git@github.com:cam-inc/viron.git
$ cd viron
$ npm install . --legacy-peer-deps
```
**Important**: npm version >= 7.9.0

### Monorepo

See each workspace's README.md for details.

Use the npm command's option `--workspace` with a workspace name to execute workspace-specific npm scripts, like:

```
$ npm run develop --workspace=@viron/app
$ npm run build --workspace=@viron/app --workspace=@viron/lib
```

Use the `--workspaces` option to execute a npm script on each workspace.

```
$ npm run test --workspaces
```
