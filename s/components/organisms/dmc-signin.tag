dmc-signin
  h1 { opts.key }

  pre { JSON.stringify(opts.endpoint, null, '    ') }

  hr

  div.__email(each="{ authtype in emails }")
    h2 { authtype.provider }
    input.__field(type="text" value="" placeholder="e-mail")
    input.__field(type="password" value="")
    input.__button(type="button" value="Sing In" onclick="{ evSignIn }")
    hr

  div.__oauth(each="{ authtype in oauths }")
    input.__button(type="button" value="Google Auth" onclick="{ evSignIn }")
    hr

  style.
    .__field {
      border: 1px solid gray;
      margin-bottom: 12px;
    }

    .__button {
      border: 1px solid gray;
      margin-bottom: 12px;
    }

  script.
    import { filter, values } from 'mout/object';
    import constants from '../../core/constants';
    const store = this.riotx.get();

    this.oauths = values(filter(this.opts.authtype, v => {
      return v.type === 'oauth';
    }));

    this.emails = values(filter(this.opts.authtype, v => {
      return v.type === 'email';
    }));

    this.evSignIn = (ev) => {
      console.log(ev.item.authtype);
      alert('TODO Sign In.');
    }


