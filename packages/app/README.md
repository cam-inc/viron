# Viron 2

## Development

Run the example API server refering to the Quick Start section of [this](../../example/nodejs/README.md).
Then run `npm run develop --workspace=@viron/app` and access to [https://localhost:8000/](https://localhost:8000/).

### Basic Commands

```sh
# To start development.
$ npm run develop --workspace=@viron/app

# To check production build.
$ npm run build --workspace=@viron/app
$ npm run serve --workspace=@viron/app

# To type check.
$ npm run typecheck --workspace=@viron/app
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

- RootWrapper: This stays at the most outside of the application wrapping Root element which is gatsby's default root element.
- Root: This is Gatsby's default root element.
- PageWrapper: This stays at the outside of the page page elements. It get rendered as navigations happen.
- Page Element(s): This is equivalent to each element in the `pages` directory. This will be mounted and unmounted as navigations happen.
- Layout(s): This is equivalent to each element in the `layouts` directory. This stays inside a page element, so this will be mounted and unmouted as well like page elements.
- ModalWrapper: A parent component of every modal component.
- Splash: This is a component that is similar to native app's splash UI.

### State Management

We use the [Recoil](https://recoiljs.org/) as a state management library. Belows are some of reasons we chose the Recoil.
- It's a product from [Facebook Open Source](https://opensource.facebook.com/). It should work well with React.
- It has a lot of useful funtionalities like time-travel debugging, routing, undo and etc.
- It has new generation idea.

### Page Specific Components Naming Rule

Gatsby regards files under the `src/pages` directory as pages. But occasionally you would want to put files that are promised to be used by a single file under the directory and won't let them to be treated as pages. We call those files `Page Specific Components`.
To accomplish this we created a rule that any files and directories under the `src/pages` directory with prefix of `_` are regarded as a page specific component. Read the [ignore specific files](https://www.gatsbyjs.com/plugins/gatsby-plugin-page-creator/?=#ignoring-specific-files) section of the Gatsby's default plugin `gatsby-plugin-page-creator` and `ignore` option in the `gatsby-config` file for more information.

### Internationalization

For internationalization, [i18next](https://www.i18next.com/) is used as a provider of core functionalities. And [react-i18next](https://react.i18next.com/) to integrate with the react framework.
We decided to not use [i18next-http-backend](https://github.com/i18next/i18next-http-backend) because switching languages on client-side(i.e. on Browsers) is not good for SEO. Read [this](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites?hl=en&ref_topic=2370587&visit_id=637521501660173954-3611086595&rd=1) and [this](https://itnext.io/techniques-approaches-for-multi-language-gatsby-apps-8ba13ff433c5)for your further information.
Ideally it's better to serve a html file per language (i.e. use different URLs for different language versions) like [gatsby-plugin-i18n](https://github.com/angeloocana/gatsby-plugin-i18n) does. We, just for now, stick to the multilingual-page system.

### Prerequisite Knowledge and Technologies
- [React](https://reactjs.org/)
- [Gatsby](https://www.gatsbyjs.com/)
- [tailwindcss](https://tailwindcss.com/)
- [Recoil](https://recoiljs.org/)
- [React Hook Form](https://react-hook-form.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [i18next](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
