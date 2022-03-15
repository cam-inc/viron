# Viron

[![app](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/s6jfta&style=for-the-badge&logo=cypress)](https://dashboard.cypress.io/projects/s6jfta/runs)

## Development

1. Follow the section [here](../../CONTRIBUTING.md#code-contribution) to setup.
2. Build packages on list below by executing `npm run build --workspace=[package name]`.
  - @viron/linter
  - @viron/lib
3. Run the sample API server in the Quick Start section [here](../../example/nodejs/README.md#quick-start).
4. Run `npm run develop --workspace=@viron/app` in order to access [https://localhost:8000/](https://localhost:8000/).

### Basic Commands

```sh
# To start development.
$ npm run develop --workspace=@viron/app

# To check production build.
$ npm run build --workspace=@viron/app
$ npm run serve --workspace=@viron/app

# To test.
$ npm run test --workspace=@viron/app
```

### Basic UI Structure
As we use Gatsby of version 2, we need to do some tricks to architect a UI tree. Below is the basic structure.

```html
<RootWrapper>
  <Root>
    <PageWrapper>
      <PageElement>
        <Layout>
          {/* page content here */}
        </Layout>
      </PageElement>
    </PageWrapper>
    <ModalWrapper>
      {/* modal contents here */}
    </ModalWrapper>
    <Splash />
  </Root>
<RootWrapper>
```

- RootWrapper: This stays at the outermost layer of the application wrapping Root element which is gatsby's default root element.
- Root: This is Gatsby's default root element.
- PageWrapper: This stays at the outside of the page page elements. It will get rendered as navigations happen.
- Page Element(s): This is equivalent to each element in the `pages` directory. This will be mounted and unmounted as navigations happen.
- Layout(s): This is equivalent to each element in the `layouts` directory. This stays inside a page element, so this will be mounted and unmouted as well like page elements.
- ModalWrapper: A parent component of every modal component.
- Splash: This is a component that is similar to native app's splash UI.

### Environment Variables

We conform with the [Gatsby's direction](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

### TypeScript

Gatsby supports TypeScript out of the box but does NOT run type checking during build; refer to the [plugin's explanation](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-typescript) for detail. We adopt the hybrid approach described [here](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html#babel-for-transpiling-tsc-for-types) to manually execute type checking.


### State Management

We use the [Recoil](https://recoiljs.org/) as a state management library. Belows are some of reasons we chose the Recoil.
- It's a product from [Facebook Open Source](https://opensource.facebook.com/). It should work well with React.
- It has a lot of useful functions like time-travel debugging, routing, undo and etc.
- It has new generation ideas.

### Page Specific Components Naming Rule

Gatsby regards files under the `src/pages` directory as pages. But occasionally you would want to put files that are promised to be used by a single file under the directory so that they won't be treated as pages. We call those files `Page Specific Components`.
To accomplish this we created a rule that any files and directories under the `src/pages` directory with prefix of `_` are regarded as a page specific component. Read the [ignore specific files](https://www.gatsbyjs.com/plugins/gatsby-plugin-page-creator/?=#ignoring-specific-files) section of the Gatsby's default plugin `gatsby-plugin-page-creator` and `ignore` option in the `gatsby-config` file for more information.

### Internationalization

For internationalization, [i18next](https://www.i18next.com/) is used as a provider of core functions. Also, [react-i18next](https://react.i18next.com/) integrates with the react framework.
We decided to not use [i18next-http-backend](https://github.com/i18next/i18next-http-backend) because switching languages on client-side(i.e. on Browsers) is not good for SEO. Read [this](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites?hl=en&ref_topic=2370587&visit_id=637521501660173954-3611086595&rd=1) and [this](https://itnext.io/techniques-approaches-for-multi-language-gatsby-apps-8ba13ff433c5) for further information.
Ideally it's better to serve a html file per language (i.e. use different URLs for different language versions) like [gatsby-plugin-i18n](https://github.com/angeloocana/gatsby-plugin-i18n) does. Just for now, we stick to the multilingual-page system.

### Theme and prefers-color-scheme
Viron offers a function for users to switch color themes so they can easily recognize which environment they are editing (e.g. local, staging, production, etc.). On the other hand, there is a color-related idea in the client-side world: `Light Mode` and `Dark Mode`. This makes it a bit tricky to handle color themes when dealing with them considering Light/Dark modes. Here is our strategy for it.

- One theme consists of two sets of color palettes. One for light mode and the other for dark mode. For example, a theme named `terminal` will have a color palette for light mode (terminal-light) and a color palette for dark mode (erminal-dark).
- We use the [tailwind's function](https://tailwindcss.com/docs/dark-mode) to switch between light and dark mode.
- We define [the tailwind colors configuration using CSS custom properties](https://tailwindcss.com/docs/customizing-colors#naming-your-colors), and overwrite them leveraging CSS specificity. See the global.css file for more detail.
- All colors are generated using the custom property hue color. (i.e. --color-hue)

### Color System
We follow [Google Material Design's principles](https://material.io/design/color/dark-theme.html) to manage our color system and to use them.

### Error Handling
To handle errors that would be fired inside react components, we use [Error Boundaries](https://reactjs.org/docs/error-boundaries.html). Inside the ErrorBoundary react component which follows [this strategy](https://dev.to/dinhhuyams/react-error-boundary-surviving-through-pandemic-2pl9), all errors are propagated to the [logger](./src/utils/logger/index.ts). Then logger will output information on the browser's console, and send data to external services if necessary. For errors that would be caught outside of react components, just call the logger. The logger is the final destination of all errors.

All errors are defined [here](./src/errors/index.ts).

### Animation
Try sticking to implementing only fade-in animations. In many cases fade-in animations are meaningful in the point of UX but fade-out animations are not very important. Fade-out animations tend to make users wait and make source code tricky to read.

### Test

#### E2E and Integration Tests
Cypress is used under the hood of all E2E and integration tests.

Run `npm run develop --workspace=@viron/app` and then,
- `START_SERVER_AND_TEST_INSECURE=1 CYPRESS_BASE_URL=https://localhost:8000 npm run test:e2e --workspace=@viron/app` to run end-to-end testing.
- `START_SERVER_AND_TEST_INSECURE=1 CYPRESS_BASE_URL=https://localhost:8000 npm run test:e2e:open --workspace=@viron/app` to test in the interactive GUI.
- `START_SERVER_AND_TEST_INSECURE=1 CYPRESS_BASE_URL=https://localhost:8000 CYPRESS_PROJECT_ID=<project id> CYPRESS_RECORD_KEY=<record key> npm run test:e2e:record --workspace=@viron/app` to record test result and submit it to Cypress Dashboard.

#### Unit Testig
`npm run test:unit --workspace=@viron/app` to run unit testing. Jest is used under the hood.
We are hoping to switch to [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction#What-is-Component-Testing) in the future once it gets in production.

#### Static Type Check Test
`npm run test:static --workspace=@viron/app` to type check.

### Continuous Integration
E2E and integration testings are executed and the result will be sent to Cypress Dashboard, which is open to public. (only the `app-production` project.)
`CYPRESS_PROJECT_ID=<production project id> CYPRESS_RECORD_KEY=<production record key> npm run ci:production:record --workspace=@vion/app` to run for production environment.
`CYPRESS_PROJECT_ID=<development project id> CYPRESS_RECORD_KEY=<development record key> npm run ci:development:record --workspace=@vion/app` to run for development environment.
`npm run ci:local --workspace=@viron/app` to execute CI tasks locally for tesing purpose.

### Main Prerequisite Knowledge and Technologies
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Gatsby](https://www.gatsbyjs.com/)
- [tailwindcss](https://tailwindcss.com/)
- [Recoil](https://recoiljs.org/)
- [React Hook Form](https://react-hook-form.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [i18next](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [Storybook](https://storybook.js.org/)
- [Cypress](https://www.cypress.io/)
- [Gatsby Unit Testing](https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/)
- [Gatsby Testing React Components ](https://www.gatsbyjs.com/docs/how-to/testing/testing-react-components/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Learn the smart, efficient way to test any JavaScript application](https://testingjavascript.com/)
