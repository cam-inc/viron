// import _ from 'underscore'
import riot from 'riot'
// import route from 'riot-route'
import swagger from './swagger'

// css
import './styles/index.pcss'
// atoms
import './components/atoms/dmc-text.tag'
// organisms
// import './components/organisms/dmc-header.tag'
// pages
// import './components/pages/dmc-overview.tag'
// root
import './components/dmc.tag'

console.log("index.js");

swagger.setup(null, (err, swagger) => {
  if (err) {
    console.log('Setup swagger error.', err);
    return;
  }
  console.log("[SWAGGER] Name", swagger.getName());
  console.log("[SWAGGER] Pages", swagger.getPage());
  riot.mount('dmc') // root mount!!!
})


