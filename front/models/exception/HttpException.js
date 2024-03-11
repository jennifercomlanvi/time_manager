export default class HttpException {
  constructor(res) {
    this.status = res.status;
    this.data = res.data;
  }
}
