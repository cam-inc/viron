# Viron 2

## Development

### Basic Commands

```sh
# To start development.
$ npm run develop

# To check production build.
$ npm run build
$ npm run serve

# To type check.
$ npm run typecheck
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
