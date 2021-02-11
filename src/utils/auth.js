
/* /lib/auth.js */

import Cookies from 'js-cookie';

export const setToken = token => {
  if (!process.browser) {
    return;
  }
  Cookies.set('username', token.user.username);
  Cookies.set('jwt', token.jwt, { expires: 0.8 });


  if (Cookies.get('username')) {
    // Router.push("/");
  }
};

export const unsetToken = async () => {
  if (!process.browser) {
    return;
  }
  await Cookies.remove('jwt');
  await Cookies.remove('username');

  // to support logging out from all windows
  await window.localStorage.setItem('logout', Date.now());
  //   Router.push("/");
};
