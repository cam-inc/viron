# Viron 2

## Development

### Basic UI Structure
As we use Gatsby of version 2, we need to do some tricks to architect a UI tree. Below is the basic structure.

```html
<RootWrapper>
  <Root>
    <PageElement>
      <Layout>
        {/* page content here */}
      </Layout>
    </PageElement>
  </Root>
<RootWrapper>
```

RootWrapper: This stays at the most outside of the application wrapping Root element which is gatsby's default root element.
Root: This is Gatsby's default root element.
Page Element(s): This is equivalent to each element in the `pages` directory. This will be mounted and unmounted as navigations happen.
Layout(s): This is equivalent to each element in the `layouts` directory. This stays inside a page element, so this will be mounted and unmouted as well like page elements.

### State Management

We use the [Recoil](https://recoiljs.org/) as a state management library. Belows are some of reasons we chose the Recoil.
- It's a product from [Facebook Open Source](https://opensource.facebook.com/). It should work well with React.
- It has a lot of useful funtionalities like time-travel debugging, routing, undo and etc.
- It has new generation idea.
