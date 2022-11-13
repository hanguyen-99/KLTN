export default class AccountService{

  constructor(options) {
    this.accountGateway = options.accountGateway;
  }

  async wellcomeLoginUser() {
    return this.accountGateway.wellcomeLoginUser();
  }

  async loginAdmin({email,password}) {
    const token = await this.accountGateway.loginAdmin({email,password});
    await this.accountGateway.setAccessToken(token.data);
    return token.data
  }

  async signUpUser(values) {
    return this.accountGateway.signUpUser(values);
  }
  
  async getUserAfterLogin(){
    return this.accountGateway.getUserAfterLogin()
  }

  async changePassword(values) {
    return this.accountGateway.changePassword(values);
  }

  async getListUser() {
    return this.accountGateway.getListUser();
  }

  async changeAvatar(file) {
    return this.accountGateway.changeAvatar(file);
  }

  async changeProfile(id,values) {
    return this.accountGateway.changeProfile(id,values);
  }

  async forgotPassword(email){
    return this.accountGateway.forgotPassword(email)
  }

  async resetPassword(email,uuid,password){
    return this.accountGateway.resetPassword(email,uuid,password)
  }

  async lockAccount(id){
    return this.accountGateway.lockAccount(id)
  }

  async unLockAccount(id){
    return this.accountGateway.unLockAccount(id)
  }

  async logout(){
    return this.accountGateway.logout()
  }

  async getDashboard(){
    return this.accountGateway.getDashboard();
  }

  async activeAccount(id,uuid){
    return this.accountGateway.activeAccount(id,uuid);
  }

}