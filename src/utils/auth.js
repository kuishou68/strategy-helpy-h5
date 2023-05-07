// import Cookies from 'js-cookie';

const TokenKey = 'AUTHORIZATION';

export function getToken() {
  return localStorage.getItem(TokenKey); // Cookies.get(TokenKey);
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token); // Cookies.set(TokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey); // Cookies.remove(TokenKey);
}
