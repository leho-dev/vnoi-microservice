import { _SERVICE } from "../env/index.js";

const _PROXY_CONFIG = [
  {
    path: _SERVICE.COMMON_SERVICE.PATH,
    target: "http://localhost:" + _SERVICE.COMMON_SERVICE.PORT
  },
  {
    path: _SERVICE.USER_SERVICE.PATH,
    target: "http://localhost:" + _SERVICE.USER_SERVICE.PORT
  }
];

export { _PROXY_CONFIG };
