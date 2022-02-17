# Contributing to Viron

---

We would like to encourage everyone to help and support this project by contributing.

We manage tasks using the [GitHub Project](https://github.com/orgs/cam-inc/projects/2) where you can see which issue is in progress, is done, or has high priority.

## How Can I Contribute?

### Reporting Bugs

Please submit a [GitHub issue](https://github.com/cam-inc/viron/issues/new?assignees=&labels=bug&template=bug_report.md&title=) to report a bug. Before submitting one, try to make sure any issue similar to your's doesn't already exist.

### Suggesting Enhancements

Please submit a [GitHub issue](https://github.com/cam-inc/viron/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=) to suggest a enhancement.

### Code Contribution

We apply the monorepo architecture; see each workspace's `README.md` for details.

Use the npm command's option `--workspace` with a workspace name to execute workspace-specific npm scripts, like:

```
$ npm run develop --workspace=@viron/app
$ npm run build --workspace=@viron/app --workspace=@viron/lib
```

Use the `--workspaces` option to execute a npm script on each workspace.

```
$ npm run test --workspaces
```

Below is a quick guide to code contribution.

1. Fork and clone the repo to your local machine.
2. Create a new branch from `develop` with a meaningful name for the task you work on.
3. Setup by running: `npm install . --legacy-peer-deps`. (**Important**: npm version >= 7.9.0)
4. Do your work following the `styleguide` of each package; read the readme.md files in each package directory.
5. Add changelog intentions by running `npm run changelog:intent`.
6. Push your branch.
7. Submit a pull request to the upstream repository.

## Code of Conduct

Follow [this](./CODE_OF_CONDUCT.md).

## License

By contributing to this project, you agree to license your contribution under the [MIT license](./LICENSE).

## Contributors

Thank you all who have contributed to this project.

## Contributors

| [<img src="https://avatars1.githubusercontent.com/u/381941?s=130&v=4" width="130px;" style="background-color:white;"/><br />fkei](https://github.com/fkei) <br /> 🤔 💻  | [<img src="https://avatars0.githubusercontent.com/u/10769038?s=130&v=4" width="130px;"/><br />cathcheeno](https://github.com/cathcheeno)<br /> 🤔 💻 🌍 📖 📝 | [<img src="https://avatars2.githubusercontent.com/u/2404059?s=130&v=4" width="130px;"/><br />noritama](https://github.com/noritama)<br /> 🤔 💻  | [<img src="https://avatars1.githubusercontent.com/u/35751869?s=130&v=4" width="130px;"/><br />babarl](https://github.com/babarl)<br /> 🎨 | [<img src="https://avatars2.githubusercontent.com/u/3895795?s= 130&v=4" width="130px;"/><br />MuuKojima](https://github.com/MuuKojima)<br /> 💻  | [<img src="https://avatars2.githubusercontent.com/u/12236042?s=130&v=4" width="130px;"/><br />tosaka07](https://github.com/tosaka07)<br /> 💻  | [<img src="https://avatars0.githubusercontent.com/u/11499282?s=130&v=4" width="130px;"/><br />Jung0](https://github.com/Jung0)<br /> 💻  |
| :---: | :---: | :---: | :---: | :---: | :---: | :---:
[<img src="https://avatars1.githubusercontent.com/u/26865061?s=130&v=4" width="130px;"/><br />Takahisa<br />Kodama](https://github.com/TakahisaKodama)<br /> 💻 | [<img src="https://avatars.githubusercontent.com/u/444996?v=4" width="130px;"/><br />syama666](https://github.com/syama666)<br /> 💻 | [<img src="https://avatars.githubusercontent.com/u/24517668?v=4" width="130px;"/><br />takoring](https://github.com/takoring)<br /> 💻 | [<img src="https://avatars.githubusercontent.com/u/40456919?v=4" width="130px;"/><br />nezuu](https://github.com/nezuu)<br /> 💻 | [<img src="https://avatars.githubusercontent.com/u/12871716?v=4" width="130px;"/><br />ishikawa-pro](https://github.com/ishikawa-pro)<br /> 💻 | [<img src="https://avatars.githubusercontent.com/u/4863233?v=4" width="130px;"/><br />niwattitti](https://github.com/niwattitti)<br /> 🚇 | [<img src="https://avatars.githubusercontent.com/u/2027132?v=4"/><br />niwattitti](https://github.com/ejithon)<br /> 🤔
