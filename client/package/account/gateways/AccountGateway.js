import Cookies from "js-cookie";

const AUTHORIZATION_HEADER = "Authorization";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export default class AccountGateway {
  constructor(options) {
    this.restConnector = options.restConnector;
    this.jwt = null;
  }

  async wellcomeLoginUser() {
    try {
      const resp = await this.restConnector.get("/user/welcome");
      return resp.data;
    } catch (e) {
      return null;
    }
  }

  async loginAdmin({ email, password }) {
    const resp = await this.restConnector.post("/user/sign-in", {
      email,
      password,
    });
    return resp.data;
  }

  async setAccessToken(token) {
    const { access_token, refresh_token } = token;
    this.restConnector.setAccessToken(access_token);
    Cookies.set(REFRESH_TOKEN_COOKIE, refresh_token);
  }

  async getUserAfterLogin() {
    const resp = await this.restConnector.get("/user/info");
    return resp.data;
  }

  async signUpUser(values) {
    const resp = await this.restConnector.post("/user/sign-up", values);
    return resp.data;
  }
  async changePassword(values) {
    const resp = await this.restConnector.patch(
      "/user/change-password",
      values
    );
    return resp.data;
  }
  async getListUser() {
    const resp = await this.restConnector.get("/user");
    return resp.data;
  }

  async changeAvatar(file) {
    const formData = new FormData();
    formData.append("file", file);
    const resp = await this.restConnector.post("/user/avatar", formData);
    return resp.data;
  }

  async changeProfile(id,values){
    const resp = await this.restConnector.patch("/user/"+id, values);
    return resp.data;
  }

  async forgotPassword(email){
    const resp = await this.restConnector.post(`/user/forgot-password?email=${email}`)
    return resp
  }

  async resetPassword(email,uuid,password){
    const resp = await this.restConnector.patch(`/user/reset-password?email=${email}&uuid=${uuid}`,password)
    return resp
  }

  async lockAccount(id){
    const resp = await this.restConnector.patch(`/user/lock/`+id)
    return resp
  }

  async unLockAccount(id){
    const resp = await this.restConnector.patch(`/user/unlock/`+id)
    return resp
  }

  async logout() {
    await this.restConnector.get("/user/logout");
    Cookies.remove(ACCESS_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);
    this.restConnector.removeAccessToken();
  }

  async getDashboard(){
    const resp = await this.restConnector.get("/user/dashboard");
    return resp.data;
  }

  async activeAccount(id,uuid){
    const resp = await this.restConnector.get(`/user/active?id=${id}&uuid=${uuid}`)
    return resp
  }
}
