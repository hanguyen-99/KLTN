import axios from "axios";
import Cookies from "js-cookie";
import ApplicationError from "../errors/AplicationError";

const AUTHORIZATION_HEADER = "Authorization";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export function create({ baseUrl }) {
  const instance = axios.create({ baseURL: baseUrl });

  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get(ACCESS_TOKEN_COOKIE);
      if (token) {
        config.headers[AUTHORIZATION_HEADER] = "Bearer " + token; // for Spring Boot back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    async (err) => {
      if (err.message === "Network Error") {
        err.code = ApplicationError.name;
        err.message = "Network error!!!";
      }
      const originalConfig = err.config;
      if (originalConfig.url !== "/user/sign-in" && err.response) {
        // Access Token was expired
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const refeshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
            if (refeshToken) {
              const res = await instance.post("/user/token/refresh", {
                authorization: `Bearer ${refeshToken}`,
              });
              const newToken = await res.data.data.access_token;
              await Cookies.set(ACCESS_TOKEN_COOKIE, newToken);
              instance.defaults.headers[AUTHORIZATION_HEADER] =
                await `Bearer ${newToken}`;
              return await instance(originalConfig);
            }
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    }
  );

  /**
   * On browser, restConnector (axios) doesn't need to care about access_token anymore as we hacked around to let server set
   * access_token to browser on successful login.
   * @param token
   */
  instance.setAccessToken = function (token) {
    if (token) {
      Cookies.set(ACCESS_TOKEN_COOKIE, token);
      instance.defaults.headers[AUTHORIZATION_HEADER] = `Bearer ${token}`;
    } else {
      instance.removeAccessToken(token);
    }
  };

  instance.removeAccessToken = function () {
    delete instance.defaults.headers.AccessToken;
    Cookies.remove(ACCESS_TOKEN_COOKIE);
  };

  return instance;
}
