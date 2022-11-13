export default class DocumentGateway {
  constructor(options) {
    this.restConnector = options.restConnector;
  }

  async uploadDocument(file) {
    const resp = await this.restConnector.post("/document/upload", file);
    return resp.data;
  }
  
  async deleteDocument(id) {
    const resp = await this.restConnector.delete("/document/"+id);
    return resp.data;
  }

  async updateDocument(id,value) {
    const resp = await this.restConnector.patch("/document/"+id, value);
    return resp.data;
  }
  
  async getDocument(){
    const resp = await this.restConnector.get("/document/documents");
    return resp.data;
  }

  async getListDocumentByAdmin(){
    const resp = await this.restConnector.get("/document/manager");
    return resp.data;
  }

  async getDetailDocument(id){
    const resp = await this.restConnector.get("/document/details/"+id);
    return resp.data;
  }

  async getDocumentTest(){
    const resp = await this.restConnector.get("/document/ftp");
    return resp.data;
  }

  async getRate(){
    const resp = await this.restConnector.get("/rate/rates")
    return resp.data;
  }

  async updateRate(values){
    const resp = await this.restConnector.put("/rate",values)
    return resp.data;
  }

  async deleteRate(id){
    const resp = await this.restConnector.delete("/rate/"+id)
    return resp.data;
  }

  async createRate(values){
    const resp = await this.restConnector.post("/rate",values)
    return resp.data;
  }
}
