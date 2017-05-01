import constants from '../../core/constants';
import swagger from '../../swagger';

export default {
  update: (context, url) => {
    debugger;
    return fetch(url, {
      headers: { "Authorization": "Bearer: (アクセストークン)" }
    })
      .then((response) => {
        // 401
        if (response.status === 401) {

        }
      })
  },

}
