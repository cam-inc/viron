---
title: Your First Endpoint
---

As the first step of our guide, we walk you through how to set up a simple RESTfull API server for Viron to be connected.

:::note
We assume you've already installed [Node.js](https://nodejs.org/) on your computer. If not, follow the official guidance before you keep reading on.
:::

## Setup an API Server

Let's start by creating a simple RESTfull API server using [express](https://expressjs.com/) npm module. Express is a web framework for Node.js.

:::note
As long as the API server is RESTfull, it's up to you how to set up a server. The reason why we chose express is that it's famous enough to be used as an example.
:::


```sh
mkdir guide
cd guide
npm init -y
npm install express --save
```

Attach a file named `app.js` under the `guide` directory.

```js
// app.js
const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('Hello Viron!');
});

app.listen(port, () => {
  console.log(`My first API server for Viron is up listening at http:localhost:${port}.`);
});
```

Now you are ready to launch your first RESTfull API server for Viron by executing the command below.

```sh
node app.js
```

Open up your favorite browser and navigate to `http:localhost:4000`.
If you see a paragraph `Hello Viron!` on the browser's screen, you are good and proceed to the next section!

## Serve an OAS Document

The next step is to serve an OAS document.
Edit the `app.js` you've just created by adding the lines below.

```js
app.get('/oas.json', (req, res) => {
  res.json({
    openapi: '3.0.2',
    info: {
      title: 'My API Server',
      description: 'My first RESTfull API server for Viron.'
    },
    paths: {}
  });
});
```

Visit `https://localhost:4000/oas.json` to see it works well.

:::caution
All OAS documents being provided to Viron should be of **https** protocol.
:::

## Provide Viron with the OAS Documevnt

To provide Viron with the OAS document,

### 1. Open up Viron on Browser

Visit Viron at [https://viron.app/](`https://viron.app`). You'll see Viron's top page but just click the link [home](https://viron.app/home/) to be navigated to the page where you will connect the OAS document to Viron.

### 2. Add Your Endpoint

This page is a hub where you can navigate to a specific endpoint page and add a new endpoint.
To add a new endpoint, you will need to input two fields which are `Endpoint ID` and `Endpoint URL`. Look for the input fields and type `My First Server` and `https://localhost:4000/oas.json` respectively.
After clicking the submit button you will see your endpoint having been added.
